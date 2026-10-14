/* =========================================================
   ECOAÇÃO — Schema do banco de dados (Microsoft SQL Server)
   Execute este script no SQL Server Management Studio (SSMS).
   ========================================================= */

IF DB_ID('EcoAcao') IS NULL
BEGIN
    CREATE DATABASE EcoAcao;
END
GO

USE EcoAcao;
GO

/* =========================================================
   1. RBAC — Roles, Permissions, Role_Permissions
   ========================================================= */

IF OBJECT_ID('dbo.role_permissions', 'U') IS NOT NULL DROP TABLE dbo.role_permissions;
IF OBJECT_ID('dbo.permissions', 'U') IS NOT NULL DROP TABLE dbo.permissions;
IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL DROP TABLE dbo.roles;
GO

CREATE TABLE dbo.roles (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    nome        NVARCHAR(50)  NOT NULL UNIQUE, -- usuario | colaborador | admin | superadmin
    descricao   NVARCHAR(200) NULL,
    data_criacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.permissions (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    chave       NVARCHAR(60)  NOT NULL UNIQUE, -- ex: news.create
    descricao   NVARCHAR(200) NULL
);
GO

CREATE TABLE dbo.role_permissions (
    role_id       INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT PK_role_permissions PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_role_permissions_role FOREIGN KEY (role_id) REFERENCES dbo.roles(id) ON DELETE CASCADE,
    CONSTRAINT FK_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES dbo.permissions(id) ON DELETE CASCADE
);
GO

/* =========================================================
   2. USUÁRIOS
   ========================================================= */

IF OBJECT_ID('dbo.usuarios', 'U') IS NOT NULL DROP TABLE dbo.usuarios;
GO

CREATE TABLE dbo.usuarios (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    nome          NVARCHAR(150) NOT NULL,
    email         NVARCHAR(200) NOT NULL UNIQUE,
    senha_hash    NVARCHAR(255) NOT NULL,       -- hash bcrypt, nunca texto puro
    foto          NVARCHAR(500) NULL,
    bio           NVARCHAR(500) NULL,
    role_id       INT NOT NULL,
    status        NVARCHAR(20) NOT NULL DEFAULT 'ativo', -- ativo | inativo | banido
    data_cadastro DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_usuarios_role FOREIGN KEY (role_id) REFERENCES dbo.roles(id)
);
GO

CREATE INDEX IX_usuarios_email ON dbo.usuarios(email);
GO

/* =========================================================
   3. CATEGORIAS
   ========================================================= */

IF OBJECT_ID('dbo.categorias', 'U') IS NOT NULL DROP TABLE dbo.categorias;
GO

CREATE TABLE dbo.categorias (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    nome        NVARCHAR(100) NOT NULL UNIQUE,
    descricao   NVARCHAR(300) NULL
);
GO

/* =========================================================
   4. NOTÍCIAS
   ========================================================= */

IF OBJECT_ID('dbo.noticias', 'U') IS NOT NULL DROP TABLE dbo.noticias;
GO

CREATE TABLE dbo.noticias (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    titulo          NVARCHAR(250) NOT NULL,
    resumo          NVARCHAR(500) NOT NULL,
    conteudo        NVARCHAR(MAX) NOT NULL,
    imagem          NVARCHAR(500) NULL,
    categoria_id    INT NOT NULL,
    autor_id        INT NOT NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'publicado', -- rascunho | publicado
    data_publicacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_noticias_categoria FOREIGN KEY (categoria_id) REFERENCES dbo.categorias(id),
    CONSTRAINT FK_noticias_autor FOREIGN KEY (autor_id) REFERENCES dbo.usuarios(id)
);
GO

CREATE INDEX IX_noticias_categoria ON dbo.noticias(categoria_id);
CREATE INDEX IX_noticias_status ON dbo.noticias(status);
GO

/* =========================================================
   5. CONTEÚDOS EDUCACIONAIS
   ========================================================= */

IF OBJECT_ID('dbo.conteudos', 'U') IS NOT NULL DROP TABLE dbo.conteudos;
GO

CREATE TABLE dbo.conteudos (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    titulo          NVARCHAR(250) NOT NULL,
    descricao       NVARCHAR(500) NOT NULL,
    conteudo        NVARCHAR(MAX) NOT NULL,
    imagem          NVARCHAR(500) NULL,
    categoria_id    INT NOT NULL,
    autor_id        INT NOT NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'publicado',
    data_publicacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_conteudos_categoria FOREIGN KEY (categoria_id) REFERENCES dbo.categorias(id),
    CONSTRAINT FK_conteudos_autor FOREIGN KEY (autor_id) REFERENCES dbo.usuarios(id)
);
GO

CREATE INDEX IX_conteudos_categoria ON dbo.conteudos(categoria_id);
GO

/* =========================================================
   6. QUIZZES, PERGUNTAS, ALTERNATIVAS, RESULTADOS
   ========================================================= */

IF OBJECT_ID('dbo.resultados_quiz', 'U') IS NOT NULL DROP TABLE dbo.resultados_quiz;
IF OBJECT_ID('dbo.alternativas', 'U') IS NOT NULL DROP TABLE dbo.alternativas;
IF OBJECT_ID('dbo.perguntas', 'U') IS NOT NULL DROP TABLE dbo.perguntas;
IF OBJECT_ID('dbo.quizzes', 'U') IS NOT NULL DROP TABLE dbo.quizzes;
GO

CREATE TABLE dbo.quizzes (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    titulo          NVARCHAR(250) NOT NULL,
    descricao       NVARCHAR(500) NULL,
    categoria_id    INT NOT NULL,
    autor_id        INT NOT NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'publicado',
    data_criacao    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_quizzes_categoria FOREIGN KEY (categoria_id) REFERENCES dbo.categorias(id),
    CONSTRAINT FK_quizzes_autor FOREIGN KEY (autor_id) REFERENCES dbo.usuarios(id)
);
GO

CREATE TABLE dbo.perguntas (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id       INT NOT NULL,
    enunciado     NVARCHAR(500) NOT NULL,
    ordem         INT NOT NULL DEFAULT 1,
    CONSTRAINT FK_perguntas_quiz FOREIGN KEY (quiz_id) REFERENCES dbo.quizzes(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.alternativas (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    pergunta_id   INT NOT NULL,
    texto         NVARCHAR(300) NOT NULL,
    correta       BIT NOT NULL DEFAULT 0,
    ordem         INT NOT NULL DEFAULT 1,
    CONSTRAINT FK_alternativas_pergunta FOREIGN KEY (pergunta_id) REFERENCES dbo.perguntas(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.resultados_quiz (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id    INT NOT NULL,
    quiz_id       INT NOT NULL,
    pontuacao     DECIMAL(5,2) NOT NULL, -- percentual de acerto (0-100)
    acertos       INT NOT NULL,
    total         INT NOT NULL,
    data_realizacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_resultados_usuario FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id) ON DELETE CASCADE,
    CONSTRAINT FK_resultados_quiz FOREIGN KEY (quiz_id) REFERENCES dbo.quizzes(id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_perguntas_quiz ON dbo.perguntas(quiz_id);
CREATE INDEX IX_alternativas_pergunta ON dbo.alternativas(pergunta_id);
CREATE INDEX IX_resultados_usuario ON dbo.resultados_quiz(usuario_id);
GO

/* =========================================================
   7. DESAFIOS E PARTICIPAÇÃO
   ========================================================= */

IF OBJECT_ID('dbo.participacoes_desafio', 'U') IS NOT NULL DROP TABLE dbo.participacoes_desafio;
IF OBJECT_ID('dbo.desafios', 'U') IS NOT NULL DROP TABLE dbo.desafios;
GO

CREATE TABLE dbo.desafios (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    titulo        NVARCHAR(250) NOT NULL,
    descricao     NVARCHAR(500) NOT NULL,
    instrucoes    NVARCHAR(MAX) NOT NULL,
    imagem        NVARCHAR(500) NULL,
    categoria_id  INT NOT NULL,
    dificuldade   NVARCHAR(20) NOT NULL DEFAULT 'Fácil', -- Fácil | Médio | Difícil
    autor_id      INT NOT NULL,
    status        NVARCHAR(20) NOT NULL DEFAULT 'publicado',
    data_criacao  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_desafios_categoria FOREIGN KEY (categoria_id) REFERENCES dbo.categorias(id),
    CONSTRAINT FK_desafios_autor FOREIGN KEY (autor_id) REFERENCES dbo.usuarios(id)
);
GO

CREATE TABLE dbo.participacoes_desafio (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id      INT NOT NULL,
    desafio_id      INT NOT NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'em_andamento', -- em_andamento | concluido
    data_inicio     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    data_conclusao  DATETIME2 NULL,
    CONSTRAINT FK_participacoes_usuario FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id) ON DELETE CASCADE,
    CONSTRAINT FK_participacoes_desafio FOREIGN KEY (desafio_id) REFERENCES dbo.desafios(id) ON DELETE CASCADE,
    CONSTRAINT UQ_usuario_desafio UNIQUE (usuario_id, desafio_id)
);
GO

/* =========================================================
   8. ORGANIZAÇÕES E AÇÕES/PROJETOS
   ========================================================= */

IF OBJECT_ID('dbo.acoes_organizacao', 'U') IS NOT NULL DROP TABLE dbo.acoes_organizacao;
IF OBJECT_ID('dbo.organizacoes', 'U') IS NOT NULL DROP TABLE dbo.organizacoes;
GO

CREATE TABLE dbo.organizacoes (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    nome          NVARCHAR(200) NOT NULL,
    descricao     NVARCHAR(1000) NOT NULL,
    logo          NVARCHAR(500) NULL,
    categoria_id  INT NOT NULL,
    email         NVARCHAR(200) NULL,
    telefone      NVARCHAR(30) NULL,
    site          NVARCHAR(300) NULL,
    endereco      NVARCHAR(300) NULL,
    criado_por    INT NOT NULL,
    data_cadastro DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_organizacoes_categoria FOREIGN KEY (categoria_id) REFERENCES dbo.categorias(id),
    CONSTRAINT FK_organizacoes_autor FOREIGN KEY (criado_por) REFERENCES dbo.usuarios(id)
);
GO

CREATE TABLE dbo.acoes_organizacao (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    organizacao_id  INT NOT NULL,
    titulo          NVARCHAR(250) NOT NULL,
    descricao       NVARCHAR(1000) NOT NULL,
    data_inicio     DATE NULL,
    data_fim        DATE NULL,
    CONSTRAINT FK_acoes_organizacao FOREIGN KEY (organizacao_id) REFERENCES dbo.organizacoes(id) ON DELETE CASCADE
);
GO

/* =========================================================
   9. MENSAGENS DE CONTATO (formulário "Fale conosco")
   ========================================================= */

IF OBJECT_ID('dbo.mensagens_contato', 'U') IS NOT NULL DROP TABLE dbo.mensagens_contato;
GO

CREATE TABLE dbo.mensagens_contato (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    nome          NVARCHAR(150) NOT NULL,
    email         NVARCHAR(200) NOT NULL,
    assunto       NVARCHAR(250) NOT NULL,
    mensagem      NVARCHAR(2000) NOT NULL,
    data_envio    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

PRINT 'Schema EcoAcao criado com sucesso.';
