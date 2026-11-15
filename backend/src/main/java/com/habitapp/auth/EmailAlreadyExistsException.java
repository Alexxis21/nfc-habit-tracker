package com.habitapp.auth;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("Konto z adresem e-mail " + email + " już istnieje");
    }
}