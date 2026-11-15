package com.habitapp.scan;

public class TagNotAssignedException extends RuntimeException {
    public TagNotAssignedException() {
        super("Ta naklejka NFC nie jest przypisana do żadnego z Twoich nawyków.");
    }    
}
