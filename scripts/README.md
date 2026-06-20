# Scripts de Desenvolvimento

Esta pasta contem scripts auxiliares para popular e testar o banco local.

## Seed de usuarios

O script `seed-dev.ps1` cadastra dados iniciais para testar a aplicacao:

- 1 admin base automatico
- 10 professores
- 40 alunos
- 4 turmas com professores e alunos vinculados
- 8 chamadas, sendo 2 chamadas por turma

## Pre-requisitos

Antes de executar, o backend precisa estar rodando em `http://localhost:8080`.

Com Docker:

```powershell
docker compose up -d --build
```

## Como executar

Na raiz do projeto, rode:

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\seed-dev.ps1
```

Se o backend estiver em outra URL:

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\seed-dev.ps1 -ApiBaseUrl "http://localhost:8080"
```

## Credenciais

Admin:

```text
email: admin@base.com
senha: Aldeia@2026Base!
```

Professores:

```text
professor01@aldeia.com ate professor10@aldeia.com
```

Alunos:

```text
aluno01@aldeia.com ate aluno40@aldeia.com
```

A senha inicial de professores e alunos e a data de nascimento no formato `ddMMyyyy`.
Exemplo: nascimento `1986-01-12` usa senha `12011986`.

Turmas:

```text
Turma Alfa
Turma Beta
Turma Gama
Turma Delta
```

Chamadas:

```text
Frequencia 1 Bimestre - Turma Alfa
Frequencia 2 Bimestre - Turma Alfa
Frequencia 1 Bimestre - Turma Beta
Frequencia 2 Bimestre - Turma Beta
Frequencia 1 Bimestre - Turma Gama
Frequencia 2 Bimestre - Turma Gama
Frequencia 1 Bimestre - Turma Delta
Frequencia 2 Bimestre - Turma Delta
```

## Reexecutar

O script pode ser executado mais de uma vez. Quando um email, turma ou chamada ja existir, ele pula o cadastro e continua. Os vinculos de alunos nas turmas sao reaplicados a cada execucao.
