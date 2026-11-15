package com.habitapp.stats.dto;

import java.time.LocalDate;

public record DayStatsDto(
    LocalDate date,
    long scans,
    int completedHabits){}
