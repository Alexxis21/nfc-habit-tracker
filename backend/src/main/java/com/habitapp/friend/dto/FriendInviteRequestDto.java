package com.habitapp.friend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record FriendInviteRequestDto(@Schema(description = "Email address of the registered user to invite", example = "user@example.com")
    @NotBlank @Email String email) {}
