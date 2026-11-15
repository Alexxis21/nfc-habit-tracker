package com.habitapp.habit;

import com.habitapp.auth.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "habit")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private HabitTemplate template;

    @Column(name = "daily_target_count", nullable = false)
    private Integer dailyTargetCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_of_day", nullable = false)
    private TimeOfDay timeOfDay;

    @Column(name = "target_days_per_week", nullable = false)
    private Integer targetDaysPerWeek;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "scheduled_days", nullable = false)
    private List<Integer> scheduledDays;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "reminders_enabled", nullable = false)
    private Boolean remindersEnabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Habit() {
    }

    public Habit(User user, HabitTemplate template, Integer dailyTargetCount,
                 TimeOfDay timeOfDay, Integer targetDaysPerWeek, List<Integer> scheduledDays) {
        this.user = user;
        this.template = template;
        this.dailyTargetCount = dailyTargetCount;
        this.timeOfDay = timeOfDay;
        this.targetDaysPerWeek = targetDaysPerWeek;
        this.scheduledDays = scheduledDays;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public HabitTemplate getTemplate() { return template; }
    public Integer getDailyTargetCount() { return dailyTargetCount; }
    public TimeOfDay getTimeOfDay() { return timeOfDay; }
    public Integer getTargetDaysPerWeek() { return targetDaysPerWeek; }
    public List<Integer> getScheduledDays() { return scheduledDays; }
    public Integer getCurrentStreak() { return currentStreak; }
    public Boolean getRemindersEnabled() { return remindersEnabled; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setTemplate(HabitTemplate template) { this.template = template; }
    public void setDailyTargetCount(Integer dailyTargetCount) { this.dailyTargetCount = dailyTargetCount; }
    public void setTimeOfDay(TimeOfDay timeOfDay) { this.timeOfDay = timeOfDay; }
    public void setTargetDaysPerWeek(Integer targetDaysPerWeek) { this.targetDaysPerWeek = targetDaysPerWeek; }
    public void setScheduledDays(List<Integer> scheduledDays) { this.scheduledDays = scheduledDays; }
    public void setRemindersEnabled(Boolean remindersEnabled) { this.remindersEnabled = remindersEnabled; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }
}