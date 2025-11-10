"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, AlertCircle, Shield } from "lucide-react"
import Link from "next/link"
import { participantsAPI, votingAPI, type Participante } from "@/lib/api"

export default function VotingPage() {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [participants, setParticipants] = useState<Participante[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }

    async function loadParticipants() {
      try {
        const data = await participantsAPI.getAll()
        setParticipants(data)
      } catch (err) {
        setError("Falha ao carregar participantes. Tente novamente.")
        console.error("Failed to load participants:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadParticipants()
  }, [router])

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 })
    setCaptchaAnswer("")
  }

  const handleParticipantSelect = (participantId: string) => {
    setSelectedParticipant(participantId)
    setShowCaptcha(true)
    generateCaptcha()
    setError("")
  }

  const handleVote = async () => {
    if (!selectedParticipant) return

    if (Number.parseInt(captchaAnswer) !== captchaQuestion.answer) {
      setError("Resposta incorreta. Tente novamente.")
      generateCaptcha()
      return
    }

    const userId = localStorage.getItem("userId")
    if (!userId) {
      setError("Você precisa estar logado para votar")
      router.push("/login")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await votingAPI.submitVote(userId, selectedParticipant)

      // Navigate to confirmation page
      router.push(`/confirmacao?participanteId=${selectedParticipant}`)
    } catch (err) {
      setError("Falha ao registrar voto. Tente novamente.")
      console.error("Vote submission error:", err)
      setIsSubmitting(false)
      setShowCaptcha(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando participantes...</p>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Escolha seu Participante Favorito</h1>
          <p className="text-lg text-muted-foreground text-balance">Selecione um participante e confirme seu voto</p>
        </div>

        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Participants Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {participants.map((participant) => (
            <Card
              key={participant.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedParticipant === participant.id ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => handleParticipantSelect(participant.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={participant.fotoUrl || "/placeholder.svg"} alt={participant.nome} />
                      <AvatarFallback className="text-2xl">
                        {participant.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {selectedParticipant === participant.id && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-xl mb-1">{participant.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{participant.descricao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showCaptcha && selectedParticipant && (
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Verificação Anti-Robô</CardTitle>
              </div>
              <CardDescription>Resolva a operação matemática para confirmar que você não é um robô</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-secondary rounded-lg">
                <p className="text-2xl font-bold">
                  {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="captcha">Sua resposta</Label>
                <Input
                  id="captcha"
                  type="number"
                  placeholder="Digite o resultado"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleVote()
                    }
                  }}
                />
              </div>
              <Button className="w-full" onClick={handleVote} disabled={!captchaAnswer || isSubmitting}>
                {isSubmitting ? "Enviando voto..." : "Confirmar Voto"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Vote Button (only shown when no participant selected) */}
        {!showCaptcha && (
          <div className="flex justify-center">
            <Button size="lg" className="text-lg px-12 py-6" disabled>
              Selecione um participante
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
