package com.habitapp.stats.dto;

import java.util.List;

public record StatsResponseDto(
    String range,
    long totalScans,
    int completionRatePercentage,
    List<DayStatsDto> days,
    List<CategoryStatsDto> categoryBreakdown,
    List<HabitStatsDto> habits
) {}