package dev.tialves.pharloom.auth;

import dev.tialves.pharloom.usuario.Usuario;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final TokenService tokens;
    private final CookieDeSessao cookie;

    public AuthController(AuthService auth, TokenService tokens, CookieDeSessao cookie) {
        this.auth = auth;
        this.tokens = tokens;
        this.cookie = cookie;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<AuthDtos.Conta> cadastro(@Valid @RequestBody AuthDtos.Cadastro dados) {
        return comSessao(auth.cadastrar(dados), HttpStatus.CREATED);
    }

    @PostMapping("/entrar")
    public ResponseEntity<AuthDtos.Conta> entrar(@Valid @RequestBody AuthDtos.Entrada dados) {
        return comSessao(auth.entrar(dados), HttpStatus.OK);
    }

    @PostMapping("/sair")
    public ResponseEntity<Void> sair() {
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie.apagar().toString()).build();
    }

    @GetMapping("/eu")
    public AuthDtos.Conta eu(@AuthenticationPrincipal UUID id) {
        return AuthDtos.Conta.de(auth.buscar(id));
    }

    private ResponseEntity<AuthDtos.Conta> comSessao(Usuario u, HttpStatus status) {
        String token = tokens.emitir(u.getId());
        return ResponseEntity.status(status)
                .header(HttpHeaders.SET_COOKIE, cookie.criar(token, tokens.validade()).toString())
                .body(AuthDtos.Conta.de(u));
    }
}
