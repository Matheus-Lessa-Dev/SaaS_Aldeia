import { useEffect, useState } from "react";
import { Gamepad2, GraduationCap, Link as LinkIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar1 from "../../solos/sideBar/SideBar1";
import { FormActions } from "../../shared/formActions";
import { FormField } from "../../shared/formField";
import { FormSection } from "../../shared/formSection";
import api from "../../../services/api";
import "../../shared/ManagementPageShell/style.css";
import "./style.css";

type GameFormState = {
  name: string;
  time: string;
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
};

type GameFormErrors = Partial<Record<keyof GameFormState, string>>;

const emptyForm: GameFormState = {
  name: "",
  time: "",
  imageUrl: "",
  linkUrl: "",
  enabled: true,
};

export default function GameCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [formState, setFormState] = useState<GameFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<GameFormErrors>({});

  useEffect(() => {
    if (!isEditing) return;

    async function fetchGame() {
      try {
        const { data } = await api.get(`/jogos/${id}`);
        setFormState({
          name: data.nome ?? "",
          time: data.tempo == null ? "" : String(data.tempo),
          imageUrl: data.imgUrl ?? "",
          linkUrl: data.linkUrl ?? "",
          enabled: data.habilitado ?? true,
        });
      } catch {
        alert("Erro ao carregar dados do jogo.");
        navigate("/jogos");
      } finally {
        setLoadingData(false);
      }
    }

    fetchGame();
  }, [id, isEditing, navigate]);

  const handleFieldChange = (field: keyof GameFormState, value: string) => {
    const nextValue = field === "time" ? value.replace(/\D/g, "") : value;
    setFormState((current) => ({ ...current, [field]: nextValue }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const isValidUrl = (value: string) => {
    if (!value.trim()) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const nextErrors: GameFormErrors = {};
    if (!formState.name.trim()) nextErrors.name = "Informe o nome do jogo.";
    if (!formState.time.trim()) nextErrors.time = "Informe o tempo estimado.";
    else if (!Number.isInteger(Number(formState.time)) || Number(formState.time) <= 0) {
      nextErrors.time = "Informe o tempo em minutos.";
    }
    if (!isValidUrl(formState.imageUrl)) nextErrors.imageUrl = "Informe uma URL valida.";
    if (!formState.linkUrl.trim()) nextErrors.linkUrl = "Informe o link do jogo.";
    else if (!isValidUrl(formState.linkUrl)) nextErrors.linkUrl = "Informe uma URL valida.";
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      nome: formState.name.trim(),
      tempo: Number(formState.time),
      imgUrl: formState.imageUrl.trim(),
      linkUrl: formState.linkUrl.trim(),
      habilitado: formState.enabled,
    };

    try {
      if (isEditing) {
        await api.put(`/jogos/${id}`, payload);
      } else {
        await api.post("/jogos", payload);
      }
      navigate("/jogos");
    } catch {
      alert(isEditing ? "Erro ao atualizar jogo." : "Erro ao cadastrar jogo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return <div className="appLoading">Carregando dados...</div>;

  return (
    <div className="managementPageLayout">
      <Sidebar1 />
      <div className="managementMain">
        <header className="managementHeader">
          <button type="button" className="dashboardHeaderBtn">
            <span>Educador</span>
            <GraduationCap size={18} aria-hidden="true" />
          </button>
        </header>

        <main className="managementContent">
          <section className="game-create-page__card" aria-label="Formulario de cadastro de jogo">
            <h2 className="game-create-page__title">
              {isEditing ? "Editar Jogo" : "Cadastrar Novo Jogo"}
            </h2>

            <FormSection title="Dados do jogo" icon={<Gamepad2 size={16} aria-hidden="true" />}>
              <FormField
                id="game-name"
                label="Nome"
                placeholder="Ex.: Trilha das palavras"
                value={formState.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                error={formErrors.name}
                required
              />
              <FormField
                id="game-time"
                label="Tempo estimado"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Ex.: 15"
                value={formState.time}
                onChange={(event) => handleFieldChange("time", event.target.value)}
                error={formErrors.time}
                required
              />
            </FormSection>

            <FormSection title="Links do jogo" icon={<LinkIcon size={16} aria-hidden="true" />}>
              <FormField
                id="game-image-url"
                label="URL da imagem"
                type="url"
                placeholder="https://exemplo.com/imagem.png"
                value={formState.imageUrl}
                onChange={(event) => handleFieldChange("imageUrl", event.target.value)}
                error={formErrors.imageUrl}
              />
              <FormField
                id="game-link-url"
                label="URL do jogo"
                type="url"
                placeholder="https://exemplo.com/jogo"
                value={formState.linkUrl}
                onChange={(event) => handleFieldChange("linkUrl", event.target.value)}
                error={formErrors.linkUrl}
                required
              />
            </FormSection>

            <FormActions
              onCancel={() => navigate("/jogos")}
              onSubmit={handleSubmit}
              submitLabel={isEditing ? "Salvar alteracoes" : "Cadastrar jogo"}
              loading={isSubmitting}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
