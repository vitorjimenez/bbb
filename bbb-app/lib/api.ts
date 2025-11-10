// API configuration and utility functions for Spring Boot backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  const text = await response.text()
  const contentType = response.headers.get("content-type")

  if (!response.ok) throw new Error(text || `API error: ${response.status}`)

  // Try to parse JSON, otherwise return text
  try {
    return JSON.parse(text)
  } catch {
    return { message: text } as unknown as T
  }
}

export interface Usuario {
  id?: string
  nome: string
  email: string
  senha: string
  telefone: string
  statusConta?: string
  criadoEm?: string
}

export const authAPI = {
  async login(email: string, senha: string): Promise<string> {
    return apiRequest<string>("/usuario/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    })
  },

  async register(usuario: Usuario): Promise<string> {
    return apiRequest<string>("/usuario/registro", {
      method: "POST",
      body: JSON.stringify(usuario),
    })
  },
}

export interface Participante {
  id: string
  nome: string
  descricao: string
  fotoUrl?: string
  criadoEm?: string
}

export const participantsAPI = {
  async getAll(): Promise<Participante[]> {
    return apiRequest<Participante[]>("/participante/todos")
  },

  async register(participante: Participante): Promise<string> {
    return apiRequest<string>("/participante/registro", {
      method: "POST",
      body: JSON.stringify(participante),
    })
  },
}

export interface VotoStats {
  participanteId: string
  participanteNome: string
  totalVotos: number
  votosPorHora?: number
}

export const votingAPI = {
  async submitVote(userId: string, participanteId: string): Promise<string> {
    return apiRequest<string>("/voto/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userId: userId ?? "",
        participanteId: participanteId ?? "",
      }),
    })
  },

  async getVotesByParticipant(): Promise<Array<Record<string, any>>> {
    return apiRequest<Array<Record<string, any>>>("/voto/por-participante")
  },

  async getTotalVotes(): Promise<Record<string, any>> {
    return apiRequest<Record<string, any>>("/voto/total-geral")
  },

  async getVotesByHour(): Promise<Array<Record<string, any>>> {
    return apiRequest<Array<Record<string, any>>>("/voto/por-hora")
  },
}
