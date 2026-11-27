package dev.tialves.pharloom.erro;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Todas as respostas de erro saem como { mensagem, campos }. */
@RestControllerAdvice
public class TratadorDeErros {

    public record RespostaDeErro(String mensagem, Map<String, String> campos) {}

    @ExceptionHandler(ErroDeNegocio.class)
    ResponseEntity<RespostaDeErro> negocio(ErroDeNegocio e) {
        return ResponseEntity.status(e.getStatus()).body(new RespostaDeErro(e.getMessage(), e.getCampos()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<RespostaDeErro> validacao(MethodArgumentNotValidException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors().forEach(f -> campos.putIfAbsent(f.getField(), f.getDefaultMessage()));
        return ResponseEntity.badRequest().body(new RespostaDeErro("Confira os campos destacados.", campos));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<RespostaDeErro> corpoInvalido(HttpMessageNotReadableException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new RespostaDeErro("A requisição veio num formato que a API não entende.", Map.of()));
    }
}
