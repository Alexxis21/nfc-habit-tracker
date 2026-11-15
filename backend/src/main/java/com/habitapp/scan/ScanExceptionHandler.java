package com.habitapp.scan;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ScanExceptionHandler {

    @ExceptionHandler(TagAlreadyAssignedException.class)
    public ResponseEntity<Map<String, String>> handleTagAlreadyAssigned(TagAlreadyAssignedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(TagNotAssignedException.class)
    public ResponseEntity<Map<String, String>> handleTagNotAssigned(TagNotAssignedException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }   

    @ExceptionHandler(DuplicateScanException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateScan(DuplicateScanException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }
}