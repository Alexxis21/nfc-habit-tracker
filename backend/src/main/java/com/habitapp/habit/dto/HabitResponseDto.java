package com.habitapp.habit.dto;

import java.time.Instant;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;


public record HabitResponseDto(
        Long id,
        @Schema (description = "ID of the template the habit is based on")
        Long templateId,
        String title,
        String icon,
        String category,
        String categoryColor,
        Integer dailyTargetCount,
        String timeOfDay,
        Integer targetDaysPerWeek,
        List<Integer> scheduledDays,
        @Schema (description = "Number of consecutive scheduled days on which the daily target was reached")
        Integer currentStreak,
        Boolean remindersEnabled,
        Instant createdAt,
        @Schema(description = "ID of the NFC tag associated with the habit, if any", nullable = true)
        String nfcTagId,
        @Schema(description = "Address written on the sticker", nullable = true)
        String nfcTagUrl,
        long todayCount,
        Instant lastScannedAt
) {}