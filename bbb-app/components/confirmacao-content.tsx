"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2, TrendingUp, Users, Clock } from "lucide-react"
import Link from "next/link"

interface Participante {
  id: string
  nome: string
  descricao: string
  urlFoto?: string | null
}

interface VotosHora {
  hora: number
  totalVotos: number
}

export function ConfirmacaoContent() {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [votosHora, setVotosHora] = useState<VotosHora[]>([])
  const [totalGeral, setTotalGeral] = useState(0)
  const [votedParticipante, setVotedParticipante] = useState<Participante | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }

    const participanteId = searchParams.get("participantId")
    if (!participanteId) {
      router.push("/votar")
      return
    }

    loadData(participanteId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async (participanteId: string) => {
    setIsLoading(true)
    try {
      const [participantesResp, votosHoraResp, totalResp] = await Promise.all([
        fetch("http://127.0.0.1:8080/participante/todos"),
        fetch("http://127.0.0.1:8080/voto/por-hora"),
        fetch("http://127.0.0.1:8080/voto/total-geral"),
      ])

      if (!participantesResp.ok) throw new Error("Erro ao carregar participantes")
      if (!votosHoraResp.ok) throw new Error("Erro ao carregar votos por hora")
      if (!totalResp.ok) throw new Error("Erro ao carregar total geral")

      const participantesData: Participante[] = await participantesResp.json()
      const votosHoraData: VotosHora[] = await votosHoraResp.json()
      const totalData = await totalResp.json()

      setParticipantes(participantesData)
      setVotosHora(votosHoraData)
      setTotalGeral(totalData.totalGeralVotos ?? 0)

      const found = participantesData.find((p) => String(p.id) === String(participanteId)) ?? null
      setVotedParticipante(found)
    } catch (err) {
      console.error("Erro ao carregar dados de confirmação:", err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as estatísticas",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  const totalUltimaHora = votosHora.length > 0 ? votosHora[votosHora.length - 1].totalVotos : 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Message */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Voto Confirmado!</h2>
        <p className="text-lg text-muted-foreground">
          Seu voto em{" "}
          <span className="font-semibold text-foreground">
            {votedParticipante?.nome ?? "Participante Desconhecido"}
          </span>{" "}
          foi registrado com sucesso.
        </p>
      </div>

      {/* Total Geral */}
      <Card className="mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Total Geral de Votos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{totalGeral.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-muted-foreground mt-1">votos computados até agora</p>
        </CardContent>
      </Card>

      {/* Estatísticas por Participante */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-bold mb-4">Participantes</h3>

        {participantes.map((p) => {
          const isVoted = votedParticipante?.id === p.id

          return (
            <Card key={`participante-${p.id}`} className={isVoted ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{p.nome}</h4>
                    <p className="text-sm text-muted-foreground">{p.descricao}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-xs text-muted-foreground">Votos Totais</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-secondary/50 rounded-lg">
                      <Clock className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalUltimaHora.toLocaleString("pt-BR")}</p>
                      <p className="text-xs text-muted-foreground">Votos na Última Hora (geral)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" className="flex-1 bg-transparent">
          <Link href="/votar">Votar Novamente</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  )
}
