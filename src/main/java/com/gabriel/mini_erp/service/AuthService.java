package com.gabriel.mini_erp.service;

import com.gabriel.mini_erp.dto.request.LoginRequestDTO;
import com.gabriel.mini_erp.dto.request.RegisterRequestDTO;
import com.gabriel.mini_erp.dto.response.AuthResponseDTO;
import com.gabriel.mini_erp.entity.User;
import com.gabriel.mini_erp.exception.RecursoNaoEncontrado;
import com.gabriel.mini_erp.repository.UserRepository;
import com.gabriel.mini_erp.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO registrar(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.getEmail());
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setSenha(passwordEncoder.encode(dto.getSenha()));

        User salvo = userRepository.save(user);

        String token = jwtService.gerarToken(salvo);
        return new AuthResponseDTO(token, salvo.getEmail());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha())
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RecursoNaoEncontrado("Usuário não encontrado: " + dto.getEmail()));

        String token = jwtService.gerarToken(user);
        return new AuthResponseDTO(token, user.getEmail());
    }
}