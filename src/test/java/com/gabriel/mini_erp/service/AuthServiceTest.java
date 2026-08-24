package com.gabriel.mini_erp.service;

import com.gabriel.mini_erp.dto.request.LoginRequestDTO;
import com.gabriel.mini_erp.dto.request.RegisterRequestDTO;
import com.gabriel.mini_erp.dto.response.AuthResponseDTO;
import com.gabriel.mini_erp.entity.User;
import com.gabriel.mini_erp.repository.UserRepository;
import com.gabriel.mini_erp.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;
    private RegisterRequestDTO registerDTO;
    private LoginRequestDTO loginDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("gabriel@teste.com");
        user.setSenha("hash-da-senha");

        registerDTO = new RegisterRequestDTO();
        registerDTO.setEmail("gabriel@teste.com");
        registerDTO.setSenha("123456");

        loginDTO = new LoginRequestDTO();
        loginDTO.setEmail("gabriel@teste.com");
        loginDTO.setSenha("123456");
    }

    @Test
    void deveRegistrarUsuarioComSucesso() {
        when(userRepository.existsByEmail("gabriel@teste.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("hash-da-senha");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.gerarToken(user)).thenReturn("token-gerado");

        AuthResponseDTO resultado = authService.registrar(registerDTO);

        assertThat(resultado.getToken()).isEqualTo("token-gerado");
        assertThat(resultado.getEmail()).isEqualTo("gabriel@teste.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deveLancarExcecaoAoRegistrarEmailDuplicado() {
        when(userRepository.existsByEmail("gabriel@teste.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.registrar(registerDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email já cadastrado");

        verify(userRepository, never()).save(any());
    }

    @Test
    void deveLogarComSucesso() {
        when(userRepository.findByEmail("gabriel@teste.com")).thenReturn(Optional.of(user));
        when(jwtService.gerarToken(user)).thenReturn("token-gerado");

        AuthResponseDTO resultado = authService.login(loginDTO);

        assertThat(resultado.getToken()).isEqualTo("token-gerado");
        assertThat(resultado.getEmail()).isEqualTo("gabriel@teste.com");
        verify(authenticationManager, times(1)).authenticate(any());
    }
}