import { useState, useEffect } from 'react'
import { GraduationCap, MapPinned, UserRound } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar1 from '../../solos/sideBar/SideBar1'
import { FormActions } from '../../shared/formActions'
import { FormField } from '../../shared/formField'
import { FormSection } from '../../shared/formSection'
import api from '../../../services/api'
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

type TeacherFormErrors = Partial<Record<keyof TeacherFormState, string>>

const emptyForm: TeacherFormState = {
  name: '',
  surname: '',
  birthDate: '',
  email: '',
  street: '',
  complement: '',
  phone: '',
}

export default function TeacherCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [formState, setFormState] = useState<TeacherFormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<TeacherFormErrors>({})

  useEffect(() => {
    if (!isEditing) return

    async function fetchProfessor() {
      try {
        const { data } = await api.get(`/professores/${id}`)

        const [firstName, ...rest] = (data.nome as string).split(' ')

        setFormState({
          name: firstName ?? '',
          surname: rest.join(' ') ?? '',
          birthDate: data.dataNascimento ?? '',
          email: data.email ?? '',
          street: data.rua ?? '',
          complement: data.complemento ?? '',
          phone: data.telefone ?? '',
        })
      } catch {
        alert('Erro ao carregar dados do professor.')
        navigate('/professores')
      } finally {
        setLoadingData(false)
      }
    }

    fetchProfessor()
  }, [id])

  const handleFieldChange = (field: keyof TeacherFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: TeacherFormErrors = {}
    if (!formState.name.trim())       nextErrors.name = 'Informe o nome do professor.'
    if (!formState.surname.trim())    nextErrors.surname = 'Informe o sobrenome do professor.'
    if (!formState.birthDate.trim())  nextErrors.birthDate = 'Informe a data de nascimento.'
    if (!formState.email.trim())      nextErrors.email = 'Informe o e-mail do professor.'
    else if (!/^\S+@\S+\.\S+$/.test(formState.email)) nextErrors.email = 'Informe um e-mail válido.'
    if (!formState.street.trim())     nextErrors.street = 'Informe a rua do endereço.'
    if (!formState.complement.trim()) nextErrors.complement = 'Informe o complemento do endereço.'
    if (!formState.phone.trim())      nextErrors.phone = 'Informe o telefone de contato.'
    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)

    const payload = {
      nome: `${formState.name} ${formState.surname}`.trim(),
      dataNascimento: formState.birthDate,
      email: formState.email,
      rua: formState.street,
      complemento: formState.complement,
      telefone: formState.phone,
    }

    try {
      if (isEditing) {
        await api.put(`/professores/${id}`, payload)
      } else {
        await api.post('/auth/register/professor', payload)
      }
      navigate('/professores')
    } catch {
      alert(isEditing ? 'Erro ao atualizar professor.' : 'Erro ao cadastrar professor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingData) return <div className="appLoading">Carregando dados...</div>

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
            <h2 className="teacher-create-page__title">
              {isEditing ? 'Editar Professor' : 'Cadastrar Novo Professor'}
            </h2>

            <FormSection title="Dados do professor" icon={<UserRound size={16} aria-hidden="true" />}>
              <FormField
                id="teacher-name"
                label="Nome"
                placeholder="Ex.: Maria"
                value={formState.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={formErrors.name}
                required
              />
              <FormField
                id="teacher-surname"
                label="Sobrenome"
                placeholder="Ex.: Souza"
                value={formState.surname}
                onChange={(e) => handleFieldChange('surname', e.target.value)}
                error={formErrors.surname}
                required
              />
              <FormField
                id="teacher-birth-date"
                label="Data de nascimento"
                type="date"
                value={formState.birthDate}
                onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                error={formErrors.birthDate}
                required
              />
              <FormField
                id="teacher-email"
                label="E-mail"
                type="email"
                placeholder="professor@email.com"
                value={formState.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
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
                onChange={(e) => handleFieldChange('street', e.target.value)}
                error={formErrors.street}
                required
              />
              <FormField
                id="teacher-complement"
                label="Complemento do endereço"
                placeholder="Ex.: Casa 2, bloco B"
                value={formState.complement}
                onChange={(e) => handleFieldChange('complement', e.target.value)}
                error={formErrors.complement}
                required
              />
              <FormField
                id="teacher-phone"
                label="Telefone de contato"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formState.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                error={formErrors.phone}
                required
              />
            </FormSection>

            <FormActions
              onCancel={() => navigate('/professores')}
              onSubmit={handleSubmit}
              submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar professor'}
              loading={isSubmitting}
            />
          </section>
        </main>
      </div>
    </div>
  )
}