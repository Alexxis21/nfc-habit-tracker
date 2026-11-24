package com.habitapp.scan;

public class TagNotAssignedException extends RuntimeException {
    public TagNotAssignedException() {
        super("NFC tag is not assigned to any of your habits.");
    }    
}
