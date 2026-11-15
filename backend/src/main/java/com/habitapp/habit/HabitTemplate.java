package com.habitapp.habit;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "habit_template")
public class HabitTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private HabitCategory category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String icon;

    @Column(name = "default_daily_target_count", nullable = false)
    private Integer defaultDailyTargetCount;

    @Column(name = "unit_label")
    private String unitLabel;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_time_of_day", nullable = false)
    private TimeOfDay defaultTimeOfDay;

    @Column(name = "default_target_days_per_week", nullable = false)
    private Integer defaultTargetDaysPerWeek;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected HabitTemplate() {
    }

    public HabitTemplate(HabitCategory category, String title, String icon,
                          Integer defaultDailyTargetCount, String unitLabel,
                          TimeOfDay defaultTimeOfDay, Integer defaultTargetDaysPerWeek) {
        this.category = category;
        this.title = title;
        this.icon = icon;
        this.defaultDailyTargetCount = defaultDailyTargetCount;
        this.unitLabel = unitLabel;
        this.defaultTimeOfDay = defaultTimeOfDay;
        this.defaultTargetDaysPerWeek = defaultTargetDaysPerWeek;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public HabitCategory getCategory() { return category; }
    public String getTitle() { return title; }
    public String getIcon() { return icon; }
    public Integer getDefaultDailyTargetCount() { return defaultDailyTargetCount; }
    public String getUnitLabel() { return unitLabel; }
    public TimeOfDay getDefaultTimeOfDay() { return defaultTimeOfDay; }
    public Integer getDefaultTargetDaysPerWeek() { return defaultTargetDaysPerWeek; }
    public Instant getCreatedAt() { return createdAt; }
}