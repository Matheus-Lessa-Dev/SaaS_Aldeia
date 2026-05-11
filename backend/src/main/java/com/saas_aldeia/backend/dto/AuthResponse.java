package com.saas_aldeia.backend.dto;

public record AuthResponse(String token, String role, String email) {}