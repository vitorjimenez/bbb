package com.bbb.sboot_user.service;

import com.bbb.sboot_user.model.Participante;
import com.bbb.sboot_user.model.Usuario;
import com.bbb.sboot_user.model.Voto;
import com.bbb.sboot_user.repository.ParticipanteRepository;
import com.bbb.sboot_user.repository.UsuarioRepository;
import com.bbb.sboot_user.repository.VotoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VotoService {

    private final VotoRepository votoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ParticipanteRepository participanteRepository;

    private final String serviceLog = "[ VOTO SERVICE ]";
    private static final Logger logger = LoggerFactory.getLogger(VotoService.class);

    public VotoService(VotoRepository votoRepository,
                       UsuarioRepository usuarioRepository,
                       ParticipanteRepository participanteRepository) {
        this.votoRepository = votoRepository;
        this.usuarioRepository = usuarioRepository;
        this.participanteRepository = participanteRepository;
    }

    public ResponseEntity<String> registrarVoto(String userId, String participanteId) {
        logger.info(serviceLog + ": [INFO] REGISTRAR VOTO.");
        try {
            Optional<Participante> participanteOpt = participanteRepository.findById(participanteId);
            if (participanteOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Participante não encontrado.");
            }

            Usuario usuario = null;
            if (userId != null && !userId.isEmpty()) {
                usuario = usuarioRepository.findById(userId).orElse(null);
            }

            Voto voto = new Voto();
            voto.setUsuario(usuario);
            voto.setParticipante(participanteOpt.get());
            voto.setVoteTime(LocalDateTime.now());

            votoRepository.save(voto);
            logger.info(serviceLog + ": [INFO] VOTO REALIZADO COM SUCESSO + " + voto.getId());
            return ResponseEntity.ok("Voto registrado com sucesso!");
        } catch (Exception e) {
            logger.warn(serviceLog + ": [WARN] FALHA AO REGISTRAR VOTO.");
            return ResponseEntity.status(500).body("Erro ao registrar voto: " + e.getMessage());
        }
    }


    public ResponseEntity<List<Map<String, Object>>> buscarVotosPorParticipante() {
        logger.info(serviceLog + ": [INFO] CONSULTA - BUSCAR VOTO POR PARTICIPANTE.");
        try {
            List<Voto> votos = votoRepository.findAll();

            Map<Participante, Long> votosPorParticipante = votos.stream()
                    .collect(Collectors.groupingBy(Voto::getParticipante, Collectors.counting()));

            List<Map<String, Object>> resultado = votosPorParticipante.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> dados = new HashMap<>();
                        dados.put("id", entry.getKey().getId());
                        dados.put("nome", entry.getKey().getNome());
                        dados.put("totalVotos", entry.getValue());
                        return dados;
                    })
                    .sorted((a, b) -> Long.compare((Long) b.get("totalVotos"), (Long) a.get("totalVotos")))
                    .collect(Collectors.toList());
            logger.info(serviceLog + ": [INFO] CONSULTA REALIZADA COM SUCESSO.");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.warn(serviceLog + ": [WARN] FALHA AO REALIZAR CONSULTA.");
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    public ResponseEntity<Map<String, Object>> buscarTotalGeralVotos() {
        logger.info(serviceLog + ": [INFO] CONSULTA - BUSCAR TOTAL DE VOTOS.");
        try {
            long total = votoRepository.count();
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("totalGeralVotos", total);
            logger.info(serviceLog + ": [INFO] CONSULTA REALIZADA COM SUCESSO");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.warn(serviceLog + ": [WARN] * FALHA NA CONSULTA.");
            return ResponseEntity.status(500).body(Collections.singletonMap("erro", e.getMessage()));
        }
    }

    public ResponseEntity<List<Map<String, Object>>> buscarTotalVotosPorHora() {
        logger.info(serviceLog + ": [INFO] CONSULTA - BUSCAR TOTAL POR HORA.");
        try {
            List<Voto> votos = votoRepository.findAll();

            Map<Integer, Map<String, Long>> votosPorHoraParticipante = votos.stream()
                    .collect(Collectors.groupingBy(
                            v -> v.getVoteTime().getHour(),
                            Collectors.groupingBy(
                                    v -> v.getParticipante().getId(),
                                    Collectors.counting()
                            )
                    ));

            List<Map<String, Object>> resultado = new ArrayList<>();

            for (Map.Entry<Integer, Map<String, Long>> horaEntry : votosPorHoraParticipante.entrySet()) {
                Integer hora = horaEntry.getKey();
                Map<String, Long> votosPorParticipante = horaEntry.getValue();

                List<Map<String, Object>> participantesList = new ArrayList<>();
                for (Map.Entry<String, Long> participanteEntry : votosPorParticipante.entrySet()) {
                    String participanteId = participanteEntry.getKey();
                    Long totalVotos = participanteEntry.getValue();

                    Optional<Participante> participanteOpt = participanteRepository.findById(participanteId);
                    if (participanteOpt.isPresent()) {
                        Participante participante = participanteOpt.get();

                        Map<String, Object> participanteMap = new HashMap<>();
                        participanteMap.put("participanteId", participante.getId());
                        participanteMap.put("nome", participante.getNome());
                        participanteMap.put("totalVotos", totalVotos);

                        participantesList.add(participanteMap);
                    }
                }

                Map<String, Object> horaMap = new HashMap<>();
                horaMap.put("hora", hora);
                horaMap.put("participantes", participantesList);

                resultado.add(horaMap);
            }

            resultado.sort(Comparator.comparingInt(m -> (Integer) m.get("hora")));
            logger.info(serviceLog + ": [INFO] CONSULTA REALIZADA COM SUCESSO.");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.warn(serviceLog + ": [WARN] FALHA AO REALIZAR CONSULTA.");
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

}
