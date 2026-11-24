package com.habitapp.friend;

import jakarta.persistence.*;
import com.habitapp.auth.User;
import java.time.Instant;

@Entity 
@Table (name = "friendship")
public class Friendship {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_id", nullable = false)
    private User friend;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendshipStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Friendship() {
    }

    public Friendship(User user, User friend){
        this.user = user;
        this.friend = friend;
        this.status = FriendshipStatus.PENDING;
        
    }

    @PrePersist protected void onCreate(){
        this.createdAt = Instant.now();
    }

    public void accept(){
        this.status = FriendshipStatus.ACCEPTED;
    }

    public Long getId() {return id;}
    public User getUser() {return user;}
    public User getFriend() {return friend;}
    public FriendshipStatus getStatus() {return status;}
    public Instant getCreatedAt() {return createdAt;}

}
