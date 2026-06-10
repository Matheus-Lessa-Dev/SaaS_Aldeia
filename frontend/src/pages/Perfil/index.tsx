import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { trocarSenha } from '../../services/authService'
import './style.css'

function Perfil() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showSenhaAtual, setShowSenhaAtual] = useState(false)
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isPrimeiroAcesso = user?.primeiroAcesso === true

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      await trocarSenha(senhaAtual, novaSenha)

      // Atualiza o user no contexto marcando primeiroAcesso como false
      if (user) {
        const updatedUser = { ...user, primeiroAcesso: false }
        login(updatedUser, localStorage.getItem('token')!, localStorage.getItem('refreshToken')!)
      }

      navigate('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.erro ?? err?.response?.data?.message
      setError(msg || 'Erro ao trocar a senha. Verifique a senha atual.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="perfil-page">
      <div className="perfil-container">

        {isPrimeiroAcesso && (
          <div className="perfil-aviso">
            🔐 Este é seu primeiro acesso. Por segurança, troque sua senha antes de continuar.
          </div>
        )}

        <h2 className="perfil-title">
          {isPrimeiroAcesso ? 'Criar nova senha' : 'Alterar senha'}
        </h2>

        <p className="perfil-email">{user?.email}</p>

        {error && <p className="perfil-error">{error}</p>}

        <form className="perfil-form" onSubmit={handleSubmit}>
          <div className="perfil-field">
            <label htmlFor="senhaAtual">
              {isPrimeiroAcesso ? 'Senha temporária' : 'Senha atual'}
            </label>
            <div className="input-wrapper">
              <Lock size={18} aria-hidden="true" />
              <input
                id="senhaAtual"
                type={showSenhaAtual ? 'text' : 'password'}
                placeholder="********"
                required
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
              <button type="button" onClick={() => setShowSenhaAtual((c) => !c)}>
                {showSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="perfil-field">
            <label htmlFor="novaSenha">Nova senha</label>
            <div className="input-wrapper">
              <Lock size={18} aria-hidden="true" />
              <input
                id="novaSenha"
                type={showNovaSenha ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                required
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <button type="button" onClick={() => setShowNovaSenha((c) => !c)}>
                {showNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="perfil-field">
            <label htmlFor="confirmarSenha">Confirmar nova senha</label>
            <div className="input-wrapper">
              <Lock size={18} aria-hidden="true" />
              <input
                id="confirmarSenha"
                type="password"
                placeholder="Repita a nova senha"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
          </div>

          <div className="perfil-actions">
            {!isPrimeiroAcesso && (
              <button
                type="button"
                className="perfil-cancel"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
            )}
            <button className="button-primary perfil-submit" type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar senha'} <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {!isPrimeiroAcesso && (
          <button className="perfil-logout" type="button" onClick={() => { logout(); navigate('/login') }}>
            Sair da conta
          </button>
        )}
      </div>
    </div>
  )
}

export default Perfil
