package dev.tialves.pharloom.auth;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.tialves.pharloom.usuario.UsuarioRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    private static final String COOKIE = "pharloom_sessao";

    @Autowired
    MockMvc mvc;

    @Autowired
    UsuarioRepository usuarios;

    @BeforeEach
    void limpar() {
        usuarios.deleteAll();
    }

    private MvcResult cadastrar(String nome, String email, String senha) throws Exception {
        return mvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nome":"%s","email":"%s","senha":"%s"}""".formatted(nome, email, senha)))
                .andReturn();
    }

    @Test
    void cadastroAbreSessaoEEuDevolveAConta() throws Exception {
        MvcResult r = cadastrar("lira", "Lira@Exemplo.test", "senha-forte-1");
        org.assertj.core.api.Assertions.assertThat(r.getResponse().getStatus()).isEqualTo(201);
        Cookie sessao = r.getResponse().getCookie(COOKIE);
        org.assertj.core.api.Assertions.assertThat(sessao).isNotNull();
        org.assertj.core.api.Assertions.assertThat(sessao.isHttpOnly()).isTrue();

        mvc.perform(get("/api/auth/eu").cookie(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("lira"))
                .andExpect(jsonPath("$.email").value("lira@exemplo.test"));
    }

    @Test
    void euSemSessaoRespondeNaoAutorizado() throws Exception {
        mvc.perform(get("/api/auth/eu")).andExpect(status().isUnauthorized());
    }

    @Test
    void entrarComSenhaErradaNaoAbreSessao() throws Exception {
        cadastrar("lira", "lira@exemplo.test", "senha-forte-1");
        mvc.perform(post("/api/auth/entrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"lira@exemplo.test\",\"senha\":\"errada-123\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensagem").value("E-mail ou senha não conferem."))
                .andExpect(cookie().doesNotExist(COOKIE));
    }

    @Test
    void entrarComSenhaCertaAbreSessao() throws Exception {
        cadastrar("lira", "lira@exemplo.test", "senha-forte-1");
        mvc.perform(post("/api/auth/entrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"LIRA@exemplo.test\",\"senha\":\"senha-forte-1\"}"))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", containsString("HttpOnly")))
                .andExpect(header().string("Set-Cookie", containsString("SameSite=Lax")));
    }

    @Test
    void cadastroRepetidoApontaOCampo() throws Exception {
        cadastrar("lira", "lira@exemplo.test", "senha-forte-1");
        mvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"LIRA\",\"email\":\"outra@exemplo.test\",\"senha\":\"senha-forte-1\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.campos.nome").exists());
    }

    @Test
    void cadastroInvalidoListaOsCampos() throws Exception {
        mvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"a b\",\"email\":\"nao-e-email\",\"senha\":\"curta\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").exists())
                .andExpect(jsonPath("$.campos.email").exists())
                .andExpect(jsonPath("$.campos.senha").exists());
    }

    @Test
    void sairApagaOCookie() throws Exception {
        mvc.perform(post("/api/auth/sair"))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge(COOKIE, 0));
    }
}
