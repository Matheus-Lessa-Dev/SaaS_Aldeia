# PROJECT_STATUS.md

## Status geral

O SaaS Aldeia esta em fase final de MVP funcional, com estrutura principal pronta, fluxos principais implementados, estilizacao geral concluida e responsividade implementada. Antes da entrega, resta principalmente a validacao manual final dos layouts e dos fluxos por perfil.

Estado atual percebido:
- Estrutura principal pronta.
- Fluxos principais implementados.
- Estilizacao geral concluida.
- Responsividade implementada nos principais fluxos.
- Modulo de chamadas/frequencia em estado funcional consolidado para o escopo atual.
- Frequencia do aluno disponivel na area de turma do aluno.
- Frequencia individual do aluno disponivel para consulta por admin e professor no cadastro do aluno.
- Componente compartilhado de feedback visual implementado.
- Toast global implementado para feedback apos navegacao.
- `alert()` nativo removido dos fluxos mapeados do frontend.
- Feedback visual de sucesso implementado para cadastros, edicoes, exclusoes e algumas acoes diretas.
- Estados vazios padronizados nas listagens de alunos, professores, administradores, turmas, jogos e chamadas.
- Efeito visual de hover padronizado nos cards das listagens administrativas.
- Rodada ampla de responsividade aplicada no frontend para sidebar, shells, dashboards, listagens, formularios, chamadas, jogos e area do aluno.
- Sidebar mobile ajustada para abrir por botao de menu no header, com slide lateral e fechamento ao clicar fora.
- Acesso pelo celular na rede local validado via IP da maquina (`http://192.168.0.118:3000` no ambiente atual).
- Frontend ajustado para resolver a API pelo mesmo host da pagina quando acessado por IP de rede local, mantendo `localhost` para uso no PC.
- CORS do backend ajustado para permitir origens de desenvolvimento em redes privadas locais.
- Responsividade mobile refinada nas telas `/novo`, em "Minha conta" e no login.
- Testes especificos do `ChamadaService` implementados.
- Build frontend, testes backend e ambiente Docker foram revalidados em 2026-06-23.

## Regra de negocio do perfil professor

No contexto do SaaS Aldeia, o professor possui autonomia ampliada e atua de forma semelhante a um coordenador pedagogico/operacional.

Por essa regra funcional, o acesso do professor a fluxos administrativos nao deve ser tratado automaticamente como falha de permissao. A revisao de permissoes para producao continua recomendada, mas considerando essa decisao de negocio.

Fluxos sensiveis, como chamadas e frequencia, continuam tendo validacoes especificas no backend.

## Modulos existentes

### Autenticacao

Implementado:
- Login.
- Perfis de usuario: admin, professor e aluno.
- Rotas protegidas por perfil no frontend.
- Filtro JWT no backend.
- Login de admin retorna o nome cadastrado do administrador.
- Mensagem visual padronizada para usuario/senha incorretos.
- Validacao visual para e-mail mal formatado antes de chamar o backend.
- Login validado tambem por celular na rede local apos ajuste da base da API e CORS.
- Tela de login mobile centralizada, sem scroll vertical indesejado e com faixa visual compacta.

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
- Mensagem de estado vazio na listagem quando nenhum administrador e encontrado.

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
- Adicionar atalhos uteis: chamadas, turmas e jogos.
- Revisar seguranca/permissoes antes de producao, preservando a regra de autonomia ampliada do professor.

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
- Consulta individual de frequencia do aluno por admin e professor, com registros de presenca, falta, justificativa e chamada relacionada.
- Feedback visual padronizado para erros de cadastro, edicao e exclusao.
- Feedback visual padronizado para sucesso em cadastro, edicao e exclusao.
- Mensagem de estado vazio na listagem quando nenhum aluno e encontrado.

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
- Mensagem de estado vazio na listagem quando nenhum professor e encontrado.

Pontos de atencao:
- Validar regras finais para edicao de dados sensiveis em ambiente produtivo.
- Revisar seguranca/permissoes para producao, considerando que o professor tem autonomia ampliada no contexto do projeto.

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
- Mensagem de estado vazio na listagem quando nenhuma turma e encontrada.

Pontos de atencao:
- Conferir responsividade.
- Revisar regras finais de seguranca/permissoes para producao, sem tratar a autonomia ampliada do professor como erro funcional.

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
- Mensagem de estado vazio na listagem quando nenhum jogo e encontrado.

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
- Consulta individual de frequencia do aluno por admin e professor no cadastro do aluno.
- Exibicao de registros de presenca, falta, justificativa e chamada relacionada na consulta individual de frequencia.
- Regra de no maximo uma chamada ativa por turma implementada no backend.
- Tela de nova chamada exibe apenas turmas que ainda nao possuem chamada ativa vinculada.
- Reativacao de chamada encerrada bloqueada quando ja existe outra chamada ativa para a mesma turma.
- Testes de service cobrindo criacao, acesso, registro por dia, bloqueio de chamada encerrada, aluno fora da turma e ordenacao alfabetica.
- Testes de service cobrindo consulta de frequencia do aluno.
- Testes de service cobrindo bloqueio de segunda chamada ativa para a mesma turma, liberacao quando nao ha chamada ativa e bloqueio de reativacao duplicada.

Pontos de atencao:
- A consulta individual de frequencia por aluno ja foi implementada para o escopo atual.
- Relatorios analiticos gerais por turma ficam fora do escopo da entrega atual e podem evoluir futuramente.
- Adicionar filtros por periodo e turma em uma futura visao analitica, caso ela seja priorizada.
- Avaliar se chamadas encerradas podem ser reabertas por professor ou apenas admin.
- Revisar contadores agregados de presenca/falta/justificativa na listagem de chamadas para garantir que estao contando presencas por chamada corretamente.
- Se houver dados antigos com mais de uma chamada ativa na mesma turma, encerrar ou consolidar duplicidades antes de considerar a base pronta para producao.

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
- Entrega academica.
- Piloto controlado.
- Validacao com usuario.
- Evolucao incremental.
- Teste manual de responsividade em celular na rede local.

Ainda nao ideal para producao sem:
- Revisao de seguranca/permissoes para ambiente produtivo.
- Mais testes de regra de negocio.
- Tratamento padronizado de avisos.
- Teste manual completo por perfil.
- Revisao responsiva complementar em tablets e diferentes tamanhos de celular.

## Pendencias recomendadas antes de considerar producao

1. Testar fluxo completo como admin, professor e aluno.
2. Validar layout e responsividade nos principais fluxos.
3. Revalidar build frontend e testes backend em ambiente com dependencias instaladas e JDK configurado.
4. Revisar configuracao do admin base em ambiente publicado e remover credenciais padrao.
5. Evoluir relatorios analiticos gerais por turma como melhoria futura.
6. Revisar seguranca/permissoes para producao, preservando a regra de autonomia ampliada do professor.

## Deploy opcional para demonstracao online

A entrega pode ser apresentada com o sistema rodando localmente, usando Docker ou os servicos executados diretamente na maquina de apresentacao.

Caso seja necessario disponibilizar uma demonstracao online gratuita ou de baixo custo, uma estrutura viavel para o escopo atual seria:

- Frontend React/Vite hospedado na Vercel.
- Backend Spring Boot hospedado no Render.
- Banco PostgreSQL hospedado no Neon.

Fluxo esperado:

```txt
Vercel frontend -> Render backend -> Neon PostgreSQL
```

Nessa estrutura, o frontend deve apontar para a URL publica do backend por variavel de ambiente, por exemplo `VITE_API_URL`. O backend deve receber a URL do banco e demais segredos por variaveis de ambiente, como `DATABASE_URL`, `JWT_SECRET` e configuracoes do admin base.

Tambem seria necessario configurar CORS no backend para aceitar a origem publica do frontend.

Essa alternativa e adequada para demonstracao, entrega academica e piloto controlado, mas nao substitui uma revisao de producao com dominio proprio, HTTPS, backups, monitoramento e revisao de seguranca/permissoes.

## Ultimas validacoes conhecidas

Frontend:
- Em 2026-06-23, `npm.cmd run build` passou em `frontend` apos ajustes de acesso mobile, responsividade de formularios/minha conta e login mobile.
- O build usou Vite 8.0.8 e gerou os artefatos em `frontend/dist`.

Backend:
- Em 2026-06-23, `.\mvnw.cmd test` passou em `backend` apos ajuste de CORS para rede local.
- Resultado atual: 84 testes executados, 0 falhas, 0 erros, 0 ignorados.
- Observacoes do teste: `JwtAuthFilter` ainda usa API depreciada e o Mockito emite aviso sobre carregamento dinamico de agent em JDK futuro.

Docker:
- Em 2026-06-23, `docker-compose up --build -d` reconstruiu/subiu o ambiente em modo destacado apos os ajustes de frontend/backend.
- `docker ps` confirmou os containers ativos:
  - `react_frontend` em `0.0.0.0:3000->5173/tcp`
  - `spring_backend` em `0.0.0.0:8080->8080/tcp`
  - `db_projeto` em `0.0.0.0:5433->5432/tcp`, com status `healthy`
- Em 2026-06-23, o frontend respondeu HTTP 200 em `http://localhost:3000`.
- Em 2026-06-23, o Swagger respondeu HTTP 200 em `http://localhost:8080/swagger-ui/index.html`.
- Em 2026-06-23, preflight CORS para origem `http://192.168.0.118:3000` respondeu 200 com `Access-Control-Allow-Origin`.
- Em 2026-06-23, login e navegacao inicial foram validados manualmente pelo celular acessando `http://192.168.0.118:3000`.
- Na revisao de 2026-06-20, `scripts/seed-dev.ps1` foi corrigido para lidar com arrays retornados pelo Windows PowerShell e validado com execucao repetida/idempotente.
- Quando o ambiente estiver ativo, os servicos esperados sao:
  - frontend: porta `3000`
  - backend: porta `8080`
  - postgres: porta `5433`

Ambiente local:
- Os comandos executados pelo shell atual exibem aviso de `profile.ps1` bloqueado por Execution Policy do Windows PowerShell. O aviso nao impediu build, testes backend, `docker ps`, logs nem validacoes HTTP, mas polui a saida dos comandos.

## Observacoes para proximos chats

- O `PROJECT_STATUS.md` esta versionado e deve ser atualizado sempre que uma funcionalidade importante for concluida.
- Arquivos locais de contexto como `AGENTS.md` permanecem ignorados pelo `.gitignore`.
- Antes de alterar comportamento existente, confirmar se a mudanca afeta admin, professor ou aluno.
