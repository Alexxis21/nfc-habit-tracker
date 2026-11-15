package com.habitapp.scan;

import com.habitapp.habit.Habit;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "nfc_tag")
public class NfcTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false, unique = true)
    private Habit habit;

    @Column(name = "tag_id", nullable = false, unique = true)
    private String tagId;

    @Column(name = "ndef_url", nullable = false)
    private String ndefUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected NfcTag() {
    }

    public NfcTag(Habit habit, String tagId, String ndefUrl) {
        this.habit = habit;
        this.tagId = tagId;
        this.ndefUrl = ndefUrl;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public Habit getHabit() { return habit; }
    public String getTagId() { return tagId; }
    public String getNdefUrl() { return ndefUrl; }
    public Instant getCreatedAt() { return createdAt; }
}