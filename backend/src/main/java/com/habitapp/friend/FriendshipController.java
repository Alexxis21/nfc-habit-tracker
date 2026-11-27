package com.habitapp.friend;

import com.habitapp.auth.UserPrincipal;
import com.habitapp.friend.dto.FriendDto;
import com.habitapp.friend.dto.FriendInviteRequestDto;
import com.habitapp.friend.dto.FriendLookupRequestDto;
import com.habitapp.friend.dto.FriendLookupResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Friends", description = "Friend invitations and the friend list of the logged-in user.")
@RestController
@RequestMapping("/api/friends")
public class FriendshipController {

    private final FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @Operation(summary = "List friends and invitations",
            description = "Returns friends, invitations sent by the user and invitations received. The relation field tells which is which.")
    @ApiResponse(responseCode = "200", description = "List of relations (empty if the user has none)")
    @GetMapping
    public List<FriendDto> list(@AuthenticationPrincipal UserPrincipal principal) {
        return friendshipService.list(principal.getUser());
    }

    @Operation(summary = "Invite a user by e-mail",
            description = "Sends an invitation. If the other user has already invited the caller, the invitation is accepted at once and the relation becomes FRIEND.")
    @ApiResponse(responseCode = "201", description = "Invitation sent")
    @ApiResponse(responseCode = "200", description = "The other user had already invited the caller, so they are now friends")
    @ApiResponse(responseCode = "400", description = "Invalid e-mail address, or the caller invited themselves")
    @ApiResponse(responseCode = "404", description = "No user with this e-mail address")
    @ApiResponse(responseCode = "409", description = "Already friends, or the invitation was already sent")
    @PostMapping("/invite")
    public ResponseEntity<FriendDto> invite(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody FriendInviteRequestDto request
    ) {
        FriendDto dto = friendshipService.invite(principal.getUser(), request.email());
        HttpStatus status = dto.relation() == FriendRelation.FRIEND ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(dto);
    }

    @Operation(summary = "Accept an invitation",
            description = "Only the user who received the invitation can accept it.")
    @ApiResponse(responseCode = "200", description = "Invitation accepted")
    @ApiResponse(responseCode = "404", description = "Invitation not found, or it was not addressed to the caller")
    @ApiResponse(responseCode = "409", description = "Invitation already accepted")
    @PutMapping("/{id}/accept")
    public FriendDto accept(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter(description = "Id of the friendship (friendshipId from the list)", example = "1") @PathVariable Long id
    ) {
        return friendshipService.accept(principal.getUser(), id);
    }

    @Operation(summary = "Decline an invitation, withdraw it, or remove a friend",
            description = "Deletes the relation. Either of the two users can do it.")
    @ApiResponse(responseCode = "204", description = "Relation deleted")
    @ApiResponse(responseCode = "404", description = "Relation not found, or the caller is not a party to it")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter(description = "Id of the friendship (friendshipId from the list)", example = "1") @PathVariable Long id
    ) {
        friendshipService.remove(principal.getUser(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/lookup")
    public FriendLookupResponseDto lookup(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody FriendLookupRequestDto request
    ) {
        return friendshipService.lookup(principal.getUser(), request.email());
    }
}