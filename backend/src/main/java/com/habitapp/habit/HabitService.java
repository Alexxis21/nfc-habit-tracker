package com.habitapp.habit;

import com.habitapp.auth.User;
import com.habitapp.habit.dto.HabitRequestDto;
import com.habitapp.habit.dto.HabitResponseDto;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Optional;

import com.habitapp.scan.NfcTagRepository;
import com.habitapp.scan.ScanLogRepository;
import com.habitapp.scan.ScanProgress;
import com.habitapp.scan.NfcTag;
import com.habitapp.scan.ScanLog;
import com.habitapp.scan.ScanStatus;

import java.util.List;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitTemplateRepository habitTemplateRepository;
    private final NfcTagRepository nfcTagRepository;
    private final ScanLogRepository scanLogRepository;
    private final ScanProgress scanProgress;

    public HabitService(HabitRepository habitRepository, 
        HabitTemplateRepository habitTemplateRepository,
        NfcTagRepository nfcTagRepository,
        ScanLogRepository scanLogRepository,
        ScanProgress scanProgress) {
        this.habitRepository = habitRepository;
        this.habitTemplateRepository = habitTemplateRepository;
        this.nfcTagRepository = nfcTagRepository;
        this.scanLogRepository = scanLogRepository;
        this.scanProgress = scanProgress;
    }

    public List<HabitResponseDto> getHabitsForUser(Long userId, String timeZone) {
        ZoneId zone = scanProgress.parseZone(timeZone);
        return habitRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(habit -> toDto(habit, zone))
                .toList();
    }

    public HabitResponseDto createHabit(User user, HabitRequestDto request) {
        HabitTemplate template = findTemplateOrThrow(request.templateId());

        Habit habit = new Habit(
                user,
                template,
                request.dailyTargetCount(),
                parseTimeOfDay(request.timeOfDay()),
                request.targetDaysPerWeek(),
                request.scheduledDays()
        );
        if (request.remindersEnabled() != null) {
            habit.setRemindersEnabled(request.remindersEnabled());
        }

        return toDto(habitRepository.save(habit), scanProgress.parseZone(null));
    }

    public HabitResponseDto updateHabit(Long userId, Long habitId, HabitRequestDto request) {
        Habit habit = habitRepository.findByIdAndUserId(habitId, userId)
                .orElseThrow(() -> new HabitNotFoundException(habitId));

        if (!habit.getTemplate().getId().equals(request.templateId())) {
            throw new IllegalArgumentException("Nie można zmienić szablonu istniejącego nawyku");
        }

        habit.setDailyTargetCount(request.dailyTargetCount());
        habit.setTimeOfDay(parseTimeOfDay(request.timeOfDay()));
        habit.setTargetDaysPerWeek(request.targetDaysPerWeek());
        habit.setScheduledDays(request.scheduledDays());
        if (request.remindersEnabled() != null) {
            habit.setRemindersEnabled(request.remindersEnabled());
        }

        return toDto(habitRepository.save(habit), scanProgress.parseZone(null));
    }

    public void deleteHabit(Long userId, Long habitId) {
        Habit habit = habitRepository.findByIdAndUserId(habitId, userId)
                .orElseThrow(() -> new HabitNotFoundException(habitId));
        habitRepository.delete(habit);
    }

    private HabitTemplate findTemplateOrThrow(Long templateId) {
        return habitTemplateRepository.findById(templateId)
                .orElseThrow(() -> new HabitTemplateNotFoundException(templateId));
    }

    private TimeOfDay parseTimeOfDay(String value) {
        try {
            return TimeOfDay.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Nieprawidłowa wartość timeOfDay: " + value);
        }
    }

    private HabitResponseDto toDto(Habit habit, ZoneId zone) {
        HabitTemplate template = habit.getTemplate();

        Optional<NfcTag> nfcTag = nfcTagRepository.findByHabitId(habit.getId());
        String nfcTagId = nfcTag.map(NfcTag::getTagId).orElse(null);
        String nfcTagUrl = nfcTag.map(NfcTag::getNdefUrl).orElse(null);

        Instant lastScannedAt = scanLogRepository
        .findFirstByHabitIdAndStatusOrderByScannedAtDesc(habit.getId(), ScanStatus.SUCCESS)
        .map(ScanLog::getScannedAt)
        .orElse(null);

        return new HabitResponseDto(
                habit.getId(),
                template.getId(),
                template.getTitle(),
                template.getIcon(),
                template.getCategory().getName(),
                template.getCategory().getColorHex(),
                habit.getDailyTargetCount(),
                habit.getTimeOfDay().name(),
                habit.getTargetDaysPerWeek(),
                habit.getScheduledDays(),
                habit.getCurrentStreak(),
                habit.getRemindersEnabled(),
                habit.getCreatedAt(),
                nfcTagId,
                nfcTagUrl,
                scanProgress.countToday(habit.getId(), zone),
                lastScannedAt   
        );
    }
}