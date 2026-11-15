package com.habitapp.scan;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.function.Predicate;

public final class ScanRules {

    public static final Duration COOLDOWN = Duration.ofMinutes(5);
    private static final int BASE_POINTS = 10;
    private static final int STREAK_BONUS_PER_DAY = 2;
    private static final int MAX_STREAK_BONUS = 50;

    private ScanRules() {
    }

    public static boolean isInCooldown(Instant lastSuccessfulScan, Instant now) {
        return lastSuccessfulScan.plus(COOLDOWN).isAfter(now);
    }

    public static int nextStreak(int currentStreak, LocalDate today,
                                 List<Integer> scheduledDays, Predicate<LocalDate> wasCompleted) {
        for (int daysBack = 1; daysBack <= 7; daysBack++) {
            LocalDate day = today.minusDays(daysBack);
            if (scheduledDays.contains(day.getDayOfWeek().getValue())) {
                return wasCompleted.test(day) ? currentStreak + 1 : 1;
            }
        }
        return 1;
    }

    public static int pointsFor(int streak) {
        return BASE_POINTS + Math.min(streak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
    }
}