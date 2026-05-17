# Refresh Token — O que mudou e como usar

## O que mudou

Antes, o login retornava apenas um token que durava 24h. Agora:

- O **Access Token** dura **15 minutos** (curto por segurança).
- O **Refresh Token** dura **7 dias** e serve para gerar um novo Access Token sem precisar fazer login novamente.

---

## Arquivos alterados / criados

| Arquivo | O que mudou |
|---|---|
| `dto/AuthResponse.java` | Adicionado o campo `refreshToken` na resposta |
| `dto/RefreshTokenRequest.java` | **NOVO** — DTO para receber o refresh token |
| `service/JwtService.java` | Adicionados `generateRefreshToken()`, `isValidRefreshToken()`, e a claim `"type"` nos tokens para diferenciar access de refresh |
| `service/AuthService.java` | Adicionado método `refresh()` + injeção de `UserDetailsServiceImpl` |
| `controller/AuthController.java` | Adicionado endpoint `POST /auth/refresh` |
| `resources/application.properties` | Adicionada propriedade `jwt.refresh-expiration-ms`; expiração do access token alterada de 24h para 15min |

---

## Como usar

### 1. Login (igual a antes, resposta mudou)

```
POST /auth/login
{
  "email": "user@email.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJ...",           // Access Token — use em todas as requisições
  "refreshToken": "eyJ...",    // Refresh Token — guarde com segurança
  "role": "ALUNO",
  "email": "user@email.com"
}
```

### 2. Usar o Access Token (igual a antes)

Envie o `token` no header:
```
Authorization: Bearer <token>
```

### 3. Renovar o Access Token (novo)

Quando o Access Token expirar (erro 403), chame:

```
POST /auth/refresh
{
  "refreshToken": "eyJ..."
}
```

**Resposta:** um novo par completo de `token` + `refreshToken`.

### 4. Quando o Refresh Token expirar

Depois de 7 dias sem uso, o Refresh Token expira também. Nesse caso o usuário precisa fazer login novamente.

---

## Ajuste no .env (opcional)

Você pode sobrescrever os tempos de expiração via variáveis de ambiente:

```
JWT_EXPIRATION_MS=900000        # 15 minutos (padrão)
JWT_REFRESH_EXPIRATION_MS=604800000  # 7 dias (padrão)
```