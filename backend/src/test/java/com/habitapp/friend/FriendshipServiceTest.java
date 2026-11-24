package com.habitapp.friend;

import com.habitapp.auth.User;
import com.habitapp.auth.UserRepository;
import com.habitapp.friend.dto.FriendDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FriendshipServiceTest {

    @Mock
    private FriendshipRepository friendshipRepository;

    @Mock
    private UserRepository userRepository;

    private FriendshipService service;
    private User me;
    private User ewa;

    @BeforeEach
    void setUp() {
        service = new FriendshipService(friendshipRepository, userRepository);
        me = user(1L, "test@example.com", "Test User");
        ewa = user(2L, "ewa@example.com", "Ewa");
    }

    @Test
    void invite_brakRelacji_tworzyZaproszenieWyslane() {
        when(userRepository.findByEmail("ewa@example.com")).thenReturn(Optional.of(ewa));
        when(friendshipRepository.findBetween(1L, 2L)).thenReturn(Optional.empty());
        when(friendshipRepository.save(any(Friendship.class))).thenAnswer(inv -> inv.getArgument(0));

        FriendDto dto = service.invite(me, "ewa@example.com");

        assertThat(dto.relation()).isEqualTo(FriendRelation.INVITATION_SENT);
        assertThat(dto.userId()).isEqualTo(2L);
        assertThat(dto.displayName()).isEqualTo("Ewa");
    }

    @Test
    void invite_drugaStronaZaprosilaWczesniej_akceptujeBezNowegoZapisu() {
        Friendship incoming = new Friendship(ewa, me);
        when(userRepository.findByEmail("ewa@example.com")).thenReturn(Optional.of(ewa));
        when(friendshipRepository.findBetween(1L, 2L)).thenReturn(Optional.of(incoming));

        FriendDto dto = service.invite(me, "ewa@example.com");

        assertThat(dto.relation()).isEqualTo(FriendRelation.FRIEND);
        assertThat(incoming.getStatus()).isEqualTo(FriendshipStatus.ACCEPTED);
        verify(friendshipRepository, never()).save(any());
    }

    private static User user(Long id, String email, String displayName) {
        User user = new User(email, "hash", displayName);
        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }
}