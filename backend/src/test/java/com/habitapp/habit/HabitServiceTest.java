package com.habitapp.habit;

import com.habitapp.auth.User;
import com.habitapp.habit.dto.HabitRequestDto;
import com.habitapp.habit.dto.HabitResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.time.ZoneId;

import java.util.List;
import java.util.Optional;

import com.habitapp.scan.NfcTag;
import com.habitapp.scan.NfcTagRepository;
import com.habitapp.scan.ScanLog;
import com.habitapp.scan.ScanLogRepository;
import com.habitapp.scan.ScanProgress;
import com.habitapp.scan.ScanStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HabitServiceTest {

    @Mock
    private HabitRepository habitRepository;

    @Mock
    private HabitTemplateRepository habitTemplateRepository;

    @Mock 
    private NfcTagRepository nfcTagRepository;

    @Mock
    private ScanLogRepository scanLogRepository;

    @Mock
    private ScanProgress scanProgress;

    @InjectMocks
    private HabitService habitService;

    private User user;
    private HabitTemplate template;

    @BeforeEach
    void setUp() {
        user = new User("test@example.com", "hashed-password", "Test User");

        HabitCategory category = new HabitCategory("Zdrowie", "#0EA5E9", "💧");
        template = new HabitTemplate(category, "Picie wody", "💧", 8, "szklanek", TimeOfDay.MORNING, 7);
    }

    @Test
    void createHabit_zPoprawnymiDanymi_zwracaZapisanyNawyk() {
        HabitRequestDto request = new HabitRequestDto(1L, 8, "MORNING", 7, List.of(1, 2, 3, 4, 5, 6, 7), true);

        when(habitTemplateRepository.findById(1L)).thenReturn(Optional.of(template));
        when(habitRepository.save(any(Habit.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HabitResponseDto response = habitService.createHabit(user, request);

        assertThat(response.title()).isEqualTo("Picie wody");
        assertThat(response.category()).isEqualTo("Zdrowie");
        assertThat(response.dailyTargetCount()).isEqualTo(8);
        verify(habitRepository).save(any(Habit.class));
    }

    @Test
    void createHabit_zNieistniejacymSzablonem_rzucaWyjatek() {
        HabitRequestDto request = new HabitRequestDto(999L, 8, "MORNING", 7, List.of(1, 2, 3), true);

        when(habitTemplateRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> habitService.createHabit(user, request))
                .isInstanceOf(HabitTemplateNotFoundException.class);

        verify(habitRepository, never()).save(any());
    }

    @Test
    void createHabit_zNieprawidlowaWartosciaTimeOfDay_rzucaWyjatek() {
        HabitRequestDto request = new HabitRequestDto(1L, 8, "NIEISTNIEJACA_WARTOSC", 7, List.of(1, 2, 3), true);

        when(habitTemplateRepository.findById(1L)).thenReturn(Optional.of(template));

        assertThatThrownBy(() -> habitService.createHabit(user, request))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void updateHabit_nieistniejacegoNawyku_rzucaWyjatek() {
        HabitRequestDto request = new HabitRequestDto(1L, 8, "MORNING", 7, List.of(1, 2, 3), true);

        when(habitRepository.findByIdAndUserId(42L, 5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> habitService.updateHabit(5L, 42L, request))
                .isInstanceOf(HabitNotFoundException.class);
    }

    @Test
    void updateHabit_zInnymSzablonem_rzucaWyjatekINicNieZapisuje() {
        Habit habit = new Habit(user, template, 8, TimeOfDay.MORNING, 7, List.of(1, 2, 3, 4, 5, 6, 7));
        ReflectionTestUtils.setField(template, "id", 7L);
        HabitRequestDto request = new HabitRequestDto(8L, 8, "MORNING", 7, List.of(1, 2, 3), true);

        when(habitRepository.findByIdAndUserId(10L, 5L)).thenReturn(Optional.of(habit));

        assertThatThrownBy(() -> habitService.updateHabit(5L, 10L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("template");

        verify(habitRepository, never()).save(any());
    }

        @Test
    void getHabitsForUser_zwracaIdNaklejkiDzisiejszyPostepIOstatniSkan() {
        Habit habit = new Habit(user, template, 8, TimeOfDay.MORNING, 7, List.of(1, 2, 3, 4, 5, 6, 7));
        ReflectionTestUtils.setField(habit, "id", 10L);
        ReflectionTestUtils.setField(template, "id", 7L);
        NfcTag tag = new NfcTag(habit, "04:AA", "https://habitapp.pl/scan?tagId=04:AA");
        Instant lastScan = Instant.parse("2026-10-07T10:00:00Z");
        ZoneId zone = ZoneId.of("Europe/Warsaw");

        when(scanProgress.parseZone("Europe/Warsaw")).thenReturn(zone);
        when(habitRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(habit));
        when(nfcTagRepository.findByHabitId(10L)).thenReturn(Optional.of(tag));
        when(scanProgress.countToday(10L, zone)).thenReturn(2L);
        when(scanLogRepository.findFirstByHabitIdAndStatusOrderByScannedAtDesc(10L, ScanStatus.SUCCESS))
                .thenReturn(Optional.of(new ScanLog(habit, tag, user, lastScan, ScanStatus.SUCCESS, 12)));

        List<HabitResponseDto> result = habitService.getHabitsForUser(1L, "Europe/Warsaw");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).nfcTagId()).isEqualTo("04:AA");
        assertThat(result.get(0).todayCount()).isEqualTo(2L);
        assertThat(result.get(0).lastScannedAt()).isEqualTo(lastScan);
        assertThat(result.get(0).templateId()).isEqualTo(7L);
    }
}