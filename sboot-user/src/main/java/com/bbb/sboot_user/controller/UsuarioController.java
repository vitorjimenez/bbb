package com.bbb.sboot_user.controller;

import com.bbb.sboot_user.model.Usuario;
import com.bbb.sboot_user.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping(value = "/usuario")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping(value = "/registro")
    @Transactional
    public ResponseEntity<String> registrarUsuario(@RequestBody Usuario usuario) {
        return service.registro(usuario);
    }

    @PostMapping(value = "/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String senha = payload.get("senha");
        return service.login(email, senha);
    }
}
