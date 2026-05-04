import { useState } from 'react'
import { GraduationCap, MapPinned, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar1 from '../../solos/sideBar/SideBar1'
import { FormActions } from '../../shared/formActions'
import { FormField } from '../../shared/formField'
import { FormSection } from '../../shared/formSection'
import '../../shared/ManagementPageShell/style.css'
import './style.css'

type TeacherFormState = {
  name: string
  surname: string
  birthDate: string
  email: string
  street: string
  complement: string
  phone: string
}

type TeacherFormErrors = {
  name?: string
  surname?: string
  birthDate?: string
  email?: string
  street?: string
  complement?: string
  phone?: string
}

export default function TeacherCreatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<TeacherFormState>({
    name: '',
    surname: '',
    birthDate: '',
    email: '',
    street: '',
    complement: '',
    phone: '',
  })
  const [formErrors, setFormErrors] = useState<TeacherFormErrors>({})

  const handleFieldChange = (field: keyof TeacherFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: TeacherFormErrors = {}

    if (!formState.name.trim()) {
      nextErrors.name = 'Informe o nome do professor.'
    }

    if (!formState.surname.trim()) {
      nextErrors.surname = 'Informe o sobrenome do professor.'
    }

    if (!formState.birthDate.trim()) {
      nextErrors.birthDate = 'Informe a data de nascimento.'
    }

    if (!formState.email.trim()) {
      nextErrors.email = 'Informe o e-mail do professor.'
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      nextErrors.email = 'Informe um e-mail valido.'
    }

    if (!formState.street.trim()) {
      nextErrors.street = 'Informe a rua do endereço.'
    }

    if (!formState.complement.trim()) {
      nextErrors.complement = 'Informe o complemento do endereço.'
    }

    if (!formState.phone.trim()) {
      nextErrors.phone = 'Informe o telefone de contato.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // TODO: integrar com endpoint de criacao de professor no backend.
    const payload = {
      nome: formState.name.trim(),
      sobrenome: formState.surname.trim(),
      dataNascimento: formState.birthDate,
      email: formState.email.trim(),
      rua: formState.street.trim(),
      complemento: formState.complement.trim(),
      telefone: formState.phone.trim(),
    }

    void payload

    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/professores')
    }, 300)
  }

  const handleCancel = () => {
    navigate('/professores')
  }

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
          <section className="teacher-create-page__card" aria-label="Formulario de cadastro de professor">
            <h2 className="teacher-create-page__title">Cadastrar Novo Professor</h2>

            <FormSection title="Dados do professor" icon={<UserRound size={16} aria-hidden="true" />}>
              <FormField
                id="teacher-name"
                label="Nome"
                placeholder="Ex.: Maria"
                value={formState.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
                error={formErrors.name}
                required
              />

              <FormField
                id="teacher-surname"
                label="Sobrenome"
                placeholder="Ex.: Souza"
                value={formState.surname}
                onChange={(event) => handleFieldChange('surname', event.target.value)}
                error={formErrors.surname}
                required
              />

              <FormField
                id="teacher-birth-date"
                label="Data de nascimento"
                type="date"
                value={formState.birthDate}
                onChange={(event) => handleFieldChange('birthDate', event.target.value)}
                error={formErrors.birthDate}
                required
              />

              <FormField
                id="teacher-email"
                label="E-mail"
                type="email"
                placeholder="professor@email.com"
                value={formState.email}
                onChange={(event) => handleFieldChange('email', event.target.value)}
                error={formErrors.email}
                required
              />
            </FormSection>

            <FormSection title="Dados de contato" icon={<MapPinned size={16} aria-hidden="true" />}>
              <FormField
                id="teacher-street"
                label="Rua do endereço"
                placeholder="Ex.: Rua das Flores, 123"
                value={formState.street}
                onChange={(event) => handleFieldChange('street', event.target.value)}
                error={formErrors.street}
                required
              />

              <FormField
                id="teacher-complement"
                label="Complemento do endereço"
                placeholder="Ex.: Casa 2, bloco B"
                value={formState.complement}
                onChange={(event) => handleFieldChange('complement', event.target.value)}
                error={formErrors.complement}
                required
              />

              <FormField
                id="teacher-phone"
                label="Telefone de contato"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formState.phone}
                onChange={(event) => handleFieldChange('phone', event.target.value)}
                error={formErrors.phone}
                required
              />
            </FormSection>

            <FormActions
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              submitLabel="Cadastrar professor"
              loading={isSubmitting}
            />
          </section>
        </main>
      </div>
    </div>
  )
}