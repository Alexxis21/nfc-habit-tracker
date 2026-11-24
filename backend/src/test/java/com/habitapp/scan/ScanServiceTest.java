package com.habitapp.scan;

import com.habitapp.auth.User;
import com.habitapp.habit.Habit;
import com.habitapp.habit.HabitCategory;
import com.habitapp.habit.HabitRepository;
import com.habitapp.habit.HabitTemplate;
import com.habitapp.habit.TimeOfDay;
import com.habitapp.scan.dto.ScanResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScanServiceTest {

    private static final Instant NOW = Instant.parse("2026-10-07T10:00:00Z");
    private static final String TAG_ID = "04:AA";

    @Mock
    private NfcTagRepository nfcTagRepository;

    @Mock
    private ScanLogRepository scanLogRepository;

    @Mock
    private HabitRepository habitRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = withId(new User("test@example.com", "hash", "Test"), 1L);
    }

    @Test
    void scan_pierwszySkanDlaCeluJeden_ustawiaStreakNaJedenIPrzyznajePunkty() {
        NfcTag tag = tagFor(user, 1);
        when(nfcTagRepository.findByTagId(TAG_ID)).thenReturn(Optional.of(tag));

        ScanResponseDto response = serviceAt(NOW).scan(user, TAG_ID, null);

        assertThat(response.completedToday()).isTrue();
        assertThat(response.currentStreak()).isEqualTo(1);
        assertThat(response.pointsAwarded()).isEqualTo(12);
        verify(habitRepository).save(tag.getHabit());
    }

    @Test
    void scan_przedOsiagnieciemDziennegoCelu_nieZmieniaStreaka() {
        NfcTag tag = tagFor(user, 3);
        tag.getHabit().setCurrentStreak(5);
        when(nfcTagRepository.findByTagId(TAG_ID)).thenReturn(Optional.of(tag));

        ScanResponseDto response = serviceAt(NOW).scan(user, TAG_ID, null);

        assertThat(response.todayCount()).isEqualTo(1);
        assertThat(response.completedToday()).isFalse();
        assertThat(response.currentStreak()).isEqualTo(5);
        assertThat(response.pointsAwarded()).isEqualTo(20);
        verify(habitRepository, never()).save(any());
    }

    @Test
    void scan_wOkienkuCooldownu_zapisujeOdrzuconyLogIRzucaWyjatek() {
        NfcTag tag = tagFor(user, 1);
        ScanLog previous = new ScanLog(tag.getHabit(), tag, user, NOW.minusSeconds(60), ScanStatus.SUCCESS, 12);
        when(nfcTagRepository.findByTagId(TAG_ID)).thenReturn(Optional.of(tag));
        when(scanLogRepository.findFirstByNfcTagIdAndStatusOrderByScannedAtDesc(20L, ScanStatus.SUCCESS))
                .thenReturn(Optional.of(previous));

        assertThatThrownBy(() -> serviceAt(NOW).scan(user, TAG_ID, null))
                .isInstanceOf(DuplicateScanException.class);

        ArgumentCaptor<ScanLog> captor = ArgumentCaptor.forClass(ScanLog.class);
        verify(scanLogRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(ScanStatus.REJECTED_COOLDOWN);
        assertThat(captor.getValue().getPointsAwarded()).isZero();
        verify(habitRepository, never()).save(any());
    }

    @Test
    void scan_nieznanyTagId_rzucaWyjatek() {
        when(nfcTagRepository.findByTagId(TAG_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> serviceAt(NOW).scan(user, TAG_ID, null))
                .isInstanceOf(TagNotAssignedException.class);

        verify(scanLogRepository, never()).save(any());
    }

    @Test
    void scan_tagNalezacyDoInnegoUzytkownika_rzucaWyjatek() {
        User other = withId(new User("other@example.com", "hash", "Other"), 2L);
        NfcTag tag = tagFor(other, 1);
        when(nfcTagRepository.findByTagId(TAG_ID)).thenReturn(Optional.of(tag));

        assertThatThrownBy(() -> serviceAt(NOW).scan(user, TAG_ID, null))
                .isInstanceOf(TagNotAssignedException.class);

        verify(scanLogRepository, never()).save(any());
    }

    @Test
    void scan_tuzPoPolnocyWStrefieUzytkownika_liczonyJestDoNowegoDnia() {
        // 22:00:30 UTC = 00:00:30 następnego dnia w Warszawie (CEST, UTC+2)
        Instant justAfterMidnightInWarsaw = Instant.parse("2026-10-07T22:00:30Z");
        NfcTag tag = tagFor(user, 3);
        when(nfcTagRepository.findByTagId(TAG_ID)).thenReturn(Optional.of(tag));

        serviceAt(justAfterMidnightInWarsaw).scan(user, TAG_ID, "Europe/Warsaw");

        verify(scanLogRepository).countByHabitIdAndStatusAndScannedAtGreaterThanEqualAndScannedAtLessThan(
                10L,
                ScanStatus.SUCCESS,
                Instant.parse("2026-10-07T22:00:00Z"),
                Instant.parse("2026-10-08T22:00:00Z")
        );
    }

    @Test
    void scan_nieprawidlowaStrefaCzasowa_rzucaWyjatek() {
        assertThatThrownBy(() -> serviceAt(NOW).scan(user, TAG_ID, "Mars/Olympus"))
                .isInstanceOf(IllegalArgumentException.class);

        verify(scanLogRepository, never()).save(any());
    }

    private ScanService serviceAt(Instant instant) {
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        return new ScanService(nfcTagRepository, scanLogRepository, habitRepository, clock, new ScanProgress(scanLogRepository, clock));
    }

    private NfcTag tagFor(User owner, int dailyTarget) {
        HabitCategory category = new HabitCategory("Rozwój", "#00BFA5", "📖");
        HabitTemplate template = new HabitTemplate(category, "Czytanie", "📖", dailyTarget, null, TimeOfDay.EVENING, 7);
        Habit habit = withId(
                new Habit(owner, template, dailyTarget, TimeOfDay.EVENING, 7, List.of(1, 2, 3, 4, 5, 6, 7)),
                10L
        );
        return withId(new NfcTag(habit, TAG_ID, "https://habitapp.pl/scan?tagId=" + TAG_ID), 20L);
    }

    private static <T> T withId(T entity, Long id) {
        ReflectionTestUtils.setField(entity, "id", id);
        return entity;
    }
}