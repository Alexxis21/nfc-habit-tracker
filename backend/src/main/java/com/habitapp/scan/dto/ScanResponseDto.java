package com.habitapp.scan.dto;

import java.time.Instant;
import io.swagger.v3.oas.annotations.media.Schema;

public record ScanResponseDto(
    Long habitId,
    @Schema(description = "Time at which the scan was registered")
    Instant scannedAt,
    long todayCount,
    int dailyTargetCount,
    boolean completedToday,
    int currentStreak,
    int pointsAwarded
) {
    
}
