package com.habitapp.friend;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.Optional;

import com.habitapp.auth.User;
import com.habitapp.auth.UserRepository;
import com.habitapp.friend.dto.FriendDto;
import java.util.List;


@Service 
public class FriendshipService {
    
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    @Transactional 
    public FriendDto invite(User me, String email){
        String trimmed = email.trim();
        User target = userRepository.findByEmail(trimmed).orElseThrow(() -> new FriendsUserNotFoundException(trimmed));
        if (target.getId().equals(me.getId())){
            throw new IllegalArgumentException("Cannot invite yourself as a friend");
        }

        Optional<Friendship> existing = friendshipRepository.findBetween(me.getId(), target.getId());
        if(existing.isEmpty()){
            try {
                Friendship created = friendshipRepository.save(new Friendship(me, target));
                return toDto(created, me.getId());
            } catch (DataIntegrityViolationException e) {
                throw new FriendshipConflictException("Friendship already exists");
            }
        }

        Friendship friendship = existing.get();
        if (friendship.getStatus() == FriendshipStatus.ACCEPTED){
            throw new FriendshipConflictException("Friendship already exists");
        } 
        if (friendship.getUser().getId().equals(me.getId())){
            throw new FriendshipConflictException("Friendship invitation already sent");
        }
        friendship.accept();
        return toDto(friendship, me.getId());
    }

    @Transactional 
    public FriendDto accept(User me, Long friendshipId){
        Friendship friendship = friendshipRepository.findById(friendshipId).filter(f -> f.getFriend().getId().equals(me.getId())).orElseThrow(FriendshipNotFoundException::new);
        
        if (friendship.getStatus() == FriendshipStatus.ACCEPTED){
            throw new FriendshipConflictException("Friendship already accepted");
        }
        friendship.accept();
        return toDto(friendship, me.getId());
    } 

    @Transactional 
    public void remove(User me, Long friendshipId){
        Friendship friendship = friendshipRepository.findById(friendshipId).filter(f -> f.getUser().getId().equals(me.getId()) || f.getFriend().getId().equals(me.getId())).orElseThrow(FriendshipNotFoundException::new);
        friendshipRepository.delete(friendship);
    }

    @Transactional(readOnly = true)
    public List<FriendDto> list(User me){
        return friendshipRepository.findAllInvolving(me.getId()).stream().map(f -> toDto(f, me.getId())).toList();
    }

    private FriendDto toDto(Friendship friendship, Long myId){
        boolean iAmSender = friendship.getUser().getId().equals(myId);
        User other = iAmSender ? friendship.getFriend() : friendship.getUser();
        FriendRelation relation;
        if (friendship.getStatus() == FriendshipStatus.ACCEPTED){
            relation = FriendRelation.FRIEND;
        } else if (iAmSender){
            relation = FriendRelation.INVITATION_SENT;
        } else {
            relation = FriendRelation.INVITATION_RECEIVED;
        }
        return new FriendDto(friendship.getId(), other.getId(), other.getDisplayName(), other.getEmail(), relation);
    }
}
