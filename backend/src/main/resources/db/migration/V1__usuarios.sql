-- nome_chave e email ficam em minúsculas para que "Lira" e "lira" sejam a mesma conta.
create table usuarios (
    id          uuid primary key,
    nome        varchar(24)  not null,
    nome_chave  varchar(24)  not null,
    email       varchar(254) not null,
    senha_hash  varchar(100) not null,
    criado_em   timestamp with time zone not null,
    constraint usuarios_nome_unico unique (nome_chave),
    constraint usuarios_email_unico unique (email)
);
