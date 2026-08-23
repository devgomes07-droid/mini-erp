package com.gabriel.mini_erp.controller;

import com.gabriel.mini_erp.dto.request.LoginRequestDTO;
import com.gabriel.mini_erp.dto.request.RegisterRequestDTO;
import com.gabriel.mini_erp.dto.response.AuthResponseDTO;
import com.gabriel.mini_erp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO dto) {
        AuthResponseDTO response = authService.registrar(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}