"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Home, TrendingUp, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { participantsAPI, votingAPI } from "@/lib/api"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const participantId = searchParams.get("participanteId")
  const [votedParticipant, setVotedParticipant] = useState<any>(null)
  const [votesByParticipant, setVotesByParticipant] = useState<any[]>([])
  const [votesByHour, setVotesByHour] = useState<Record<string, number>>({})
  const [totalVotes, setTotalVotes] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      if (!participantId) {
        setError("ID do participante não encontrado")
        setIsLoading(false)
        return
      }

      try {
        const [allParticipants, votesByPart, totalVotesData, votesByHourData] = await Promise.all([
          participantsAPI.getAll(),
          votingAPI.getVotesByParticipant(),
          votingAPI.getTotalVotes(),
          votingAPI.getVotesByHour(), // [{hora, participantes: [{participanteId, nome, totalVotos}]}]
        ])

        // Encontrar participante votado
        const participant = allParticipants.find((p) => p.id === String(participantId))

        // Última hora
        const currentHour = new Date().getHours()
        const lastHourData = votesByHourData.find((v: any) => v.hora === currentHour)
        const lastHourVotesByParticipant: Record<string, number> = {}

        if (lastHourData) {
          lastHourData.participantes.forEach((p: any) => {
            lastHourVotesByParticipant[p.participanteId] = p.totalVotos
          })
        }

        setVotedParticipant(participant)
        setVotesByParticipant(votesByPart)
        setTotalVotes(totalVotesData)
        setVotesByHour(lastHourVotesByParticipant)
      } catch (err) {
        setError("Falha ao carregar dados. Tente novamente.")
        console.error("Failed to load confirmation data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [participantId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    )
  }

  if (error || !votedParticipant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Participante não encontrado"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 rounded-full p-6">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Voto Confirmado!</h1>
          <p className="text-lg text-muted-foreground text-balance">Seu voto foi registrado com sucesso</p>
        </div>

        {/* Voted Participant Card */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-center">Você votou em:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={votedParticipant.fotoUrl || "/placeholder.svg"} alt={votedParticipant.nome} />
                <AvatarFallback className="text-2xl">
                  {votedParticipant.nome
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-2xl mb-1">{votedParticipant.nome}</h3>
                <p className="text-muted-foreground">{votedParticipant.descricao}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Estatísticas de Votação</h2>

          {totalVotes && (
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <p className="text-lg text-muted-foreground mb-2">Total Geral de Votos</p>
                <p className="text-4xl font-bold">{totalVotes.totalGeralVotos?.toLocaleString() || 0}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {votesByParticipant.map((stat: any, index: number) => {
              const isVoted = stat.participanteId === participantId
              // Acessando corretamente os votos da última hora
              const lastHourVote = votesByHour[stat.id || stat.participanteId] || 0

              return (
                <Card key={stat.participanteId} className={isVoted ? "ring-2 ring-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-bold text-muted-foreground w-8">{index + 1}</span>
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={stat.fotoUrl || "/placeholder.svg"} alt={stat.nome} />
                        <AvatarFallback>
                          {stat.nome
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{stat.nome || "Desconhecido"}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{stat.totalVotos || 0}</p>
                        <p className="text-sm text-muted-foreground">votos</p>
                      </div>
                    </div>

                    <Progress value={(stat.totalVotos / (totalVotes?.totalGeralVotos || 1)) * 100} className="h-3 mb-3" />

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Total: {stat.totalVotos || 0} votos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Última hora: {lastHourVote} votos</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/votar">Votar Novamente</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Carregando...</p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
