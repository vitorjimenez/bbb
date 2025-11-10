package com.bbb.sboot_user.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "votos")
public class Voto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", referencedColumnName = "id", nullable = false)
    private Participante participante;

    @Column(name = "vote_time", nullable = false)
    private LocalDateTime voteTime;

    public Voto() {}

    public Voto(String id, Usuario usuario, Participante participante, LocalDateTime voteTime) {
        this.id = id;
        this.usuario = usuario;
        this.participante = participante;
        this.voteTime = voteTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Participante getParticipante() {
        return participante;
    }

    public void setParticipante(Participante participante) {
        this.participante = participante;
    }

    public LocalDateTime getVoteTime() {
        return voteTime;
    }

    public void setVoteTime(LocalDateTime voteTime) {
        this.voteTime = voteTime;
    }

    @Override
    public String toString() {
        return "Voto{" +
                "id='" + id + '\'' +
                ", usuario=" + (usuario != null ? usuario.getId() : "null") +
                ", participante=" + (participante != null ? participante.getId() : "null") +
                ", voteTime=" + voteTime +
                '}';
    }
}