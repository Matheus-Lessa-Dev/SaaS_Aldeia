import { useState, useEffect } from "react";
import { Layers3, UserRound, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import { FormActions } from "../../shared/formActions";
import FeedbackMessage from "../../shared/FeedbackMessage";
import { FormField } from "../../shared/formField";
import { FormSection } from "../../shared/formSection";
import Header from "../../shared/Header";
import api from "../../../services/api";
import "../../shared/ManagementPageShell/style.css";
import "./style.css";
import { useSearch } from "../../../hooks/useSearch";

interface ProfessorOption {
  id: number;
  nome: string;
}

interface AlunoOption {
  id: number;
  nome: string;
}

interface TurmaResponse {
  id: number;
  nome: string;
  periodo: string | null;
  professoresIds: number[];
  nomesProfessores: string[];
  nomesJogos: string[];
  totalAlunos: number;
}

type ClassFormState = {
  name: string;
  period: string;
};

type ClassFormErrors = Partial<Record<keyof ClassFormState, string>>;

const periodOptions = ["Manhã", "Tarde", "Noite"];

export default function ClassCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formState, setFormState] = useState<ClassFormState>({
    name: "",
    period: "",
  });
  const [formErrors, setFormErrors] = useState<ClassFormErrors>({});
  const [feedback, setFeedback] = useState("");

  const [professores, setProfessores] = useState<ProfessorOption[]>([]);
  const [selectedProfessores, setSelectedProfessores] = useState<number[]>([]);

  const [alunos, setAlunos] = useState<AlunoOption[]>([]);
  const [selectedAlunos, setSelectedAlunos] = useState<number[]>([]);

  const {
    setSearchTerm: setAlunosSearch,
    filteredItems: alunosFiltrados,
  } = useSearch(alunos.map((a) => ({ name: a.nome, id: a.id })));

  const {
    setSearchTerm: setProfessoresSearch,
    filteredItems: professoresFiltrados,
  } = useSearch(professores.map((a) => ({ name: a.nome, id: a.id })));

  useEffect(() => {
    async function fetchTudo() {
      try {
        const [profRes, alunosSemTurmaRes] = await Promise.all([
          api.get<{ id: number; nome: string }[]>("/professores"),
          api.get<{ id: number; nome: string }[]>("/alunos/sem-turma"),
        ]);

        const listaProfessores = profRes.data.map((p) => ({
          id: p.id,
          nome: p.nome,
        }));
        setProfessores(listaProfessores);

        let listaAlunos: AlunoOption[] = alunosSemTurmaRes.data.map((a) => ({
          id: a.id,
          nome: a.nome,
        }));

        if (isEditing) {
          const [turmaRes, alunosTurmaRes] = await Promise.all([
            api.get<TurmaResponse>(`/turmas/${id}`),
            api.get<{ id: number; nome: string }[]>(`/alunos?turmaId=${id}`),
          ]);

          const turma = turmaRes.data;
          setFormState({
            name: turma.nome ?? "",
            period: turma.periodo ?? "",
          });

          setSelectedProfessores(turma.professoresIds ?? []);

          const alunosDaTurma: AlunoOption[] = alunosTurmaRes.data.map((a) => ({
            id: a.id,
            nome: a.nome,
          }));
          setSelectedAlunos(alunosDaTurma.map((a) => a.id));

          const idsExistentes = new Set(listaAlunos.map((a) => a.id));
          const alunosExtras = alunosDaTurma.filter(
            (a) => !idsExistentes.has(a.id),
          );
          listaAlunos = [...alunosExtras, ...listaAlunos];
        }

        setAlunos(listaAlunos);
      } catch {
        setFeedback("Erro ao carregar dados.");
      } finally {
        setLoadingData(false);
      }
    }

    fetchTudo();
  }, [id]);

  const handleFieldChange = (field: keyof ClassFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback("");
  };

  const toggleProfessor = (profId: number) => {
    setSelectedProfessores((prev) =>
      prev.includes(profId)
        ? prev.filter((i) => i !== profId)
        : [...prev, profId],
    );
  };

  const toggleAluno = (alunoId: number) => {
    setSelectedAlunos((prev) =>
      prev.includes(alunoId)
        ? prev.filter((i) => i !== alunoId)
        : [...prev, alunoId],
    );
  };

  const validate = () => {
    const nextErrors: ClassFormErrors = {};
    if (!formState.name.trim()) nextErrors.name = "Informe o nome da turma.";
    if (!formState.period.trim())
      nextErrors.period = "Informe o período da turma.";
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      let turmaId = Number(id);

      if (isEditing) {
        await api.put(`/turmas/${id}`, {
          nome: formState.name,
          periodo: formState.period,
          professoresIds: selectedProfessores,
        });
      } else {
        const { data } = await api.post("/turmas", {
          nome: formState.name,
          periodo: formState.period,
          professoresIds: selectedProfessores,
        });
        turmaId = data.id;
      }

      await api.put(`/turmas/${turmaId}/alunos`, {
        alunosIds: selectedAlunos,
      });

      navigate("/turmas", {
        state: {
          feedback: {
            type: "success",
            title: isEditing ? "Turma atualizada" : "Turma cadastrada",
            message: isEditing
              ? "Turma atualizada com sucesso."
              : "Turma cadastrada com sucesso.",
          },
        },
      });
    } catch (err: any) {
      const msg = err?.response?.data?.erro ?? err?.response?.data?.message;
      setFeedback(
        msg ||
          (isEditing ? "Erro ao atualizar turma." : "Erro ao cadastrar turma."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return <div className="appLoading">Carregando dados...</div>;

  return (
    <div className="managementPageLayout">
      <DefaultSidebar />
      <div className="managementMain">
        <Header />

        <main className="managementContent formPageContent">
          <section
            className="class-create-page__card"
            aria-label="Formulario de cadastro de turma"
          >
            <h2 className="class-create-page__title">
              {isEditing ? "Editar Turma" : "Cadastrar Nova Turma"}
            </h2>
            {feedback && (
              <FeedbackMessage
                type="error"
                title="Nao foi possivel concluir"
                message={feedback}
                onDismiss={() => setFeedback("")}
              />
            )}

            <FormSection
              title="Dados da turma"
              icon={<Layers3 size={16} aria-hidden="true" />}
            >
              <FormField
                id="class-name"
                label="Nome da turma"
                placeholder="Ex.: Turma 1"
                value={formState.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                error={formErrors.name}
                required
              />
              <div className="form-field">
                <label htmlFor="class-period" className="form-field__label">
                  Período da turma{" "}
                  <span className="form-field__required">*</span>
                </label>
                <div
                  className={`form-field__input-wrapper ${formErrors.period ? "form-field__input--error" : ""}`.trim()}
                >
                  <select
                    id="class-period"
                    value={formState.period}
                    onChange={(e) =>
                      handleFieldChange("period", e.target.value)
                    }
                  >
                    <option value="">Selecione o período</option>
                    {periodOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.period && (
                  <span className="form-field__error-message" role="alert">
                    {formErrors.period}
                  </span>
                )}
              </div>
            </FormSection>

            <div className="class-create-page__people-grid">
              <FormSection
                title="Professores"
                icon={<UserRound size={16} aria-hidden="true" />}
                searchable={true}
                onSearch={setProfessoresSearch}
              >
                {professores.length === 0 ? (
                  <p className="class-empty-msg">
                    Nenhum professor cadastrado.
                  </p>
                ) : (
                  <div className="class-selection-list">
                    {professoresFiltrados.map((prof) => {
                      const selected = selectedProfessores.includes(prof.id);
                      return (
                        <div
                          key={prof.id}
                          className={`class-selection-item ${selected ? "class-selection-item--selected" : ""}`}
                        >
                          <span>{prof.name}</span>
                          <button
                            type="button"
                            className={`class-selection-btn ${selected ? "class-selection-btn--remove" : ""}`}
                            onClick={() => toggleProfessor(prof.id)}
                          >
                            {selected ? "Remover" : "Adicionar"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </FormSection>

              <FormSection
                title="Alunos"
                icon={<Users size={16} aria-hidden="true" />}
                searchable={true}
                onSearch={setAlunosSearch}
              >
                {alunos.length === 0 ? (
                  <p className="class-empty-msg">Nenhum aluno disponível.</p>
                ) : (
                  <div className="class-selection-list">
                    {alunosFiltrados.map((aluno) => {
                      const selected = selectedAlunos.includes(aluno.id);
                      return (
                        <div
                          key={aluno.id}
                          className={`class-selection-item ${selected ? "class-selection-item--selected" : ""}`}
                        >
                          <span>{aluno.name}</span>
                          <button
                            type="button"
                            className={`class-selection-btn ${selected ? "class-selection-btn--remove" : ""}`}
                            onClick={() => toggleAluno(aluno.id)}
                          >
                            {selected ? "Remover" : "Adicionar"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </FormSection>
            </div>

            <FormActions
              onCancel={() => navigate("/turmas")}
              onSubmit={handleSubmit}
              submitLabel={isEditing ? "Salvar alterações" : "Cadastrar turma"}
              loading={isSubmitting}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
