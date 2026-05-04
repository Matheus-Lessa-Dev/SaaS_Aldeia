import { useState } from 'react'
import { BookOpenCheck, Layers3, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar1 from '../../solos/sideBar/SideBar1'
import { FormActions } from '../../shared/formActions'
import { FormField } from '../../shared/formField'
import { FormSection } from '../../shared/formSection'
import '../../shared/ManagementPageShell/style.css'
import './style.css'

type ClassFormState = {
    name: string
    period: string
    responsibleTeacher: string
}

type ClassFormErrors = {
    name?: string
    period?: string
    responsibleTeacher?: string
}

const periodOptions = ['Manhã', 'Tarde', 'Noite']

const teacherOptions = [
    'João Silva',
    'Maria Souza',
    'Carlos Henrique',
    'Ana Paula',
]

export default function ClassCreatePage() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formState, setFormState] = useState<ClassFormState>({
        name: '',
        period: '',
        responsibleTeacher: '',
    })
    const [formErrors, setFormErrors] = useState<ClassFormErrors>({})

    const handleFieldChange = (field: keyof ClassFormState, value: string) => {
        setFormState((current) => ({ ...current, [field]: value }))
        setFormErrors((current) => ({ ...current, [field]: undefined }))
    }

    const validate = () => {
        const nextErrors: ClassFormErrors = {}

        if (!formState.name.trim()) {
            nextErrors.name = 'Informe o nome da turma.'
        }

        if (!formState.period.trim()) {
            nextErrors.period = 'Informe o período da turma.'
        }

        if (!formState.responsibleTeacher.trim()) {
            nextErrors.responsibleTeacher = 'Selecione o professor responsável.'
        }

        setFormErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) {
            return
        }

        setIsSubmitting(true)

        const payload = {
            nome: formState.name.trim(),
            periodo: formState.period.trim(),
            professorResponsavel: formState.responsibleTeacher.trim(),
        }

        // TODO: integrar com endpoint de criacao de turma no backend.
        void payload

        setTimeout(() => {
            setIsSubmitting(false)
            navigate('/turmas')
        }, 300)
    }

    const handleCancel = () => {
        navigate('/turmas')
    }

    return (
        <div className="managementPageLayout">
            <Sidebar1 />
            <div className="managementMain">
                <header className="managementHeader">
                    <button type="button" className="dashboardHeaderBtn">
                        <span>Educador</span>
                        <BookOpenCheck size={18} aria-hidden="true" />
                    </button>
                </header>

                <main className="managementContent">
                    <section className="class-create-page__card" aria-label="Formulario de cadastro de turma">
                        <h2 className="class-create-page__title">Cadastrar Nova Turma</h2>

                        <FormSection title="Dados da turma" icon={<Layers3 size={16} aria-hidden="true" />}>
                            <FormField
                                id="class-name"
                                label="Nome da turma"
                                placeholder="Ex.: Turma 1"
                                value={formState.name}
                                onChange={(event) => handleFieldChange('name', event.target.value)}
                                error={formErrors.name}
                                required
                            />

                            <div className="form-field">
                                <label htmlFor="class-period" className="form-field__label">
                                    Período da turma
                                    <span className="form-field__required">*</span>
                                </label>
                                <div className={`form-field__input-wrapper ${formErrors.period ? 'form-field__input--error' : ''}`.trim()}>
                                    <select
                                        id="class-period"
                                        name="class-period"
                                        value={formState.period}
                                        onChange={(event) => handleFieldChange('period', event.target.value)}
                                        aria-invalid={!!formErrors.period}
                                        aria-describedby={formErrors.period ? 'class-period-error' : undefined}
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
                                    <span id="class-period-error" className="form-field__error-message" role="alert">
                                        {formErrors.period}
                                    </span>
                                )}
                            </div>
                        </FormSection>

                        <FormSection title="Professor responsável" icon={<UserRound size={16} aria-hidden="true" />}>
                            <div className="form-field">
                                <label htmlFor="class-responsible-teacher" className="form-field__label">
                                    Nome do professor responsável
                                    <span className="form-field__required">*</span>
                                </label>
                                <div className={`form-field__input-wrapper ${formErrors.responsibleTeacher ? 'form-field__input--error' : ''}`.trim()}>
                                    <select
                                        id="class-responsible-teacher"
                                        name="class-responsible-teacher"
                                        value={formState.responsibleTeacher}
                                        onChange={(event) => handleFieldChange('responsibleTeacher', event.target.value)}
                                        aria-invalid={!!formErrors.responsibleTeacher}
                                        aria-describedby={formErrors.responsibleTeacher ? 'class-responsible-teacher-error' : undefined}
                                    >
                                        <option value="">Selecione o professor</option>
                                        {teacherOptions.map((teacher) => (
                                            <option key={teacher} value={teacher}>
                                                {teacher}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formErrors.responsibleTeacher && (
                                    <span
                                        id="class-responsible-teacher-error"
                                        className="form-field__error-message"
                                        role="alert"
                                    >
                                        {formErrors.responsibleTeacher}
                                    </span>
                                )}
                            </div>
                        </FormSection>

                        <FormActions
                            onCancel={handleCancel}
                            onSubmit={handleSubmit}
                            submitLabel="Cadastrar turma"
                            loading={isSubmitting}
                        />
                    </section>
                </main>
            </div>
        </div>
    )
}