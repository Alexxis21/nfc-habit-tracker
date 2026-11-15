package com.habitapp.scan;

public class TagAlreadyAssignedException extends RuntimeException {
    public TagAlreadyAssignedException(String message) {
        super(message);
    }
}