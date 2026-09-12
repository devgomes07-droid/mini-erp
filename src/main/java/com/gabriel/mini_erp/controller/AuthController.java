package com.gabriel.mini_erp.controller;

import com.gabriel.mini_erp.dto.request.LoginRequestDTO;
import com.gabriel.mini_erp.dto.request.RegisterRequestDTO;
import com.gabriel.mini_erp.dto.response.AuthResponseDTO;
import com.gabriel.mini_erp.entity.User;
import com.gabriel.mini_erp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/me")
    public ResponseEntity<Void> excluirConta(@AuthenticationPrincipal User usuarioLogado) {
        authService.excluirConta(usuarioLogado.getId());
        return ResponseEntity.noContent().build(); // 204
    }
}