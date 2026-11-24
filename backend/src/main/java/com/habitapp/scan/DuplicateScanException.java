package com.habitapp.scan;

public class DuplicateScanException extends RuntimeException {
    public DuplicateScanException() {
        super("Scan was already registered in the last 5 minutes. Please wait before scanning again.");
    }
    
}
