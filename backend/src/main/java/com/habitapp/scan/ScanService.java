package com.habitapp.scan;

import com.habitapp.auth.User;
import com.habitapp.habit.Habit;
import com.habitapp.habit.HabitRepository;
import com.habitapp.scan.dto.ScanResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

@Service
public class ScanService {

    private final NfcTagRepository nfcTagRepository;
    private final ScanLogRepository scanLogRepository;
    private final HabitRepository habitRepository;
    private final Clock clock;
    private final ScanProgress scanProgress;

    public ScanService(
            NfcTagRepository nfcTagRepository,
            ScanLogRepository scanLogRepository,
            HabitRepository habitRepository,
            Clock clock,
            ScanProgress scanProgress
    ) {
        this.nfcTagRepository = nfcTagRepository;
        this.scanLogRepository = scanLogRepository;
        this.habitRepository = habitRepository;
        this.clock = clock;
        this.scanProgress = scanProgress;
    }

    @Transactional(noRollbackFor = DuplicateScanException.class)
    public ScanResponseDto scan(User user, String tagId, String timeZone) {
        ZoneId zone = scanProgress.parseZone(timeZone);
        Instant now = clock.instant();

        NfcTag tag = nfcTagRepository.findByTagId(tagId)
                .orElseThrow(TagNotAssignedException::new);
        Habit habit = tag.getHabit();
        if (!habit.getUser().getId().equals(user.getId())) {
            throw new TagNotAssignedException();
        }

        Optional<ScanLog> lastSuccess = scanLogRepository
                .findFirstByNfcTagIdAndStatusOrderByScannedAtDesc(tag.getId(), ScanStatus.SUCCESS);
        if (lastSuccess.isPresent() && ScanRules.isInCooldown(lastSuccess.get().getScannedAt(), now)) {
            scanLogRepository.save(new ScanLog(habit, tag, user, now, ScanStatus.REJECTED_COOLDOWN, 0));
            throw new DuplicateScanException();
        }

        LocalDate today = now.atZone(zone).toLocalDate();
        int target = habit.getDailyTargetCount();

        long countBefore = scanProgress.countSuccessfulScans(habit.getId(), today, zone);
        long countAfter = countBefore + 1;

        if (countBefore < target && countAfter >= target) {
            int nextStreak = ScanRules.nextStreak(
                    habit.getCurrentStreak(),
                    today,
                    habit.getScheduledDays(),
                    day -> scanProgress.countSuccessfulScans(habit.getId(), day, zone) >= target
            );
            habit.setCurrentStreak(nextStreak);
            habitRepository.save(habit);
        }

        int points = ScanRules.pointsForScan(habit.getCurrentStreak(), countAfter, target);
        scanLogRepository.save(new ScanLog(habit, tag, user, now, ScanStatus.SUCCESS, points));

        return new ScanResponseDto(
                habit.getId(),
                now,
                countAfter,
                target,
                countAfter >= target,
                habit.getCurrentStreak(),
                points
        );
    }
}