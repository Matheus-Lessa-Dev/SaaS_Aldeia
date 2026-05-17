import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { loginRequest } from "../../services/authService";
import "./style.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (authLoading) {
    return <div>Carregando...</div>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(email, senha);

      const user = {
        id: data.email,
        name: data.email,
        email: data.email,
        role: data.role,
        primeiroAcesso: data.primeiroAcesso,
      };

      login(user, data.token, data.refreshToken);

      if (data.primeiroAcesso) {
        navigate("/perfil");
        return;
      }

      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg || "E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-gradient" />
        <form className="login-form-side" onSubmit={handleSubmit}>
          <h2>Bem-vindo</h2>
          <p>Acesse sua conta para continuar sua jornada pedagógica.</p>

          {error && <p className="login-error">{error}</p>}

          <div className="login-field">
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <User size={18} aria-hidden="true" />
              <input
                id="email"
                type="email"
                placeholder="nome@exemplo.com.br"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={18} aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((c) => !c)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            className="button-primary login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
