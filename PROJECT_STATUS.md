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
- `alert()` nativo removido dos fluxos mapeados do frontend.
- Feedback visual de sucesso implementado para cadastros, edicoes, exclusoes e algumas acoes diretas.
- Testes especificos do `ChamadaService` implementados.
- Build frontend e testes backend passando nas ultimas validacoes.

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
- Revisar processo de criacao de administradores.
- Evitar endpoint publico para cadastro de admin em ambiente de producao.
- Avaliar bootstrap do primeiro admin por variaveis de ambiente e criacao de novos admins apenas por admin autenticado.

### Cadastro de admin

Situacao atual:
- O cadastro de admin ainda depende de endpoint de registro ou manipulacao direta do banco/seed.
- Esse modelo nao e ideal para producao porque cadastro publico de admin aumenta risco de seguranca.

Opcao recomendada para discutir:
- Criar primeiro admin por bootstrap na inicializacao do backend usando variaveis de ambiente.
- Exemplo de variaveis: `APP_ADMIN_EMAIL`, `APP_ADMIN_PASSWORD`, `APP_ADMIN_NAME`.
- O bootstrap so deve criar admin se nao existir nenhum admin cadastrado.
- Apos existir o primeiro admin, novos admins devem ser criados apenas por usuario admin autenticado.
- Proteger ou remover o endpoint publico `/auth/register/admin`.
- Atualizar o seed para usar admin bootstrap em vez de criar admin por endpoint publico.

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
- Garantir que professor veja apenas turmas vinculadas.
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
- Garantir que professor manipule apenas suas turmas, se essa for a regra final.

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
- Avaliar padrao global/toast para mensagens apos navegacao.
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

1. Revisar cadastro de admin: bootstrap por variavel de ambiente e endpoint publico protegido/removido.
2. Revisar permissoes backend por perfil.
3. Padronizar mensagens de aviso com `FeedbackMessage` ou toast global.
4. Revisar responsividade das telas principais.
5. Conferir fluxos de exclusao e confirmacao.
6. Criar relatorio/dashboard de presencas.
7. Padronizar estados vazios.
8. Testar fluxo completo como admin, professor e aluno.

## Ultimas validacoes conhecidas

Frontend:
- `npm.cmd run build` passou apos remocao do refresh token.

Backend:
- `.\mvnw.cmd test` passou com 77 testes apos frequencia do aluno.

Docker:
- `docker-compose up --build` ja foi validado anteriormente.
- Na ultima revisao com `docker ps`, nao havia containers rodando no momento.
- Quando o ambiente estiver ativo, os servicos esperados sao:
  - frontend: porta `3000`
  - backend: porta `8080`
  - postgres: porta `5433`

## Observacoes para proximos chats

- Estes arquivos estao ignorados pelo Git no `.gitignore`.
- Atualizar este status sempre que uma funcionalidade importante for concluida.
- Antes de alterar comportamento existente, confirmar se a mudanca afeta admin, professor ou aluno.
