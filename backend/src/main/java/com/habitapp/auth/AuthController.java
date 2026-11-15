package com.habitapp.auth;

import com.habitapp.auth.dto.AuthResponse;
import com.habitapp.auth.dto.LoginRequest;
import com.habitapp.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Authentication", description = "Registration and login, both return a JWT access token.")
@SecurityRequirements 
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Register a new user", description = "Creates an account and returns an access token")
    @ApiResponse (responseCode = "201", description = "User registered successfully")
    @ApiResponse (responseCode = "400", description = "Invalid input data")
    @ApiResponse (responseCode = "409", description = "User already exists")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Login a user", description = "Authenticates a user and returns an access token")
    @ApiResponse (responseCode = "200", description = "User logged in successfully")
    @ApiResponse (responseCode = "400", description = "Invalid input data")
    @ApiResponse (responseCode = "401", description = "Invalid credentials")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}