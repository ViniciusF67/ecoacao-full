/* =========================================================
   ECOAÇÃO — Seed (dados iniciais para teste)
   Execute DEPOIS do schema.sql, no SSMS.

   IMPORTANTE SOBRE SENHAS:
   O valor '@HASH_ADMIN@' abaixo é um placeholder. Gere um hash bcrypt
   real executando, dentro da pasta backend/:

       node src/utils/gerarHashSenha.js SuaSenhaAqui

   O comando vai imprimir um hash como:
       $2b$10$abcdefghijklmnopqrstuv....

   Copie esse hash e substitua '@HASH_ADMIN@' abaixo antes de rodar
   este script. NUNCA use senha em texto puro no banco.
   ========================================================= */

USE EcoAcao;
GO

/* ---------- Roles ---------- */
INSERT INTO dbo.roles (nome, descricao) VALUES
('usuario',     'Usuário comum: consome conteúdo, faz quizzes e participa de desafios.'),
('colaborador', 'Pode criar e editar notícias, conteúdos e quizzes.'),
('admin',       'Gerencia usuários, categorias, organizações e todo o conteúdo.'),
('superadmin',  'Acesso total, incluindo gestão de roles e permissões.');
GO

/* ---------- Permissions ---------- */
INSERT INTO dbo.permissions (chave, descricao) VALUES
('users.read',         'Visualizar usuários'),
('users.create',       'Criar usuários'),
('users.update',       'Editar usuários'),
('users.delete',       'Excluir usuários'),
('news.read',          'Visualizar notícias'),
('news.create',        'Criar notícias'),
('news.update',        'Editar notícias'),
('news.delete',        'Excluir notícias'),
('content.read',       'Visualizar conteúdos educacionais'),
('content.create',     'Criar conteúdos educacionais'),
('content.update',     'Editar conteúdos educacionais'),
('content.delete',     'Excluir conteúdos educacionais'),
('quiz.read',          'Visualizar quizzes'),
('quiz.create',        'Criar quizzes'),
('quiz.update',        'Editar quizzes'),
('quiz.delete',        'Excluir quizzes'),
('challenge.read',     'Visualizar desafios'),
('challenge.create',   'Criar desafios'),
('challenge.update',   'Editar desafios'),
('challenge.delete',   'Excluir desafios'),
('organization.read',  'Visualizar organizações'),
('organization.create','Criar organizações'),
('organization.update','Editar organizações'),
('organization.delete','Excluir organizações'),
('category.create',    'Criar categorias'),
('category.update',    'Editar categorias'),
('category.delete',    'Excluir categorias'),
('admin.access',       'Acessar o painel administrativo'),
('role.manage',        'Gerenciar roles e permissões');
GO

/* ---------- Role -> Permissions ---------- */

-- usuario: apenas leitura
INSERT INTO dbo.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM dbo.roles r, dbo.permissions p
WHERE r.nome = 'usuario' AND p.chave IN ('news.read','content.read','quiz.read','challenge.read','organization.read');

-- colaborador: leitura + criação/edição de conteúdo
INSERT INTO dbo.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM dbo.roles r, dbo.permissions p
WHERE r.nome = 'colaborador' AND p.chave IN (
  'news.read','news.create','news.update',
  'content.read','content.create','content.update',
  'quiz.read','quiz.create','quiz.update',
  'challenge.read','challenge.create','challenge.update',
  'organization.read'
);

-- admin: tudo do colaborador + exclusão + gestão de usuários/categorias/organizações + painel
INSERT INTO dbo.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM dbo.roles r, dbo.permissions p
WHERE r.nome = 'admin' AND p.chave IN (
  'users.read','users.create','users.update','users.delete',
  'news.read','news.create','news.update','news.delete',
  'content.read','content.create','content.update','content.delete',
  'quiz.read','quiz.create','quiz.update','quiz.delete',
  'challenge.read','challenge.create','challenge.update','challenge.delete',
  'organization.read','organization.create','organization.update','organization.delete',
  'category.create','category.update','category.delete',
  'admin.access'
);

-- superadmin: todas as permissões existentes
INSERT INTO dbo.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM dbo.roles r CROSS JOIN dbo.permissions p
WHERE r.nome = 'superadmin';
GO

/* ---------- Usuário administrador inicial ----------
   Substitua '@HASH_ADMIN@' por um hash gerado com gerarHashSenha.js
   antes de rodar esta linha. */
INSERT INTO dbo.usuarios (nome, email, senha_hash, role_id, status)
SELECT 'Admin ECOAÇÃO', 'admin@ecoacao.com', '$2b$10$XVIOizFUEguSG5dNsP5CP.V1sxErxmseIHHwQeVuBi4peFQcUWhya', r.id, 'ativo'
FROM dbo.roles r WHERE r.nome = 'superadmin';
GO

/* ---------- Categorias ---------- */
INSERT INTO dbo.categorias (nome, descricao) VALUES
('Mudanças Climáticas', 'Causas, efeitos e soluções para o aquecimento global.'),
('Energia', 'Fontes renováveis, eficiência energética e transição energética.'),
('Água', 'Uso consciente, escassez hídrica e preservação de mananciais.'),
('Reciclagem', 'Gestão de resíduos, reaproveitamento e economia circular.'),
('Biodiversidade', 'Conservação de espécies e ecossistemas.'),
('Sustentabilidade', 'Hábitos, consumo consciente e desenvolvimento sustentável.');
GO

/* ---------- Notícias (autor = admin, id obtido dinamicamente) ---------- */
INSERT INTO dbo.noticias (titulo, resumo, conteudo, imagem, categoria_id, autor_id, status)
SELECT
  'Recorde de geração solar é registrado no Nordeste brasileiro',
  'Usinas fotovoltaicas da região bateram novo recorde de produção em um único dia.',
  'No último mês, usinas solares instaladas no Nordeste alcançaram um novo recorde de geração diária, reforçando o papel da região como polo de energia limpa no Brasil.',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  c.id, u.id, 'publicado'
FROM dbo.categorias c, dbo.usuarios u
WHERE c.nome = 'Energia' AND u.email = 'admin@ecoacao.com';

INSERT INTO dbo.noticias (titulo, resumo, conteudo, imagem, categoria_id, autor_id, status)
SELECT
  'Cidade reduz em 30% o volume de resíduos enviados a aterros',
  'Programa municipal de coleta seletiva e compostagem comunitária apresenta resultados expressivos.',
  'Um programa municipal voltado à gestão de resíduos sólidos conseguiu reduzir em quase um terço o volume de lixo enviado a aterros sanitários.',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
  c.id, u.id, 'publicado'
FROM dbo.categorias c, dbo.usuarios u
WHERE c.nome = 'Reciclagem' AND u.email = 'admin@ecoacao.com';
GO

/* ---------- Conteúdos educacionais ---------- */
INSERT INTO dbo.conteudos (titulo, descricao, conteudo, imagem, categoria_id, autor_id, status)
SELECT
  'O que é o efeito estufa',
  'Entenda o processo natural que mantém a Terra habitável e como a ação humana o intensificou.',
  'O efeito estufa é um fenômeno natural essencial para a vida na Terra: gases como o dióxido de carbono retêm parte do calor do Sol na atmosfera.',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
  c.id, u.id, 'publicado'
FROM dbo.categorias c, dbo.usuarios u
WHERE c.nome = 'Mudanças Climáticas' AND u.email = 'admin@ecoacao.com';
GO

/* ---------- Quiz de exemplo com perguntas e alternativas ---------- */
DECLARE @quizId INT;

INSERT INTO dbo.quizzes (titulo, descricao, categoria_id, autor_id, status)
SELECT 'Mudanças Climáticas: o que você sabe?', 'Teste seus conhecimentos sobre causas e efeitos do aquecimento global.',
       c.id, u.id, 'publicado'
FROM dbo.categorias c, dbo.usuarios u
WHERE c.nome = 'Mudanças Climáticas' AND u.email = 'admin@ecoacao.com';

SET @quizId = SCOPE_IDENTITY();

DECLARE @p1 INT, @p2 INT;

INSERT INTO dbo.perguntas (quiz_id, enunciado, ordem)
VALUES (@quizId, 'Qual gás é o principal responsável pelo efeito estufa intensificado por ação humana?', 1);
SET @p1 = SCOPE_IDENTITY();

INSERT INTO dbo.alternativas (pergunta_id, texto, correta, ordem) VALUES
(@p1, 'Oxigênio', 0, 1),
(@p1, 'Dióxido de carbono (CO2)', 1, 2),
(@p1, 'Nitrogênio', 0, 3),
(@p1, 'Hidrogênio', 0, 4);

INSERT INTO dbo.perguntas (quiz_id, enunciado, ordem)
VALUES (@quizId, 'O que significa "ODS 13" na Agenda 2030 da ONU?', 2);
SET @p2 = SCOPE_IDENTITY();

INSERT INTO dbo.alternativas (pergunta_id, texto, correta, ordem) VALUES
(@p2, 'Erradicação da pobreza', 0, 1),
(@p2, 'Ação Contra a Mudança Global do Clima', 1, 2),
(@p2, 'Educação de qualidade', 0, 3),
(@p2, 'Igualdade de gênero', 0, 4);
GO

/* ---------- Desafios ---------- */
INSERT INTO dbo.desafios (titulo, descricao, instrucoes, imagem, categoria_id, dificuldade, autor_id, status)
SELECT
  'Semana sem sacolas plásticas',
  'Durante 7 dias, evite usar sacolas plásticas descartáveis em compras.',
  'Separe uma sacola reutilizável e leve com você sempre que for às compras. Registre quantas sacolas plásticas você deixou de usar.',
  'https://images.unsplash.com/photo-1591189863430-ab87e120f312?w=800&q=80',
  c.id, 'Fácil', u.id, 'publicado'
FROM dbo.categorias c, dbo.usuarios u
WHERE c.nome = 'Reciclagem' AND u.email = 'admin@ecoacao.com';
GO

/* ---------- Organizações ---------- */
INSERT INTO dbo.organizacoes (nome, descricao, logo, categoria_id, email, telefone, site, endereco, criado_por)
SELECT
  'Instituto Raízes Verdes',
  'Organização dedicada à recuperação de matas ciliares e educação ambiental em escolas públicas.',
  'https://images.unsplash.com/photo-1500468756762-a401b6f17b46?w=200&q=80',
  c.id, 'contato@raizesverdes.org', '(11) 3456-7890', 'https://raizesverdes.org', 'São Paulo, SP', u.id
FROM dbo.categorias c, dbo.usuarios u
WHERE c.nome = 'Biodiversidade' AND u.email = 'admin@ecoacao.com';
GO

PRINT 'Seed aplicado com sucesso.';
