package com.habitapp.stats;

import com.habitapp.stats.dto.CategoryStatsDto;
import com.habitapp.stats.dto.DayStatsDto;
import com.habitapp.stats.dto.HabitStatsDto;
import com.habitapp.stats.dto.StatsResponseDto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class StatsCalculator {

    public record HabitInfo(
            Long id,
            String title,
            String icon,
            String category,
            String categoryColor,
            int dailyTarget,
            List<Integer> scheduledDays,
            LocalDate createdOn,
            int currentStreak
    ) {}

    public record DailyScans(Long habitId, LocalDate day, long count) {}

    private StatsCalculator() {
    }

    public static StatsResponseDto calculate(
            String range,
            LocalDate from,
            LocalDate to,
            List<HabitInfo> habits,
            List<DailyScans> scans
    ) {
        Map<Long, Map<LocalDate, Long>> countsByHabit = new HashMap<>();
        for (DailyScans scan : scans) {
            countsByHabit
                    .computeIfAbsent(scan.habitId(), id -> new HashMap<>())
                    .merge(scan.day(), scan.count(), Long::sum);
        }

        List<DayStatsDto> days = new ArrayList<>();
        Map<Long, Long> scansByHabit = new HashMap<>();
        long totalScans = 0;

        for (LocalDate day = from; !day.isAfter(to); day = day.plusDays(1)) {
            long scansThatDay = 0;
            int completedHabits = 0;
            for (HabitInfo habit : habits) {
                long count = countsByHabit.getOrDefault(habit.id(), Map.of()).getOrDefault(day, 0L);
                scansThatDay += count;
                scansByHabit.merge(habit.id(), count, Long::sum);
                if (count >= habit.dailyTarget()) {
                    completedHabits++;
                }
            }
            totalScans += scansThatDay;
            days.add(new DayStatsDto(day, scansThatDay, completedHabits));
        }

        long scheduledTotal = 0;
        long completedTotal = 0;
        List<HabitStatsDto> habitStats = new ArrayList<>();
        Map<String, String> colorByCategory = new LinkedHashMap<>();
        Map<String, Long> scansByCategory = new LinkedHashMap<>();

        for (HabitInfo habit : habits) {
            int[] progress = scheduledAndCompleted(
                    habit, countsByHabit.getOrDefault(habit.id(), Map.of()), from, to);
            scheduledTotal += progress[0];
            completedTotal += progress[1];

            habitStats.add(new HabitStatsDto(
                    habit.id(), habit.title(), habit.icon(), habit.categoryColor(),
                    habit.currentStreak(), percent(progress[1], progress[0])));

            colorByCategory.putIfAbsent(habit.category(), habit.categoryColor());
            scansByCategory.merge(habit.category(), scansByHabit.getOrDefault(habit.id(), 0L), Long::sum);
        }

        List<CategoryStatsDto> categories = scansByCategory.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .map(entry -> new CategoryStatsDto(entry.getKey(), colorByCategory.get(entry.getKey()), entry.getValue()))
                .sorted(Comparator.comparingLong(CategoryStatsDto::scans).reversed()
                        .thenComparing(CategoryStatsDto::category))
                .toList();

        return new StatsResponseDto(
                range, totalScans, percent(completedTotal, scheduledTotal), days, categories, habitStats);
    }

    private static int[] scheduledAndCompleted(
            HabitInfo habit, Map<LocalDate, Long> counts, LocalDate from, LocalDate to) {
        int scheduled = 0;
        int completed = 0;
        for (LocalDate day = from; !day.isAfter(to); day = day.plusDays(1)) {
            if (day.isBefore(habit.createdOn())) {
                continue;
            }
            if (!habit.scheduledDays().contains(day.getDayOfWeek().getValue())) {
                continue;
            }
            boolean done = counts.getOrDefault(day, 0L) >= habit.dailyTarget();
            if (day.equals(to) && !done) {
                continue;
            }
            scheduled++;
            if (done) {
                completed++;
            }
        }
        return new int[]{scheduled, completed};
    }

    private static int percent(long done, long scheduled) {
        if (scheduled == 0) {
            return 0;
        }
        return (int) Math.round(100.0 * done / scheduled);
    }
}