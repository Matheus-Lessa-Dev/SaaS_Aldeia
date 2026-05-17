import api from './api';
import { Role } from '../context/AuthContext';

interface LoginResponse {
  token: string;
  refreshToken: string;
  role: string;
  email: string;
  primeiroAcesso: boolean;
}

function mapRole(apiRole: string): Role {
  switch (apiRole) {
    case 'ADMIN':     return Role.Admin;
    case 'PROFESSOR': return Role.Teacher;
    case 'ALUNO':     return Role.Student;
    default: throw new Error(`Role desconhecido: ${apiRole}`);
  }
}

export async function loginRequest(email: string, senha: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, senha });

  return {
    token: data.token,
    refreshToken: data.refreshToken,
    email: data.email,
    role: mapRole(data.role),
    primeiroAcesso: data.primeiroAcesso, 
  };
}

export async function trocarSenha(senhaAtual: string, novaSenha: string) {
  await api.put('/perfil/senha', { senhaAtual, novaSenha });
}