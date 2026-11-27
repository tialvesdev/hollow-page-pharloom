package dev.tialves.pharloom.auth;

import dev.tialves.pharloom.config.PharloomProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * O front chama a API pelo mesmo domínio (proxy do Vite em dev, rewrite do Vercel em produção),
 * então o cookie pode ser SameSite=Lax, o que já barra envio por formulários de outros sites.
 */
@Component
public class CookieDeSessao {

    private final PharloomProperties.Cookie config;

    public CookieDeSessao(PharloomProperties props) {
        this.config = props.cookie();
    }

    public ResponseCookie criar(String token, Duration validade) {
        return base(token).maxAge(validade).build();
    }

    public ResponseCookie apagar() {
        return base("").maxAge(0).build();
    }

    public Optional<String> ler(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
                .filter(c -> config.nome().equals(c.getName()))
                .map(Cookie::getValue)
                .filter(v -> !v.isBlank())
                .findFirst();
    }

    private ResponseCookie.ResponseCookieBuilder base(String valor) {
        return ResponseCookie.from(config.nome(), valor)
                .httpOnly(true)
                .secure(config.seguro())
                .sameSite("Lax")
                .path("/");
    }
}
