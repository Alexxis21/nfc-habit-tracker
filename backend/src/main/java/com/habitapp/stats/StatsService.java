package com.habitapp.stats;

import com.habitapp.habit.Habit;
import com.habitapp.habit.HabitRepository;
import com.habitapp.habit.HabitTemplate;
import com.habitapp.scan.ScanLogRepository;
import com.habitapp.scan.ScanProgress;
import com.habitapp.stats.StatsCalculator.DailyScans;
import com.habitapp.stats.StatsCalculator.HabitInfo;
import com.habitapp.stats.dto.StatsResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    private static final Map<String, Integer> RANGE_DAYS = Map.of("7d", 7, "30d", 30, "90d", 90);

    private final HabitRepository habitRepository;
    private final ScanLogRepository scanLogRepository;
    private final ScanProgress scanProgress;
    private final Clock clock;

    public StatsService(
            HabitRepository habitRepository,
            ScanLogRepository scanLogRepository,
            ScanProgress scanProgress,
            Clock clock
    ) {
        this.habitRepository = habitRepository;
        this.scanLogRepository = scanLogRepository;
        this.scanProgress = scanProgress;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public StatsResponseDto getStats(Long userId, String range, String timeZone) {
        Integer days = RANGE_DAYS.get(range);
        if (days == null) {
            throw new IllegalArgumentException("Invalid range: " + range + " (allowed: 7d, 30d, 90d)");
        }

        ZoneId zone = scanProgress.parseZone(timeZone);
        LocalDate to = clock.instant().atZone(zone).toLocalDate();
        LocalDate from = to.minusDays(days - 1);
        Instant fromInstant = from.atStartOfDay(zone).toInstant();
        Instant toInstant = to.plusDays(1).atStartOfDay(zone).toInstant();

        List<HabitInfo> habits = habitRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(habit -> toInfo(habit, zone))
                .toList();

        List<DailyScans> scans = scanLogRepository
                .countSuccessfulScansPerDay(userId, zone.getId(), fromInstant, toInstant).stream()
                .map(row -> new DailyScans(row.getHabitId(), row.getDay(), row.getCount()))
                .toList();

        return StatsCalculator.calculate(range, from, to, habits, scans);
    }

    private HabitInfo toInfo(Habit habit, ZoneId zone) {
        HabitTemplate template = habit.getTemplate();
        return new HabitInfo(
                habit.getId(),
                template.getTitle(),
                template.getIcon(),
                template.getCategory().getName(),
                template.getCategory().getColorHex(),
                habit.getDailyTargetCount(),
                habit.getScheduledDays(),
                habit.getCreatedAt().atZone(zone).toLocalDate(),
                habit.getCurrentStreak()
        );
    }
}