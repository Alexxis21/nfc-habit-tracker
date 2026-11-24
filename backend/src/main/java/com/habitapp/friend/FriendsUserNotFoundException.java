package com.habitapp.friend;

public class FriendsUserNotFoundException extends RuntimeException {
    public FriendsUserNotFoundException(String email) {
        super("User with email " + email + " not found");
    }
    
}
