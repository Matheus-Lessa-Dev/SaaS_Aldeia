import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { KeyRound, Mail, Save, UserRound } from "lucide-react";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import StudentSidebar from "../../solos/sideBar/StudentSidebar";
import Header from "../../shared/Header";
import FeedbackMessage from "../../shared/FeedbackMessage";
import { Role } from "../../../context/AuthContext";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";
import { mapRole } from "../../../services/authService";
import "../../shared/formActions/style.css";
import "./style.css";

type ContaResponse = {
  id: number;
  nome: string;
  email: string;
  role: string;
};

type ContaUpdateResponse = {
  token: string;
  role: string;
  email: string;
  nome: string;
};

function AccountSettings() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const Sidebar = user?.role === Role.Student ? StudentSidebar : DefaultSidebar;

  useEffect(() => {
    let isMounted = true;

    async function fetchAccount() {
      try {
        const { data } = await api.get<ContaResponse>("/conta");

        if (!isMounted) return;

        setName(data.nome ?? "");
        setEmail(data.email ?? "");
      } catch {
        if (isMounted) {
          setFeedback({
            type: "error",
            title: "Nao foi possivel carregar sua conta",
            message: "Tente novamente em instantes.",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setSaving(true);

    try {
      const payload = {
        nome: name.trim(),
        email: email.trim(),
        senhaAtual: currentPassword.trim() || undefined,
        senha: password.trim() || undefined,
      };
      const { data } = await api.put<ContaUpdateResponse>("/conta", payload);
      const updatedUser = {
        id: data.email,
        name: data.nome,
        email: data.email,
        role: mapRole(data.role),
      };

      login(updatedUser, data.token);
      setCurrentPassword("");
      setPassword("");
      setFeedback({
        type: "success",
        title: "Conta atualizada",
        message: "Seus dados foram salvos com sucesso.",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.erro ??
        "Nao foi possivel salvar as alteracoes agora.";
      setFeedback({
        type: "error",
        title: "Erro ao atualizar conta",
        message,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashBoardPainel">
      <Sidebar />
      <div className="accountLayout">
        <Header />
        <main className="accountContent">
          <section className="accountCard">
            <div className="accountHeader">
            <h1>Minha conta</h1>
            <p>Gerencie seus dados de acesso ao Portal Aldeia.</p>
            </div>

            <form className="accountForm" onSubmit={handleSubmit}>
              {feedback && (
                <FeedbackMessage
                  type={feedback.type}
                  title={feedback.title}
                  message={feedback.message}
                  onDismiss={() => setFeedback(null)}
                />
              )}

              <div className="accountInfo" role="note">
                <strong>Senha atual obrigatoria</strong>
                <span>
                  Informe sua senha atual para salvar qualquer alteracao. A nova senha
                  não precisa ser preenchida para salvar as alterações.
                </span>
              </div>

              <label className="accountField">
                <span>Nome</span>
                <div>
                  <UserRound size={18} aria-hidden="true" />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={loading || saving}
                    required
                  />
                </div>
              </label>

              <label className="accountField">
                <span>E-mail</span>
                <div>
                  <Mail size={18} aria-hidden="true" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading || saving}
                    required
                  />
                </div>
              </label>

              <label className="accountField">
                <span>Senha atual</span>
                <div>
                  <KeyRound size={18} aria-hidden="true" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    disabled={loading || saving}
                    required
                    placeholder="Obrigatoria para salvar alterações"
                  />
                </div>
              </label>

              <label className="accountField">
                <span>Nova senha</span>
                <div>
                  <KeyRound size={18} aria-hidden="true" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading || saving}
                    minLength={6}
                    placeholder="Opcional para salvar alterações"
                  />
                </div>
              </label>

              <div className="form-actions">
                <button
                  className="form-actions__submit"
                  type="submit"
                  disabled={loading || saving}
                >
                  <Save size={18} aria-hidden="true" />
                  <span>{saving ? "Salvando..." : "Salvar alteracoes"}</span>
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AccountSettings;
