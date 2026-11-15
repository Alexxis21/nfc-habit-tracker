package com.habitapp.habit.dto;

public record HabitTemplateResponseDto(
        Long id,
        String title,
        String icon,
        String category,
        String categoryColor,
        Integer defaultDailyTargetCount,
        String unitLabel,
        String defaultTimeOfDay,
        Integer defaultTargetDaysPerWeek
) {}