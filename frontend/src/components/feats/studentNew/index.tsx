import { useState, useEffect } from 'react'
import { GraduationCap, UserRound, Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar1 from '../../solos/sideBar/SideBar1'
import { FormActions } from '../../shared/formActions'
import { FormField } from '../../shared/formField'
import { FormSection } from '../../shared/formSection'
import api from '../../../services/api'
import '../../shared/ManagementPageShell/style.css'
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

type StudentFormErrors = Partial<Record<keyof StudentFormState, string>>

const emptyForm: StudentFormState = {
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
}

export default function StudentCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [formState, setFormState] = useState<StudentFormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<StudentFormErrors>({})

  // Se for edição, busca os dados do aluno e preenche o form
useEffect(() => {
  if (!isEditing) return

  async function fetchAluno() {
    try {
      const { data } = await api.get(`/alunos/${id}`)

      const [firstName, ...rest] = (data.nome as string).split(' ')

      setFormState({
        name: firstName ?? '',
        surname: rest.join(' ') ?? '',
        birthDate: data.dataNascimento ?? '',        // ✅ agora retorna
        addressStreet: data.rua ?? '',               // ✅ agora retorna
        email: data.email ?? '',
        addressComplement: data.complemento ?? '',   // ✅ agora retorna
        guardianName: data.nomeResponsavel?.split(' ')[0] ?? '',
        guardianSurname: data.nomeResponsavel?.split(' ').slice(1).join(' ') ?? '',
        guardianPhone: data.telefoneResponsavel ?? '',
        guardianEmail: data.emailResponsavel ?? '',  // ✅ agora retorna
      })
    } catch {
      alert('Erro ao carregar dados do aluno.')
      navigate('/alunos')
    } finally {
      setLoadingData(false)
    }
  }

  fetchAluno()
}, [id])

  const handleFieldChange = (field: keyof StudentFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: StudentFormErrors = {}
    if (!formState.name.trim())            nextErrors.name = 'Informe o nome do aluno.'
    if (!formState.surname.trim())         nextErrors.surname = 'Informe o sobrenome do aluno.'
    if (!formState.birthDate.trim())       nextErrors.birthDate = 'Informe a data de nascimento.'
    if (!formState.addressStreet.trim())   nextErrors.addressStreet = 'Informe a rua do endereço.'
    if (!formState.email.trim())           nextErrors.email = 'Informe o e-mail do aluno.'
    else if (!/^\S+@\S+\.\S+$/.test(formState.email)) nextErrors.email = 'Informe um e-mail válido.'
    if (!formState.addressComplement.trim()) nextErrors.addressComplement = 'Informe o complemento.'
    if (!formState.guardianName.trim())    nextErrors.guardianName = 'Informe o nome do responsável.'
    if (!formState.guardianSurname.trim()) nextErrors.guardianSurname = 'Informe o sobrenome do responsável.'
    if (!formState.guardianPhone.trim())   nextErrors.guardianPhone = 'Informe o telefone de contato.'
    if (!formState.guardianEmail.trim())   nextErrors.guardianEmail = 'Informe o e-mail do responsável.'
    else if (!/^\S+@\S+\.\S+$/.test(formState.guardianEmail)) nextErrors.guardianEmail = 'Informe um e-mail válido.'
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
      rua: formState.addressStreet,
      complemento: formState.addressComplement,
      nomeResponsavel: `${formState.guardianName} ${formState.guardianSurname}`.trim(),
      telefoneResponsavel: formState.guardianPhone,
      emailResponsavel: formState.guardianEmail,
    }

    try {
      if (isEditing) {
        await api.put(`/alunos/${id}`, payload)
      } else {
        await api.post('/auth/register/aluno', { ...payload, senha: '123456' })
      }
      navigate('/alunos')
    } catch {
      alert(isEditing ? 'Erro ao atualizar aluno.' : 'Erro ao cadastrar aluno.')
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
          <section className="student-create-page__card" aria-label="Formulario de cadastro de aluno">
            <h2 className="student-create-page__title">
              {isEditing ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
            </h2>

            <FormSection title="Dados do aluno" icon={<UserRound size={16} aria-hidden="true" />}>
              <FormField id="student-name" label="Nome" placeholder="Ex.: Maria"
                value={formState.name} onChange={(e) => handleFieldChange('name', e.target.value)}
                error={formErrors.name} required />
              <FormField id="student-surname" label="Sobrenome" placeholder="Ex.: Souza"
                value={formState.surname} onChange={(e) => handleFieldChange('surname', e.target.value)}
                error={formErrors.surname} required />
              <FormField id="student-birth-date" label="Data de nascimento" type="date"
                value={formState.birthDate} onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                error={formErrors.birthDate} required />
              <FormField id="student-street" label="Rua do endereço" placeholder="Ex.: Rua das Flores, 123"
                value={formState.addressStreet} onChange={(e) => handleFieldChange('addressStreet', e.target.value)}
                error={formErrors.addressStreet} required />
              <FormField id="student-email" label="E-mail" type="email" placeholder="seuemail@gmail.com"
                value={formState.email} onChange={(e) => handleFieldChange('email', e.target.value)}
                error={formErrors.email} required />
              <FormField id="student-address-complement" label="Complemento do endereço" placeholder="Ex.: Casa 2"
                value={formState.addressComplement} onChange={(e) => handleFieldChange('addressComplement', e.target.value)}
                error={formErrors.addressComplement} required />
            </FormSection>

            <FormSection title="Dados do responsável" icon={<Users size={16} aria-hidden="true" />}>
              <FormField id="guardian-name" label="Nome" placeholder="Ex.: Ana"
                value={formState.guardianName} onChange={(e) => handleFieldChange('guardianName', e.target.value)}
                error={formErrors.guardianName} required />
              <FormField id="guardian-surname" label="Sobrenome" placeholder="Ex.: Souza"
                value={formState.guardianSurname} onChange={(e) => handleFieldChange('guardianSurname', e.target.value)}
                error={formErrors.guardianSurname} required />
              <FormField id="guardian-phone" label="Telefone de contato" type="tel" placeholder="(11) 99999-9999"
                value={formState.guardianPhone} onChange={(e) => handleFieldChange('guardianPhone', e.target.value)}
                error={formErrors.guardianPhone} required />
              <FormField id="guardian-email" label="E-mail" type="email" placeholder="responsavel@email.com"
                value={formState.guardianEmail} onChange={(e) => handleFieldChange('guardianEmail', e.target.value)}
                error={formErrors.guardianEmail} required />
            </FormSection>

            <FormActions
              onCancel={() => navigate('/alunos')}
              onSubmit={handleSubmit}
              submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar aluno'}
              loading={isSubmitting}
            />
          </section>
        </main>
      </div>
    </div>
  )
}