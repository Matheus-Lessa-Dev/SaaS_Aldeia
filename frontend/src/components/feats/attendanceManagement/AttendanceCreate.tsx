import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarRange, Layers3 } from "lucide-react";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import Header from "../../shared/Header";
import { FormActions } from "../../shared/formActions";
import { FormField } from "../../shared/formField";
import { FormSection } from "../../shared/formSection";
import api from "../../../services/api";
import { Role } from "../../../context/AuthContext";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../context/ToastContext";
import "../../shared/ManagementPageShell/style.css";
import "./style.css";

type TipoPeriodo = "BIMESTRE" | "TRIMESTRE";

type TurmaResponse = {
  id: number;
  nome: string;
};

type ChamadaResponse = {
  id: number;
};

const periodOptionsByType: Record<TipoPeriodo, number[]> = {
  BIMESTRE: [1, 2],
  TRIMESTRE: [1, 2, 3],
};

export default function AttendanceCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"nome" | "turmaId", string>>>({});
  const [form, setForm] = useState({
    nome: "",
    turmaId: "",
    tipoPeriodo: "BIMESTRE" as TipoPeriodo,
    numeroPeriodo: 1,
  });

  useEffect(() => {
    document.body.classList.add("attendancePage");
    return () => document.body.classList.remove("attendancePage");
  }, []);

  useEffect(() => {
    async function loadTurmas() {
      try {
        const turmasUrl = user?.role === Role.Teacher ? "/turmas/minhas" : "/turmas";
        const { data } = await api.get<TurmaResponse[]>(turmasUrl);
        setTurmas(data);
      } catch {
        showToast({
          type: "error",
          title: "Nao foi possivel concluir",
          message: "Erro ao carregar turmas.",
        });
      }
    }

    loadTurmas();
  }, [showToast, user?.role]);

  function handleFieldChange(field: keyof typeof form, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handlePeriodTypeChange(tipoPeriodo: TipoPeriodo) {
    const availablePeriods = periodOptionsByType[tipoPeriodo];
    setForm((current) => ({
      ...current,
      tipoPeriodo,
      numeroPeriodo: availablePeriods.includes(current.numeroPeriodo)
        ? current.numeroPeriodo
        : availablePeriods[0],
    }));
  }

  function validate() {
    const nextErrors: Partial<Record<"nome" | "turmaId", string>> = {};
    if (!form.nome.trim()) nextErrors.nome = "Informe o nome da chamada.";
    if (!form.turmaId) nextErrors.turmaId = "Selecione uma turma.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleCreate() {
    if (!validate()) return;
    if (!form.turmaId) {
      showToast({
        type: "warning",
        title: "Dados incompletos",
        message: "Selecione uma turma para criar a chamada.",
      });
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.post<ChamadaResponse>("/chamadas", {
        nome: form.nome,
        turmaId: Number(form.turmaId),
        tipoPeriodo: form.tipoPeriodo,
        numeroPeriodo: form.numeroPeriodo,
      });

      navigate(`/chamadas/${data.id}/editar`, {
        state: {
          feedback: {
            type: "success",
            title: "Chamada criada",
            message: "Chamada criada com sucesso.",
          },
        },
      });
    } catch {
      showToast({
        type: "error",
        title: "Nao foi possivel concluir",
        message: "Erro ao criar chamada.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="attendanceLayout">
      <DefaultSidebar />
      <div className="attendanceMain">
        <Header />
        <main className="managementContent">
          <button type="button" className="attendanceBackButton" onClick={() => navigate("/chamadas")}>
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar
          </button>

          <section className="attendance-create-page__card" aria-label="Formulario de cadastro de chamada">
            <h2 className="attendance-create-page__title">Nova chamada</h2>

            <FormSection title="Dados da chamada" icon={<CalendarRange size={16} aria-hidden="true" />}>
              <FormField
                id="attendance-name"
                label="Nome da chamada"
                placeholder="Ex.: Frequência 1º Bimestre"
                value={form.nome}
                onChange={(event) => handleFieldChange("nome", event.target.value)}
                error={errors.nome}
                required
              />

              <div className="form-field">
                <label htmlFor="attendance-period-type" className="form-field__label">
                  Tipo de período <span className="form-field__required">*</span>
                </label>
                <div className="form-field__input-wrapper attendance-create-page__select-wrapper">
                  <select
                    id="attendance-period-type"
                    value={form.tipoPeriodo}
                    onChange={(event) => handlePeriodTypeChange(event.target.value as TipoPeriodo)}
                  >
                    <option value="BIMESTRE">Bimestre</option>
                    <option value="TRIMESTRE">Trimestre</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="attendance-period-number" className="form-field__label">
                  Número do período <span className="form-field__required">*</span>
                </label>
                <div className="form-field__input-wrapper attendance-create-page__select-wrapper">
                  <select
                    id="attendance-period-number"
                    value={form.numeroPeriodo}
                    onChange={(event) => handleFieldChange("numeroPeriodo", Number(event.target.value))}
                  >
                    {periodOptionsByType[form.tipoPeriodo].map((periodNumber) => (
                      <option key={periodNumber} value={periodNumber}>
                        {periodNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection title="Turma vinculada" icon={<Layers3 size={16} aria-hidden="true" />}>
              {turmas.length === 0 ? (
                <p className="class-empty-msg">Nenhuma turma disponível.</p>
              ) : (
                <div className="class-selection-list attendance-create-page__turma-list">
                  {turmas.map((turma) => {
                    const selected = form.turmaId === String(turma.id);
                    return (
                      <div
                        key={turma.id}
                        className={`class-selection-item ${selected ? "class-selection-item--selected" : ""}`}
                      >
                        <span>{turma.nome}</span>
                        <button
                          type="button"
                          className={`class-selection-btn ${selected ? "class-selection-btn--remove" : ""}`}
                          onClick={() => handleFieldChange("turmaId", selected ? "" : String(turma.id))}
                        >
                          {selected ? "Selecionada" : "Selecionar"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.turmaId && (
                <span className="form-field__error-message" role="alert">{errors.turmaId}</span>
              )}
            </FormSection>

            <FormActions
              onCancel={() => navigate("/chamadas")}
              onSubmit={handleCreate}
              submitLabel="Criar chamada"
              loading={saving}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
