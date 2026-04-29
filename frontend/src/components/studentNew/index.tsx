import { useState } from 'react'
import { GraduationCap, UserRound, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar1 from '../../components/sideBar/SideBar1'
import { FormActions } from '../../components/shared/formActions'
import { FormField } from '../../components/shared/formField'
import { FormSection } from '../../components/shared/formSection'
import '../../components/shared/ManagementPageShell/style.css'
import './style.css'

type StudentFormState = {
  name: string
  surname: string
  birthDate: string
  addressStreet: string
  email: string
  addressComplement: string
  guardianName: string
  guardianSurname: string
  guardianPhone: string
  guardianEmail: string
}

type StudentFormErrors = {
  name?: string
  surname?: string
  birthDate?: string
  addressStreet?: string
  email?: string
  addressComplement?: string
  guardianName?: string
  guardianSurname?: string
  guardianPhone?: string
  guardianEmail?: string
}

export default function StudentCreatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<StudentFormState>({
    name: '',
    surname: '',
    birthDate: '',
    addressStreet: '',
    email: '',
    addressComplement: '',
    guardianName: '',
    guardianSurname: '',
    guardianPhone: '',
    guardianEmail: '',
  })
  const [formErrors, setFormErrors] = useState<StudentFormErrors>({})

  const handleFieldChange = (field: keyof StudentFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: StudentFormErrors = {}

    if (!formState.name.trim()) {
      nextErrors.name = 'Informe o nome do aluno.'
    }

    if (!formState.surname.trim()) {
      nextErrors.surname = 'Informe o sobrenome do aluno.'
    }

    if (!formState.birthDate.trim()) {
      nextErrors.birthDate = 'Informe a data de nascimento.'
    }

    if (!formState.addressStreet.trim()) {
      nextErrors.addressStreet = 'Informe a rua do endereço.'
    }

    if (!formState.email.trim()) {
      nextErrors.email = 'Informe o e-mail do aluno.'
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      nextErrors.email = 'Informe um e-mail valido.'
    }

    if (!formState.addressComplement.trim()) {
      nextErrors.addressComplement = 'Informe o complemento do endereço.'
    }

    if (!formState.guardianName.trim()) {
      nextErrors.guardianName = 'Informe o nome do responsável.'
    }

    if (!formState.guardianSurname.trim()) {
      nextErrors.guardianSurname = 'Informe o sobrenome do responsável.'
    }

    if (!formState.guardianPhone.trim()) {
      nextErrors.guardianPhone = 'Informe o telefone de contato.'
    }

    if (!formState.guardianEmail.trim()) {
      nextErrors.guardianEmail = 'Informe o e-mail do responsável.'
    } else if (!/^\S+@\S+\.\S+$/.test(formState.guardianEmail)) {
      nextErrors.guardianEmail = 'Informe um e-mail valido.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // TODO: integrar com endpoint de criacao de aluno no backend.
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/alunos')
    }, 300)
  }

  const handleCancel = () => {
    navigate('/alunos')
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
          <section className="student-create-page__card" aria-label="Formulario de cadastro de aluno">
            <h2 className="student-create-page__title">Cadastrar Novo Aluno</h2>

            <FormSection title="Dados do aluno" icon={<UserRound size={16} aria-hidden="true" />}>
              <FormField
                id="student-name"
                label="Nome"
                placeholder="Ex.: Maria Souza"
                value={formState.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
                error={formErrors.name}
                required
              />

              <FormField
                id="student-surname"
                label="Sobrenome"
                placeholder="Ex.: Souza"
                value={formState.surname}
                onChange={(event) => handleFieldChange('surname', event.target.value)}
                error={formErrors.surname}
                required
              />

              <FormField
                id="student-birth-date"
                label="Data de nascimento"
                type="date"
                value={formState.birthDate}
                onChange={(event) => handleFieldChange('birthDate', event.target.value)}
                error={formErrors.birthDate}
                required
              />

              <FormField
                id="student-street"
                label="Rua do endereço"
                placeholder="Ex.: Rua das Flores, 123"
                value={formState.addressStreet}
                onChange={(event) => handleFieldChange('addressStreet', event.target.value)}
                error={formErrors.addressStreet}
                required
              />

              <FormField
                id="student-email"
                label="E-mail"
                type="email"
                placeholder="seuemail@gmail.com"
                value={formState.email}
                onChange={(event) => handleFieldChange('email', event.target.value)}
                error={formErrors.email}
                required
              />

              <FormField
                id="student-address-complement"
                label="Complemento do endereço"
                placeholder="Ex.: Casa 2, bloco B"
                value={formState.addressComplement}
                onChange={(event) => handleFieldChange('addressComplement', event.target.value)}
                error={formErrors.addressComplement}
                required
              />
            </FormSection>

            <FormSection title="Dados do responsável" icon={<Users size={16} aria-hidden="true" />}>
              <FormField
                id="guardian-name"
                label="Nome"
                placeholder="Ex.: Ana"
                value={formState.guardianName}
                onChange={(event) => handleFieldChange('guardianName', event.target.value)}
                error={formErrors.guardianName}
                required
              />

              <FormField
                id="guardian-surname"
                label="Sobrenome"
                placeholder="Ex.: Souza"
                value={formState.guardianSurname}
                onChange={(event) => handleFieldChange('guardianSurname', event.target.value)}
                error={formErrors.guardianSurname}
                required
              />

              <FormField
                id="guardian-phone"
                label="Telefone de contato"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formState.guardianPhone}
                onChange={(event) => handleFieldChange('guardianPhone', event.target.value)}
                error={formErrors.guardianPhone}
                required
              />

              <FormField
                id="guardian-email"
                label="E-mail"
                type="email"
                placeholder="responsavel@email.com"
                value={formState.guardianEmail}
                onChange={(event) => handleFieldChange('guardianEmail', event.target.value)}
                error={formErrors.guardianEmail}
                required
              />
            </FormSection>

            <FormActions
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              submitLabel="Cadastrar aluno"
              loading={isSubmitting}
            />
          </section>
        </main>
      </div>
    </div>
  )
}
