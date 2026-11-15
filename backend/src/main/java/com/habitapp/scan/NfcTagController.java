package com.habitapp.scan;

import com.habitapp.auth.UserPrincipal;
import com.habitapp.scan.dto.TagResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "NFC Tags", description = "Pairing NFC tags with habits.")
@RestController
@RequestMapping("/api/habits/{habitId}/tags")
public class NfcTagController {

    private final NfcTagService nfcTagService;

    public NfcTagController(NfcTagService nfcTagService) {
        this.nfcTagService = nfcTagService;
    }

    @Operation(summary = "Pair a tag with a habit", description = "Generates a unique NFC tag ID and returns the address that the app must write to the sticker")
    @ApiResponse(responseCode = "201", description = "Tag assigned to habit")
    @ApiResponse(responseCode = "404", description = "Habit not found")
    @ApiResponse(responseCode = "409", description = "Habit already has a tag assigned")
    @PostMapping
    public ResponseEntity<TagResponseDto> assignTag(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long habitId
    ) {
        TagResponseDto response = nfcTagService.assignTag(principal.getUser().getId(), habitId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}