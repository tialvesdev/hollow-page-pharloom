package dev.tialves.pharloom.auth;

import dev.tialves.pharloom.erro.ErroDeNegocio;
import dev.tialves.pharloom.usuario.Usuario;
import dev.tialves.pharloom.usuario.UsuarioRepository;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder senhas;
    /** Hash de uma senha qualquer: comparar com ele gasta o mesmo tempo quando o e-mail não existe. */
    private final String hashFalso;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder senhas) {
        this.usuarios = usuarios;
        this.senhas = senhas;
        this.hashFalso = senhas.encode("senha-que-ninguem-usa");
    }

    @Transactional
    public Usuario cadastrar(AuthDtos.Cadastro dados) {
        if (usuarios.existsByNomeChave(Usuario.chaveDoNome(dados.nome()))) {
            throw new ErroDeNegocio(HttpStatus.CONFLICT, "Esse nome já tem dono.",
                    Map.of("nome", "Esse nome já tem dono. Tente outro."));
        }
        if (usuarios.existsByEmail(Usuario.normalizarEmail(dados.email()))) {
            throw new ErroDeNegocio(HttpStatus.CONFLICT, "Já existe uma conta com esse e-mail.",
                    Map.of("email", "Já existe uma conta com esse e-mail. Tente entrar."));
        }
        return usuarios.save(new Usuario(dados.nome(), dados.email(), senhas.encode(dados.senha())));
    }

    @Transactional(readOnly = true)
    public Usuario entrar(AuthDtos.Entrada dados) {
        var usuario = usuarios.findByEmail(Usuario.normalizarEmail(dados.email()));
        String hash = usuario.map(Usuario::getSenhaHash).orElse(hashFalso);
        boolean confere = senhas.matches(dados.senha(), hash);
        if (usuario.isEmpty() || !confere) {
            throw new ErroDeNegocio(HttpStatus.UNAUTHORIZED, "E-mail ou senha não conferem.");
        }
        return usuario.get();
    }

    @Transactional(readOnly = true)
    public Usuario buscar(UUID id) {
        return usuarios.findById(id)
                .orElseThrow(() -> new ErroDeNegocio(HttpStatus.UNAUTHORIZED, "Sua sessão acabou. Entre de novo."));
    }
}
