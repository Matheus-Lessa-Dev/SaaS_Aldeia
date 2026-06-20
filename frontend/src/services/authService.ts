import api from "./api";
import { Role } from "../context/AuthContext";

interface LoginResponse {
  token: string;
  role: string;
  email: string;
  nome: string;
  id: number;
}

export function mapRole(apiRole: string): Role {
  switch (apiRole) {
    case "ADMIN":
      return Role.Admin;
    case "PROFESSOR":
      return Role.Teacher;
    case "ALUNO":
      return Role.Student;
    default:
      throw new Error(`Role desconhecido: ${apiRole}`);
  }
}

export async function loginRequest(email: string, senha: string) {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    senha,
  });

  return {
    token: data.token,
    email: data.email,
    nome: data.nome,
    role: mapRole(data.role),
    id: data.id,
  };
}
