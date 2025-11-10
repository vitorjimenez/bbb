"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Users, Clock } from "lucide-react"
import Link from "next/link"
import { votingAPI, participantsAPI, type Participante } from "@/lib/api"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function DashboardPage() {
  const [totalVotes, setTotalVotes] = useState<any>(null)
  const [votesByParticipant, setVotesByParticipant] = useState<any[]>([])
  const [votesByHour, setVotesByHour] = useState<Record<string, number>>({})
  const [votesByHourChart, setVotesByHourChart] = useState<any[]>([])
  const [participants, setParticipants] = useState<Participante[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [allParticipants, votesByPart, totalVotesData, votesByHourData] = await Promise.all([
          participantsAPI.getAll(),
          votingAPI.getVotesByParticipant(),
          votingAPI.getTotalVotes(),
          votingAPI.getVotesByHour(), // [{hora, participantes: [{participanteId, nome, totalVotos}]}]
        ])

        const currentHour = new Date().getHours()
        const lastHourData = votesByHourData.find((v: any) => v.hora === currentHour)
        const lastHourVotesByParticipant: Record<string, number> = {}

        if (lastHourData) {
          lastHourData.participantes.forEach((p: any) => {
            lastHourVotesByParticipant[p.participanteId] = p.totalVotos
          })
        }

        setParticipants(allParticipants)
        setTotalVotes(totalVotesData)
        setVotesByParticipant(votesByPart)
        setVotesByHour(lastHourVotesByParticipant)
        setVotesByHourChart(votesByHourData)
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const participantChartData = votesByParticipant.map((stat: any) => {
    const lastHourVote = votesByHour[stat.id || stat.participanteId] || 0

    return {
      id: stat.participanteId,
      name: stat.nome || "Desconhecido",
      votos: stat.totalVotos || 0,
      votosUltimaHora: lastHourVote,
    }
  })

  const hourChartData = votesByHourChart.map((item: any) => {
    const totalVotosHora = item.participantes?.reduce((sum: number, p: any) => sum + (p.totalVotos || 0), 0) || 0
    return {
      hora: `${item.hora}h`,
      votos: totalVotosHora,
    }
  })

  const totalLastHourVotes = Object.values(votesByHour).reduce((sum, votes) => sum + votes, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando dados do dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Dashboard de Votação</h1>
          <p className="text-lg text-muted-foreground text-balance">Acompanhe as estatísticas em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Votos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(totalVotes?.totalGeralVotos || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Votos registrados no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{participants.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Participantes ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Hora</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalLastHourVotes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Votos na última hora</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Votes by Participant */}
          <Card>
            <CardHeader>
              <CardTitle>Votos por Participante</CardTitle>
              <CardDescription>Distribuição total de votos entre os participantes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  votos: {
                    label: "Votos",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={participantChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="votos" fill="var(--color-votos)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Votes by Hour */}
          <Card>
            <CardHeader>
              <CardTitle>Votos por Hora</CardTitle>
              <CardDescription>Tendência de votação ao longo das horas</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  votos: {
                    label: "Votos",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="votos" stroke="var(--color-votos)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Participant Details Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detalhes dos Participantes</CardTitle>
            <CardDescription>Ranking completo de votos por participante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participantChartData
                .sort((a, b) => b.votos - a.votos)
                .map((item, index) => (
                  <div key={item.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-2xl text-muted-foreground w-8">#{index + 1}</div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.votos} votos totais · {item.votosUltimaHora} na última hora
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {((item.votos / (totalVotes?.totalGeralVotos || 1)) * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">do total</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
