import { useEffect, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import FeedbackMessage from "../../shared/FeedbackMessage";
import { FormActions } from "../../shared/formActions";
import { FormField } from "../../shared/formField";
import { FormSection } from "../../shared/formSection";
import Header from "../../shared/Header";
import api from "../../../services/api";
import "../../shared/ManagementPageShell/style.css";
import "./style.css";

type AdminFormState = {
  name: string;
  email: string;
  password: string;
};

type AdminFormErrors = Partial<Record<keyof AdminFormState, string>>;

const emptyForm: AdminFormState = {
  name: "",
  email: "",
  password: "",
};

export default function AdminCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formState, setFormState] = useState<AdminFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<AdminFormErrors>({});
  const [feedback, setFeedback] = useState("");
  const [loadingData, setLoadingData] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    async function fetchAdmin() {
      try {
        const { data } = await api.get(`/admins/${id}`);
        setFormState({
          name: data.nome ?? "",
          email: data.email ?? "",
          password: "",
        });
      } catch {
        setFeedback("Erro ao carregar dados do administrador.");
      } finally {
        setLoadingData(false);
      }
    }

    fetchAdmin();
  }, [id, isEditing]);

  function handleFieldChange(field: keyof AdminFormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback("");
  }

  function validate() {
    const nextErrors: AdminFormErrors = {};

    if (!formState.name.trim()) {
      nextErrors.name = "Informe o nome do administrador.";
    }
    if (!formState.email.trim()) {
      nextErrors.email = "Informe o e-mail do administrador.";
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      nextErrors.email = "Informe um e-mail valido.";
    }
    if (!isEditing && formState.password.length < 6) {
      nextErrors.password = "Informe uma senha com pelo menos 6 caracteres.";
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      nome: formState.name.trim(),
      email: formState.email.trim(),
      ...(!isEditing && formState.password.trim() ? { senha: formState.password } : {}),
    };

    try {
      if (isEditing) {
        await api.put(`/admins/${id}`, payload);
      } else {
        await api.post("/auth/register/admin", payload);
      }

      navigate("/admins", {
        state: {
          feedback: {
            type: "success",
            title: isEditing ? "Administrador atualizado" : "Administrador cadastrado",
            message: isEditing
              ? "Administrador atualizado com sucesso."
              : "Administrador cadastrado com sucesso.",
          },
        },
      });
    } catch (err: any) {
      setFeedback(
        err?.response?.data?.erro ??
        (isEditing ? "Erro ao atualizar administrador." : "Erro ao cadastrar administrador."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loadingData) return <div className="appLoading">Carregando dados...</div>;

  return (
    <div className="managementPageLayout">
      <DefaultSidebar />
      <div className="managementMain">
        <Header />

        <main className="managementContent formPageContent">
          <section className="admin-create-page__card" aria-label="Formulario de cadastro de administrador">
            <h2 className="admin-create-page__title">
              {isEditing ? "Editar Administrador" : "Cadastrar Novo Administrador"}
            </h2>

            {feedback && (
              <FeedbackMessage
                type="error"
                title="Nao foi possivel concluir"
                message={feedback}
                onDismiss={() => setFeedback("")}
              />
            )}

            <FormSection title="Dados do administrador" icon={<ShieldCheck size={16} aria-hidden="true" />}>
              <FormField
                id="admin-name"
                label="Nome"
                placeholder="Ex.: Administrador Aldeia"
                value={formState.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                error={formErrors.name}
                required
              />
              <FormField
                id="admin-email"
                label="E-mail"
                type="email"
                placeholder="admin@email.com"
                value={formState.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                error={formErrors.email}
                required
              />
            </FormSection>

            {!isEditing && (
              <FormSection title="Acesso" icon={<KeyRound size={16} aria-hidden="true" />}>
                <FormField
                  id="admin-password"
                  label="Senha"
                  type="password"
                  placeholder="Minimo de 6 caracteres"
                  value={formState.password}
                  onChange={(event) => handleFieldChange("password", event.target.value)}
                  error={formErrors.password}
                  required
                />
              </FormSection>
            )}

            <FormActions
              onCancel={() => navigate("/admins")}
              onSubmit={handleSubmit}
              submitLabel={isEditing ? "Salvar alteracoes" : "Cadastrar admin"}
              loading={isSubmitting}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
