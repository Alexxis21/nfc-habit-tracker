package com.habitapp.habit;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "habit_category")
public class HabitCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "color_hex", nullable = false)
    private String colorHex;

    @Column(nullable = false)
    private String icon;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected HabitCategory() {
    }

    public HabitCategory(String name, String colorHex, String icon) {
        this.name = name;
        this.colorHex = colorHex;
        this.icon = icon;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getColorHex() { return colorHex; }
    public String getIcon() { return icon; }
    public Instant getCreatedAt() { return createdAt; }
}