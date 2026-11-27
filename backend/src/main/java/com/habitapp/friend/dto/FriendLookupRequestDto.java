package com.habitapp.friend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record FriendLookupRequestDto(@NotBlank @Email String email) {}
