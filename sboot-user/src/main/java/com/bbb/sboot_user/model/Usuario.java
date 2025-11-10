package com.bbb.sboot_user.model;

import com.bbb.sboot_user.Util.Enum.UsuarioEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "nome")
    private String nome;
    @Column(name = "telefone")
    private String telefone;
    @Column(name = "email")
    private String email;
    @Column(name = "senha")
    private String  senha;

    @Column(name = "status_conta")
    private String usuarioEnum;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    public Usuario () {}

    public Usuario(String id, String nome, String telefone, String email, String senha, String usuarioEnum) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.usuarioEnum = usuarioEnum;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getUsuarioEnum() {
        return usuarioEnum;
    }

    public void setUsuarioEnum(String usuarioEnum) {
        this.usuarioEnum = usuarioEnum;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id='" + id + '\'' +
                ", nome='" + nome + '\'' +
                ", telefone='" + telefone + '\'' +
                ", email='" + email + '\'' +
                ", senha='" + senha + '\'' +
                ", usuarioEnum='" + usuarioEnum + '\'' +
                ", criadoEm=" + criadoEm +
                '}';
    }
}
