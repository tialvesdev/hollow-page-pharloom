package dev.tialves.pharloom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

// Sem usuário padrão em memória: a única forma de entrar é a conta do banco.
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@ConfigurationPropertiesScan
public class PharloomApplication {

    public static void main(String[] args) {
        SpringApplication.run(PharloomApplication.class, args);
    }
}
