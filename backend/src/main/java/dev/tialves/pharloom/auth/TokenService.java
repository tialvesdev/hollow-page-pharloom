package dev.tialves.pharloom.auth;

import dev.tialves.pharloom.config.PharloomProperties;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

/** Emite e lê o token de sessão guardado no cookie httpOnly. */
@Service
public class TokenService {

    private final SecretKey chave;
    private final Duration validade;

    public TokenService(PharloomProperties props) {
        byte[] bytes = props.jwt().segredo().getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SEGREDO precisa ter pelo menos 32 caracteres");
        }
        this.chave = Keys.hmacShaKeyFor(bytes);
        this.validade = Duration.ofDays(props.jwt().validadeDias());
    }

    public String emitir(UUID usuarioId) {
        Instant agora = Instant.now();
        return Jwts.builder()
                .subject(usuarioId.toString())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plus(validade)))
                .signWith(chave)
                .compact();
    }

    public Optional<UUID> ler(String token) {
        try {
            String sub = Jwts.parser().verifyWith(chave).build().parseSignedClaims(token).getPayload().getSubject();
            return Optional.of(UUID.fromString(sub));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Duration validade() {
        return validade;
    }
}
