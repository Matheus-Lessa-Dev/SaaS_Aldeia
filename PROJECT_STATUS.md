# PROJECT_STATUS.md

## Status geral

O SaaS Aldeia esta em fase final de MVP/prototipo funcional.

Estado atual percebido:
- Estrutura principal pronta.
- Fluxos principais implementados.
- UI em processo de padronizacao.
- Modulo de chamada criado em nivel funcional inicial.
- Frequencia do aluno disponivel na area de turma do aluno.
- Componente compartilhado de feedback visual implementado.
- Toast global implementado para feedback apos navegacao.
- `alert()` nativo removido dos fluxos mapeados do frontend.
- Feedback visual de sucesso implementado para cadastros, edicoes, exclusoes e algumas acoes diretas.
- Testes especificos do `ChamadaService` implementados.
- Build frontend e testes backend passaram em validacoes anteriores; no ambiente atual ainda falta instalar dependencias do frontend e configurar Java/JDK para revalidar.

## Modulos existentes

### Autenticacao

Implementado:
- Login.
- Perfis de usuario: admin, professor e aluno.
- Rotas protegidas por perfil no frontend.
- Filtro JWT no backend.
- Mensagem visual padronizada para usuario/senha incorretos.
- Validacao visual para e-mail mal formatado antes de chamar o backend.

Pontos de atencao:
- Revisar expiracao do token em fluxos longos.
- Revisar politicas finais para criacao e gerenciamento de administradores.
- Evitar credenciais padrao de admin base em ambiente de producao.
- Ajustar variaveis de ambiente do admin base por deploy/ambiente.
- A obrigatoriedade de troca de senha no primeiro acesso foi descartada; usuarios podem alterar senha pela tela "Minha conta".

### Cadastro de admin

Situacao atual:
- Existe bootstrap de admin base na inicializacao do backend via `BaseAdminInitializer`.
- O endpoint `/auth/register/admin` existe, mas esta protegido por role `ADMIN` no `SecurityConfig`.
- O seed de desenvolvimento faz login no admin base e usa token autenticado para popular dados.
- A tela de cadastro de admin continua usando `/auth/register/admin`, agora como fluxo autenticado.
- O gerenciamento de administradores existentes e restrito ao admin base (`admin@base.com` por padrao).

Configuracao atual:
- Propriedades: `app.base-admin.email`, `app.base-admin.password`, `app.base-admin.name`.
- Variaveis equivalentes por Spring Boot relaxed binding: `APP_BASE_ADMIN_EMAIL`, `APP_BASE_ADMIN_PASSWORD`, `APP_BASE_ADMIN_NAME`.
- Padroes locais: `admin@base.com` / `Aldeia@2026Base!` / `Administrador Base`.

Pontos de atencao:
- Em producao, sobrescrever obrigatoriamente email, senha e nome do admin base por variaveis de ambiente.
- O bootstrap hoje cria o admin base se o e-mail base nao existir. Se a regra final for "criar apenas quando nao existir nenhum admin", ajustar a condicao para consultar a existencia de admins.
- Avaliar se apenas o admin base deve gerenciar administradores ou se qualquer admin autenticado podera criar novos admins.

### Dashboard admin

Implementado:
- Tela inicial para admin.
- Navegacao para modulos administrativos.

Pontos de atencao:
- Evoluir indicadores reais do SaaS.
- Melhorar cards/metricas se for virar tela executiva.

### Dashboard professor

Implementado:
- Tela de professor.
- Relacao com turmas.

Pontos de atencao:
- Professor ja possui restricoes em fluxos relevantes, mas ainda vale revisar todos os endpoints para garantir que veja/manipule apenas turmas vinculadas.
- Adicionar atalhos uteis: chamadas, turmas e jogos.

### Dashboard aluno

Implementado:
- Tela do aluno com saudacao.
- Acesso a turma e jogos.
- Acesso a propria frequencia pela area de turma.
- Header e alinhamento padronizados recentemente.

Pontos de atencao:
- Melhorar estados vazios caso aluno esteja sem turma ou sem jogos.

### Alunos

Implementado:
- Listagem.
- Cadastro.
- Edicao.
- Exclusao.
- Vinculo com turma.
- Feedback visual padronizado para erros de cadastro, edicao e exclusao.
- Feedback visual padronizado para sucesso em cadastro, edicao e exclusao.

Pontos de atencao:
- Conferir validacoes de formulario.

### Professores

Implementado:
- Listagem.
- Cadastro.
- Edicao.
- Exclusao.
- Feedback visual padronizado para erros de cadastro, edicao e exclusao.
- Feedback visual padronizado para sucesso em cadastro, edicao e exclusao.

Pontos de atencao:
- Validar permissoes para professor editar dados sensiveis.
- Conferir se professor pode gerenciar outros professores ou se isso deve ser apenas admin.

### Turmas

Implementado:
- Listagem.
- Cadastro.
- Edicao.
- Exclusao.
- Vinculo de alunos.
- Vinculo de professores.
- Vinculo de jogos.
- Area do aluno para visualizar turma.
- Feedback visual padronizado para erros de cadastro, edicao e exclusao.
- Feedback visual padronizado para sucesso em cadastro, edicao e exclusao.

Pontos de atencao:
- Conferir responsividade.
- Garantir cobertura completa para professor manipular apenas suas turmas em todos os endpoints, se essa for a regra final.

### Jogos

Implementado:
- Listagem admin/professor.
- Cadastro.
- Edicao.
- Exclusao.
- Toggle ativo/inativo.
- Area de jogos para aluno.
- Vinculo com turmas.
- Feedback visual padronizado para erros de cadastro, edicao, exclusao e toggle.
- Feedback visual padronizado para sucesso em cadastro, edicao, exclusao e toggle.

Pontos de atencao:
- Conferir regra de exibicao para aluno: apenas jogos ativos e vinculados a turma.
- Manter visual do modulo aluno coerente com o restante do SaaS.

### Chamadas

Implementado:
- Listagem de chamadas.
- Filtros.
- Botao de nova chamada.
- Cadastro de chamada.
- Vinculo com turma via lista de selecao.
- Tela de detalhe/edicao.
- Seletor de dia bloqueando datas futuras.
- Registro de presenca, falta e justificativa.
- Botao de todos presentes.
- Toggle ativa/encerrada.
- Quando encerrada, campos de lancamento ficam bloqueados.
- Consulta de dias anteriores.
- Alunos ordenados alfabeticamente no backend.
- Feedback visual padronizado para erros na lista, cadastro e edicao de chamadas.
- Feedback visual padronizado para sucesso na criacao, edicao de status e salvamento de frequencia.
- Endpoint para aluno consultar a propria frequencia.
- Painel "Minha frequencia" na area de turma do aluno com percentual, totais e ultimos registros.
- Testes de service cobrindo criacao, acesso, registro por dia, bloqueio de chamada encerrada, aluno fora da turma e ordenacao alfabetica.
- Testes de service cobrindo consulta de frequencia do aluno.

Pontos de atencao:
- Adicionar dashboard/relatorio de presenca por turma.
- Adicionar filtros por periodo e turma na visao analitica.
- Avaliar se chamadas encerradas podem ser reabertas por professor ou apenas admin.
- Revisar contadores agregados de presenca/falta/justificativa na listagem de chamadas para garantir que estao contando presencas por chamada corretamente.

### Feedback visual

Implementado:
- Componente compartilhado `FeedbackMessage`.
- Variantes de mensagem: erro, sucesso, aviso e informacao.
- Botao para fechar mensagem.
- Uso em telas de lista via `ManagementPageShell`.
- Uso em cadastros/edicoes de aluno, professor, turma e jogo.
- Uso em lista, cadastro e edicao de chamadas.
- Uso de feedback de sucesso via `location.state` ao voltar para telas de lista.
- Uso no login para credenciais invalidas e e-mail mal formatado.
- Remocao dos `alert()` nativos dos fluxos mapeados do frontend.

### Revisao JogoService

Implementado:
- Revisado vinculo entre jogos e turmas.
- Confirmado que `Turma` e o lado dono da relacao `ManyToMany` com jogos.
- Confirmado que jogos exibidos para alunos passam por `/jogos/minha-turma` e retornam apenas jogos habilitados da turma.
- Reforcada validacao no service para impedir nome/link em branco e tempo menor ou igual a zero em criacao/atualizacao.
- Adicionados testes para validacoes do `JogoService`.

Pontos de atencao:
- Continuar padronizando o uso entre `FeedbackMessage` inline e toast global.
- Aplicar no modulo de chamadas, se aparecerem novos erros de fluxo.

## Qualidade atual

Bom para:
- Demonstracao.
- Piloto controlado.
- Validacao com usuario.
- Evolucao incremental.

Ainda nao ideal para producao sem:
- Revisao completa de permissoes.
- Mais testes de regra de negocio.
- Tratamento padronizado de avisos.
- Revisao responsiva.
- Teste manual completo por perfil.

## Pendencias recomendadas antes de considerar producao

1. Revisar configuracao do admin base em producao e remover credenciais padrao dos ambientes publicados.
2. Revisar permissoes backend por perfil.
3. Padronizar mensagens de aviso com `FeedbackMessage` ou toast global.
4. Revisar responsividade das telas principais.
5. Conferir fluxos de exclusao e confirmacao.
6. Criar relatorio/dashboard de presencas.
7. Padronizar estados vazios.
8. Testar fluxo completo como admin, professor e aluno.
9. Revalidar build frontend e testes backend em ambiente com dependencias instaladas e JDK configurado.

## Ultimas validacoes conhecidas

Frontend:
- `npm.cmd run build` passou apos remocao do refresh token.
- Na revisao de 2026-06-20, nao foi possivel reexecutar o build porque `frontend/node_modules` nao estava instalado e `tsc` nao estava disponivel no ambiente.

Backend:
- `.\mvnw.cmd test` passou anteriormente com 77 testes apos frequencia do aluno.
- Na revisao de 2026-06-20, o codigo continha 79 metodos `@Test`, incluindo 12 em `ChamadaServiceTest`.
- Na revisao de 2026-06-20, nao foi possivel reexecutar os testes porque `JAVA_HOME` nao estava configurado e `java`/`javac` nao estavam disponiveis no PATH.

Docker:
- `docker-compose up --build` ja foi validado anteriormente.
- Na revisao de 2026-06-20, `docker compose build` passou para backend e frontend.
- Na revisao de 2026-06-20, `docker compose up -d` subiu `db`, `backend` e `frontend` com sucesso.
- Na revisao de 2026-06-20, o frontend respondeu HTTP 200 em `http://localhost:3000`.
- Na revisao de 2026-06-20, o Swagger respondeu HTTP 200 em `http://localhost:8080/swagger-ui/index.html`.
- Na revisao de 2026-06-20, login do admin base funcionou via `POST /auth/login`.
- Na revisao de 2026-06-20, `scripts/seed-dev.ps1` foi corrigido para lidar com arrays retornados pelo Windows PowerShell e validado com execucao repetida/idempotente.
- Quando o ambiente estiver ativo, os servicos esperados sao:
  - frontend: porta `3000`
  - backend: porta `8080`
  - postgres: porta `5433`

## Observacoes para proximos chats

- O `PROJECT_STATUS.md` esta versionado e deve ser atualizado sempre que uma funcionalidade importante for concluida.
- Arquivos locais de contexto como `AGENTS.md` permanecem ignorados pelo `.gitignore`.
- Antes de alterar comportamento existente, confirmar se a mudanca afeta admin, professor ou aluno.
