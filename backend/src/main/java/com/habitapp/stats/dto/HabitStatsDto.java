package com.habitapp.stats.dto;

public record HabitStatsDto(Long habitId, String title, String icon, String categoryColor, int currentStreak, int completionPercentage) {}
