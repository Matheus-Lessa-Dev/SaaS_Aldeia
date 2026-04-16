import { useState } from "react";
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import "./style.css";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-container">
            <div className="login-gradient" />

            <div className="login-form-side">
                <h2>Bem-vindo</h2>
                <p>Acesse sua conta para continuar sua jornada pedagógica.</p>

                <div className="login-field">
                    <label>E-mail</label>
                    <div className="input-wrapper">
                        <User size={18} aria-hidden="true" />
                        <input type="email" placeholder="nome@exemplo.com.br" />
                    </div>
                </div>

                <div className="login-field">
                    <label>Senha</label>
                    <div className="input-wrapper">
                        <Lock size={18} aria-hidden="true" />
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••"/>
                        <button
                            type="button"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="login-row">
                    <button className="btn-forgot">Esqueci minha senha</button>
                </div>

                <button className="button-primary login-button">
                    Entrar <ArrowRight size={18} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default Login;
