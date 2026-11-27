package dev.tialves.pharloom.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "pharloom")
public record PharloomProperties(Jwt jwt, Cookie cookie, Cors cors) {

    public record Jwt(String segredo, int validadeDias) {}

    public record Cookie(String nome, boolean seguro) {}

    public record Cors(List<String> origens) {}
}
