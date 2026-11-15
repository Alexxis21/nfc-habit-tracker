package com.habitapp.scan;

import com.habitapp.auth.User;
import com.habitapp.habit.Habit;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "scan_log")
public class ScanLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nfc_tag_id", nullable = false)
    private NfcTag nfcTag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "scanned_at", nullable = false)
    private Instant scannedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScanStatus status;

    @Column(name = "points_awarded", nullable = false)
    private Integer pointsAwarded;

    protected ScanLog() {
    }

    public ScanLog(Habit habit, NfcTag nfcTag, User user, Instant scannedAt,
                   ScanStatus status, Integer pointsAwarded) {
        this.habit = habit;
        this.nfcTag = nfcTag;
        this.user = user;
        this.scannedAt = scannedAt;
        this.status = status;
        this.pointsAwarded = pointsAwarded;
    }

    public Long getId() { return id; }
    public Habit getHabit() { return habit; }
    public NfcTag getNfcTag() { return nfcTag; }
    public User getUser() { return user; }
    public Instant getScannedAt() { return scannedAt; }
    public ScanStatus getStatus() { return status; }
    public Integer getPointsAwarded() { return pointsAwarded; }
}