package com.habitapp.friend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    @Query("select f from Friendship f " + " where (f.user.id = :a and f.friend.id = :b) or (f.user.id = :b and f.friend.id = :a)")
    Optional<Friendship> findBetween(@Param("a") Long a, @Param("b") Long b);

    @Query("select f from Friendship f join fetch f.user join fetch f.friend " + "where f.user.id = :userId or f.friend.id = :userId")
    List<Friendship> findAllInvolving(@Param("userId") Long userId);
    
}
