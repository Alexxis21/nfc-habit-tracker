package com.habitapp.friend.dto;

import com.habitapp.friend.FriendRelation;

public record FriendDto(
    Long friendshipId,
    Long userId,
    String displayName,
    String email,
    FriendRelation relation){}
