package dev.tialves.pharloom.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Lê o cookie de sessão e, se o token for válido, marca a requisição como autenticada. */
@Component
public class FiltroDeSessao extends OncePerRequestFilter {

    private final CookieDeSessao cookie;
    private final TokenService tokens;

    public FiltroDeSessao(CookieDeSessao cookie, TokenService tokens) {
        this.cookie = cookie;
        this.tokens = tokens;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        cookie.ler(req)
                .flatMap(tokens::ler)
                .ifPresent(id -> SecurityContextHolder.getContext()
                        .setAuthentication(new UsernamePasswordAuthenticationToken(id, null, List.of())));
        chain.doFilter(req, res);
    }
}
