# AGENTS.md

## Projeto

Sistema SaaS desenvolvido com:
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Banco: PostgreSQL
- Rodar: Usando contaienr no docker

## Objetivo Atual

O projeto está em fase final.
Prioridade:
1. Corrigir bugs.
2. Implementar funcionalidades pendentes.
3. Melhorar UX.

## Regras

- Nunca alterar funcionalidades existentes sem necessidade.
- Não criar novas dependências sem justificar.
- Manter o padrão de código já existente.
- Sempre analisar arquivos relacionados antes de modificar.
- Sempre informar impacto das alterações.
- Ao final de toda alteração rodar o container no docker com o comando: docker-compose up --build

## Testes

Antes de concluir qualquer tarefa:

Frontend:
npm run build

Backend:
npm run test

## Arquivos Importantes

backend/src/routes
backend/src/controllers
backend/src/services

frontend/src/pages
frontend/src/components

## O que evitar

- Alterações em arquivos de configuração sem necessidade.
- Refatorações grandes sem necessidade.
- Mudança de arquitetura.