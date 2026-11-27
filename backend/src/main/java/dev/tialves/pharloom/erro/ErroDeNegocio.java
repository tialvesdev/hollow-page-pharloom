package dev.tialves.pharloom.erro;

import java.util.Map;
import org.springframework.http.HttpStatus;

/** Erro esperado que vira resposta JSON com mensagem para a pessoa. */
public class ErroDeNegocio extends RuntimeException {

    private final HttpStatus status;
    private final Map<String, String> campos;

    public ErroDeNegocio(HttpStatus status, String mensagem) {
        this(status, mensagem, Map.of());
    }

    public ErroDeNegocio(HttpStatus status, String mensagem, Map<String, String> campos) {
        super(mensagem);
        this.status = status;
        this.campos = campos;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Map<String, String> getCampos() {
        return campos;
    }
}
