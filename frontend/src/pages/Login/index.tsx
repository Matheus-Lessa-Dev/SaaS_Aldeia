import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import './style.css'

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        navigate('/admin/dashboard')
    }

    return (
        <div className="login-container">
            <div className="login-gradient" />

            <form className="login-form-side" onSubmit={handleSubmit}>
                <h2>Bem-vindo</h2>
                <p>Acesse sua conta para continuar sua jornada pedagógica.</p>

                <div className="login-field">
                    <label htmlFor="email">E-mail</label>
                    <div className="input-wrapper">
                        <User size={18} aria-hidden="true" />
                        <input id="email" type="email" placeholder="nome@exemplo.com.br" required />
                    </div>
                </div>

                <div className="login-field">
                    <label htmlFor="password">Senha</label>
                    <div className="input-wrapper">
                        <Lock size={18} aria-hidden="true" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="********"
                            required
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            onClick={() => setShowPassword((current) => !current)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="login-row">
                    <button className="btn-forgot">Esqueci minha senha</button>
                </div>

                <button className="button-primary login-button" type="submit">
                    Entrar <ArrowRight size={18} aria-hidden="true" />
                </button>
            </form>
        </div>
    )
}

export default Login;
