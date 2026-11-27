package com.habitapp.scan;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDate;

public interface ScanLogRepository extends JpaRepository<ScanLog, Long> {

    Optional<ScanLog> findFirstByNfcTagIdAndStatusOrderByScannedAtDesc(Long nfcTagId, ScanStatus status);

    Optional<ScanLog> findFirstByHabitIdAndStatusOrderByScannedAtDesc(Long habitId, ScanStatus status);

    long countByHabitIdAndStatusAndScannedAtGreaterThanEqualAndScannedAtLessThan(
            Long habitId, ScanStatus status, Instant fromInclusive, Instant toExclusive);

    interface DailyScanCount {
        Long getHabitId();
        LocalDate getDay();
        Long getCount();
    }

    @Query(value = """
        SELECT habit_id AS habitId,
                   (scanned_at AT TIME ZONE :zone)::date AS day,
                   COUNT(*) AS count
            FROM scan_log
            WHERE user_id = :userId
              AND status = 'SUCCESS'
              AND scanned_at >= :from
              AND scanned_at < :to
            GROUP BY habit_id, day
            """, nativeQuery = true)

     List<DailyScanCount> countSuccessfulScansPerDay(
            @Param("userId") Long userId,
            @Param("zone") String zone,
            @Param("from") Instant from,
            @Param("to") Instant to);
            
}