package com.habitapp.scan;

import com.habitapp.habit.Habit;
import com.habitapp.habit.HabitNotFoundException;
import com.habitapp.habit.HabitRepository;
import com.habitapp.scan.dto.TagResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class NfcTagService {

    private final NfcTagRepository nfcTagRepository;
    private final HabitRepository habitRepository;
    private final String scanUrlBase;

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int TAG_ID_BYTES = 16;

    public NfcTagService(
            NfcTagRepository nfcTagRepository,
            HabitRepository habitRepository,
            @Value("${app.nfc.scan-url:https://habitapp.pl/scan}") String scanUrlBase
    ) {
        this.nfcTagRepository = nfcTagRepository;
        this.habitRepository = habitRepository;
        this.scanUrlBase = scanUrlBase;
    }

    public TagResponseDto assignTag(Long userId, Long habitId) {
        Habit habit = habitRepository.findByIdAndUserId(habitId, userId)
                .orElseThrow(() -> new HabitNotFoundException(habitId));

        if (nfcTagRepository.existsByHabitId(habitId)) {
            throw new TagAlreadyAssignedException("This habit already has an NFC tag assigned.");
        }

        String tagId = generateTagId();
        NfcTag tag = nfcTagRepository.save(new NfcTag(habit, tagId, buildNdefUrl(tagId)));

        return new TagResponseDto(tag.getId(), habitId, tag.getTagId(), tag.getNdefUrl(), tag.getCreatedAt());
    }

    private String generateTagId() {
        byte[] bytes = new byte[TAG_ID_BYTES];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String buildNdefUrl(String tagId) {
        return UriComponentsBuilder.fromUriString(scanUrlBase)
                .queryParam("tagId", tagId)
                .build()
                .encode()
                .toUriString();
    }
}