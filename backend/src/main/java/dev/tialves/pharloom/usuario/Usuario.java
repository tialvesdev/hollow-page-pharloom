package dev.tialves.pharloom.usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    private UUID id;

    @Column(nullable = false, length = 24)
    private String nome;

    @Column(name = "nome_chave", nullable = false, length = 24)
    private String nomeChave;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(name = "senha_hash", nullable = false, length = 100)
    private String senhaHash;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm;

    protected Usuario() {}

    public Usuario(String nome, String email, String senhaHash) {
        this.id = UUID.randomUUID();
        this.nome = nome.trim();
        this.nomeChave = chaveDoNome(nome);
        this.email = normalizarEmail(email);
        this.senhaHash = senhaHash;
        this.criadoEm = Instant.now();
    }

    public static String chaveDoNome(String nome) {
        return nome.trim().toLowerCase(Locale.ROOT);
    }

    public static String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }
}
