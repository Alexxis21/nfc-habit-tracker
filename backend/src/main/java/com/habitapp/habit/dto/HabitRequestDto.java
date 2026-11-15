package com.habitapp.habit.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record HabitRequestDto(
        @Schema(description = "ID of the template the habit is based on", example = "1")
        @NotNull Long templateId,
        @Schema(description = "Count of successful scans in one day to complete the habit", example = "3")
        @NotNull @Min(1) Integer dailyTargetCount,
        @Schema(description = "Time of day when the habit should be performed", allowableValues = {"RANO", "POPOLUDNIE", "WIECZOR", "CALY_DZIEN"})
        @NotNull String timeOfDay,
        @Schema(description = "Number of days per week the habit should be performed", example = "5")
        @NotNull @Min(1) Integer targetDaysPerWeek,
        @Schema(description = "Scheduled weekdays as numbers: 1 = Monday ... 7 = Sunday", example = "[1, 2, 3, 4, 5, 6, 7]")
        @NotEmpty List<Integer> scheduledDays,
        @Schema(description = "Whether reminders are enabled for the habit", example = "true")
        Boolean remindersEnabled
) {}