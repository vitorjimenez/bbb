package com.bbb.sboot_user.service;

import com.bbb.sboot_user.Util.Exception.UsuarioException;
import com.bbb.sboot_user.model.Usuario;
import com.bbb.sboot_user.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    String response = "";

    private final String serviceLog = "[ USUARIO SERVICE ]";

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public boolean isUsuarioValido(Usuario usuario) {
        return !Objects.equals(usuario.getEmail(), "")
                && !Objects.equals(usuario.getNome(), "")
                && !Objects.equals(usuario.getSenha(), "")
                && !Objects.equals(usuario.getTelefone(), "");
    }

    public ResponseEntity<String> registro(Usuario usuario) {
        logger.info(serviceLog + ": REGISTRAR USUÁRIO + " + usuario.toString());
        if (!isUsuarioValido(usuario)) {
            logger.warn(serviceLog + ": USUARIO INVÁLIDO");
            response = "Todos os campos precisam estar preenchidos.";
            return ResponseEntity.status(400).body(response);
        }

        try {
            logger.info(serviceLog + ": SUCESSO AO REGISTRAR USUÁRIO -> " + usuario.toString());
            usuario.setUsuarioEnum("ATIVO");
            usuario.setCriadoEm(LocalDateTime.now());
            repository.save(usuario);
            response = "Sucesso ao registrar usuário.";
            return ResponseEntity.status(200).body(response);
        } catch (UsuarioException e) {
            logger.warn(serviceLog + ": FALHA AO REGISTRAR USUÁRIO " + usuario.toString());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    public ResponseEntity<String> login(String email, String senha) {
        logger.info(serviceLog + ": LOGIN DE USUÁRIO");
        try {
            if (email == null || senha == null || email.isEmpty() || senha.isEmpty()) {
                logger.warn(serviceLog + ": SENHA E LOGIN SÃO OBRIGATÓRIOS");
                return ResponseEntity.status(400).body("E-mail e senha são obrigatórios.");
            }

            Optional<Usuario> usuarioOpt = repository.findByEmail(email);

            if (usuarioOpt.isEmpty()) {
                logger.warn(serviceLog + ":  USUÁRIO NÃO ENCONTRADO. ");
                return ResponseEntity.status(404).body("Usuário não encontrado.");
            }

            Usuario usuario = usuarioOpt.get();

            if (!usuario.getSenha().equals(senha)) {
                logger.warn(serviceLog + ":  SENHA INCORRETA ");
                return ResponseEntity.status(401).body("Senha incorreta.");
            }

            if (!"ATIVO".equalsIgnoreCase(usuario.getUsuarioEnum())) {
                return ResponseEntity.status(403).body("Conta inativa. Entre em contato com o suporte.");
            }
            logger.info(serviceLog + ": LOGIN REALIZADO COM SUCESSO. ");
            return ResponseEntity.status(200).body("Login realizado com sucesso");

        } catch (Exception e) {
            logger.warn(serviceLog + ":  FALHA AO REALIZAR LOGIN ");
            return ResponseEntity.status(500).body("Erro ao realizar login: " + e.getMessage());
        }
    }
}
