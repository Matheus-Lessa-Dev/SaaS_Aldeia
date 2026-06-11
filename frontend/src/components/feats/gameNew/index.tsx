import { useEffect, useState } from "react";
import axios from "axios";
import { Gamepad2, GraduationCap, Layers3, Link as LinkIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import { FormActions } from "../../shared/formActions";
import { FormField } from "../../shared/formField";
import { FormSection } from "../../shared/formSection";
import api from "../../../services/api";
import "../../shared/ManagementPageShell/style.css";
import "../classNew/style.css";
import "./style.css";

type GameFormState = {
  name: string;
  time: string;
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
};

type GameFormErrors = Partial<Record<keyof GameFormState, string>>;

type TurmaOption = {
  id: number;
  nome: string;
};

type JogoResponse = {
  nome?: string;
  tempo?: number | null;
  imgUrl?: string | null;
  linkUrl?: string | null;
  habilitado?: boolean | null;
  turmasIds?: number[];
};

const emptyForm: GameFormState = {
  name: "",
  time: "",
  imageUrl: "",
  linkUrl: "",
  enabled: true,
};

const MAX_NAME_LENGTH = 45;
const MAX_URL_LENGTH = 1000;

export default function GameCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formState, setFormState] = useState<GameFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<GameFormErrors>({});
  const [turmas, setTurmas] = useState<TurmaOption[]>([]);
  const [selectedTurmas, setSelectedTurmas] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const turmasRequest = api.get<TurmaOption[]>("/turmas");

        if (isEditing) {
          const [turmasRes, jogoRes] = await Promise.all([
            turmasRequest,
            api.get<JogoResponse>(`/jogos/${id}`),
          ]);
          const data = jogoRes.data;
          setTurmas(turmasRes.data);
          setSelectedTurmas(data.turmasIds ?? []);
          setFormState({
            name: data.nome ?? "",
            time: data.tempo == null ? "" : String(data.tempo),
            imageUrl: data.imgUrl ?? "",
            linkUrl: data.linkUrl ?? "",
            enabled: data.habilitado ?? true,
          });
        } else {
          const { data } = await turmasRequest;
          setTurmas(data);
        }
      } catch {
        alert(isEditing ? "Erro ao carregar dados do jogo." : "Erro ao carregar turmas.");
        navigate("/jogos");
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
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

  const toggleTurma = (turmaId: number) => {
    setSelectedTurmas((current) =>
      current.includes(turmaId)
        ? current.filter((idAtual) => idAtual !== turmaId)
        : [...current, turmaId],
    );
  };

  const validate = () => {
    const nextErrors: GameFormErrors = {};
    if (!formState.name.trim()) nextErrors.name = "Informe o nome do jogo.";
    else if (formState.name.trim().length > MAX_NAME_LENGTH) {
      nextErrors.name = `Informe ate ${MAX_NAME_LENGTH} caracteres.`;
    }
    if (!formState.time.trim()) nextErrors.time = "Informe o tempo estimado.";
    else if (!Number.isInteger(Number(formState.time)) || Number(formState.time) <= 0) {
      nextErrors.time = "Informe o tempo em minutos.";
    }
    if (!isValidUrl(formState.imageUrl)) nextErrors.imageUrl = "Informe uma URL valida.";
    else if (formState.imageUrl.trim().length > MAX_URL_LENGTH) {
      nextErrors.imageUrl = `Informe ate ${MAX_URL_LENGTH} caracteres.`;
    }
    if (!formState.linkUrl.trim()) nextErrors.linkUrl = "Informe o link do jogo.";
    else if (!isValidUrl(formState.linkUrl)) nextErrors.linkUrl = "Informe uma URL valida.";
    else if (formState.linkUrl.trim().length > MAX_URL_LENGTH) {
      nextErrors.linkUrl = `Informe ate ${MAX_URL_LENGTH} caracteres.`;
    }
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
      turmasIds: selectedTurmas,
    };

    try {
      if (isEditing) {
        await api.put(`/jogos/${id}`, payload);
      } else {
        await api.post("/jogos", payload);
      }
      navigate("/jogos");
    } catch (error) {
      const apiMessage = axios.isAxiosError(error) ? error.response?.data?.erro : undefined;
      alert(apiMessage ?? (isEditing ? "Erro ao atualizar jogo." : "Erro ao cadastrar jogo."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return <div className="appLoading">Carregando dados...</div>;

  return (
    <div className="managementPageLayout">
      <DefaultSidebar />
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
                maxLength={MAX_NAME_LENGTH}
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
                maxLength={MAX_URL_LENGTH}
                value={formState.imageUrl}
                onChange={(event) => handleFieldChange("imageUrl", event.target.value)}
                error={formErrors.imageUrl}
              />
              <FormField
                id="game-link-url"
                label="URL do jogo"
                type="url"
                placeholder="https://exemplo.com/jogo"
                maxLength={MAX_URL_LENGTH}
                value={formState.linkUrl}
                onChange={(event) => handleFieldChange("linkUrl", event.target.value)}
                error={formErrors.linkUrl}
                required
              />
            </FormSection>

            <FormSection title="Turmas vinculadas" icon={<Layers3 size={16} aria-hidden="true" />}>
              {turmas.length === 0 ? (
                <p className="class-empty-msg">Nenhuma turma cadastrada.</p>
              ) : (
                <div className="class-selection-list">
                  {turmas.map((turma) => {
                    const selected = selectedTurmas.includes(turma.id);
                    return (
                      <div
                        key={turma.id}
                        className={`class-selection-item${selected ? " class-selection-item--selected" : ""}`}
                      >
                        <span>{turma.nome}</span>
                        <button
                          type="button"
                          className={`class-selection-btn${selected ? " class-selection-btn--remove" : ""}`}
                          onClick={() => toggleTurma(turma.id)}
                        >
                          {selected ? "Remover" : "Adicionar"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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
