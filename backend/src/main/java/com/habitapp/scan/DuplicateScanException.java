package com.habitapp.scan;

public class DuplicateScanException extends RuntimeException {
    public DuplicateScanException() {
        super("Skan został już zarejestrowany w ciągu ostatnich 5 minut. Odczekaj chwilę przed kolejnym zbliżeniem tagu.");
    }
    
}
