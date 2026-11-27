package dev.tialves.pharloom.auth;

import dev.tialves.pharloom.usuario.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

/** Formatos de entrada e saída das rotas de conta. */
public final class AuthDtos {

    private AuthDtos() {}

    public record Cadastro(
            @NotBlank(message = "Escolha um nome de usuário.")
            @Pattern(regexp = "^[A-Za-z0-9_]{3,24}$",
                    message = "Use de 3 a 24 letras, números ou _, sem espaços.")
            String nome,
            @NotBlank(message = "Informe seu e-mail.")
            @Email(message = "Esse e-mail não parece válido.")
            @Size(max = 254)
            String email,
            @NotBlank(message = "Crie uma senha.")
            @Size(min = 8, max = 72, message = "A senha precisa ter de 8 a 72 caracteres.")
            String senha) {}

    public record Entrada(
            @NotBlank(message = "Informe seu e-mail.") String email,
            @NotBlank(message = "Informe sua senha.") String senha) {}

    public record Conta(UUID id, String nome, String email) {
        public static Conta de(Usuario u) {
            return new Conta(u.getId(), u.getNome(), u.getEmail());
        }
    }
}
