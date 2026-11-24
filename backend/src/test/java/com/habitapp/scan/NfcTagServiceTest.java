package com.habitapp.scan;

import com.habitapp.habit.Habit;
import com.habitapp.habit.HabitNotFoundException;
import com.habitapp.habit.HabitRepository;
import com.habitapp.habit.TimeOfDay;
import com.habitapp.scan.dto.TagResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NfcTagServiceTest {

    private static final String SCAN_URL = "https://habitapp.pl/scan";

    @Mock
    private NfcTagRepository nfcTagRepository;

    @Mock
    private HabitRepository habitRepository;

    private NfcTagService service;
    private Habit habit;

    @BeforeEach
    void setUp() {
        service = new NfcTagService(nfcTagRepository, habitRepository, SCAN_URL);
        habit = new Habit(null, null, 1, TimeOfDay.MORNING, 7, List.of(1, 2, 3, 4, 5, 6, 7));
    }

    @Test
    void assignTag_dlaNawykuBezNaklejki_losujeTagIdIBudujeUrl() {
        when(habitRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(habit));
        when(nfcTagRepository.save(any(NfcTag.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TagResponseDto response = service.assignTag(1L, 10L);

        assertThat(response.habitId()).isEqualTo(10L);
        assertThat(response.tagId()).matches("^[A-Za-z0-9_-]{22}$");
        assertThat(response.ndefUrl()).isEqualTo(SCAN_URL + "?tagId=" + response.tagId());
    }

    @Test
    void assignTag_kolejneWywolania_dajaRozneTagId() {
        when(habitRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(habit));
        when(nfcTagRepository.save(any(NfcTag.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TagResponseDto first = service.assignTag(1L, 10L);
        TagResponseDto second = service.assignTag(1L, 10L);

        assertThat(first.tagId()).isNotEqualTo(second.tagId());
    }

    @Test
    void assignTag_nawykMaJuzNaklejke_rzucaWyjatekINieZapisuje() {
        when(habitRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(habit));
        when(nfcTagRepository.existsByHabitId(10L)).thenReturn(true);

        assertThatThrownBy(() -> service.assignTag(1L, 10L))
                .isInstanceOf(TagAlreadyAssignedException.class);

        verify(nfcTagRepository, never()).save(any());
    }

    @Test
    void assignTag_cudzyLubNieistniejacyNawyk_rzucaWyjatek() {
        when(habitRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.assignTag(1L, 10L))
                .isInstanceOf(HabitNotFoundException.class);

        verify(nfcTagRepository, never()).save(any());
    }
}