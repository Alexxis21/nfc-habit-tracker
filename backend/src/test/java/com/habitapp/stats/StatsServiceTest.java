package com.habitapp.stats;

import com.habitapp.auth.User;
import com.habitapp.habit.Habit;
import com.habitapp.habit.HabitCategory;
import com.habitapp.habit.HabitRepository;
import com.habitapp.habit.HabitTemplate;
import com.habitapp.habit.TimeOfDay;
import com.habitapp.scan.ScanLogRepository;
import com.habitapp.scan.ScanLogRepository.DailyScanCount;
import com.habitapp.scan.ScanProgress;
import com.habitapp.stats.dto.StatsResponseDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    // 22:30 UTC = 00:30 następnego dnia (8.10) w Warszawie (CEST, UTC+2)
    private static final Instant JUST_AFTER_MIDNIGHT_IN_WARSAW = Instant.parse("2026-10-07T22:30:00Z");

    @Mock
    private HabitRepository habitRepository;

    @Mock
    private ScanLogRepository scanLogRepository;

    @Test
    void getStats_nieprawidlowyZakres_rzucaWyjatek() {
        assertThatThrownBy(() -> serviceAt(JUST_AFTER_MIDNIGHT_IN_WARSAW).getStats(1L, "5d", null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void getStats_przekazujeDoZapytaniaGraniceDobWStrefieUzytkownika() {
        StatsResponseDto result = serviceAt(JUST_AFTER_MIDNIGHT_IN_WARSAW).getStats(1L, "7d", "Europe/Warsaw");

        // dzisiaj w Warszawie to 8.10; zakres 2.10–8.10 => od północy 2.10 do północy 9.10 czasu warszawskiego
        verify(scanLogRepository).countSuccessfulScansPerDay(
                1L,
                "Europe/Warsaw",
                Instant.parse("2026-10-01T22:00:00Z"),
                Instant.parse("2026-10-08T22:00:00Z")
        );
        assertThat(result.days()).hasSize(7);
        assertThat(result.days().get(0).date()).isEqualTo(LocalDate.of(2026, 10, 2));
        assertThat(result.days().get(6).date()).isEqualTo(LocalDate.of(2026, 10, 8));
    }

    @Test
    void getStats_skladaNawykiIWynikZapytaniaWOdpowiedz() {
        User user = new User("test@example.com", "hash", "Test");
        HabitCategory category = new HabitCategory("Zdrowie", "#0EA5E9", "💧");
        HabitTemplate template = new HabitTemplate(category, "Picie wody", "💧", 1, null, TimeOfDay.RANO, 7);
        Habit habit = new Habit(user, template, 1, TimeOfDay.RANO, 7, List.of(1, 2, 3, 4, 5, 6, 7));
        ReflectionTestUtils.setField(habit, "id", 10L);
        ReflectionTestUtils.setField(habit, "createdAt", Instant.parse("2026-10-01T08:00:00Z"));

        DailyScanCount todayScan = mock(DailyScanCount.class);
        when(todayScan.getHabitId()).thenReturn(10L);
        when(todayScan.getDay()).thenReturn(LocalDate.of(2026, 10, 8));
        when(todayScan.getCount()).thenReturn(1L);

        when(habitRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(habit));
        when(scanLogRepository.countSuccessfulScansPerDay(
                1L, "Europe/Warsaw",
                Instant.parse("2026-10-01T22:00:00Z"), Instant.parse("2026-10-08T22:00:00Z")))
                .thenReturn(List.of(todayScan));

        StatsResponseDto result = serviceAt(JUST_AFTER_MIDNIGHT_IN_WARSAW).getStats(1L, "7d", "Europe/Warsaw");

        assertThat(result.totalScans()).isEqualTo(1);
        assertThat(result.days().get(6).completedHabits()).isEqualTo(1);
        assertThat(result.habits()).hasSize(1);
        assertThat(result.habits().get(0).title()).isEqualTo("Picie wody");
        assertThat(result.categoryBreakdown().get(0).category()).isEqualTo("Zdrowie");
    }

    private StatsService serviceAt(Instant instant) {
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        return new StatsService(habitRepository, scanLogRepository, new ScanProgress(scanLogRepository, clock), clock);
    }
}