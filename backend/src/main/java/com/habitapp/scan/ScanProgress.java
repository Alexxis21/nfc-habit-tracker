package com.habitapp.scan;

import org.springframework.stereotype.Component;
import java.time.ZoneId;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.DateTimeException;


@Component 
public class ScanProgress {
    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Europe/Warsaw");

    private final ScanLogRepository scanLogRepository;
    private final Clock clock;

    public ScanProgress(ScanLogRepository scanLogRepository, Clock clock) {
        this.scanLogRepository = scanLogRepository;
        this.clock = clock;
    }

    public ZoneId parseZone(String timeZone) {
        if (timeZone == null || timeZone.isBlank()) {
            return DEFAULT_ZONE;
        }
        try {
            return ZoneId.of(timeZone);
        } catch (DateTimeException e) {
            throw new IllegalArgumentException("Niepoprawna strefa czasowa: " + timeZone);
        }
    }

    public long countToday(Long habitId, ZoneId zone) {
        LocalDate today = clock.instant().atZone(zone).toLocalDate();
        return countSuccessfulScans(habitId, today, zone);
    }

    public long countSuccessfulScans(Long habitId, LocalDate day, ZoneId zone) {
        Instant from = day.atStartOfDay(zone).toInstant();
        Instant to = day.plusDays(1).atStartOfDay(zone).toInstant();
        return scanLogRepository.countByHabitIdAndStatusAndScannedAtGreaterThanEqualAndScannedAtLessThan(habitId, ScanStatus.SUCCESS, from, to);
    }

}
