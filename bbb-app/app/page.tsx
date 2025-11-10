import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tv, TrendingUp, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-2xl">
              <Tv className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-balance">BBB Votação</h1>
          </div>

          {/* Hero Text */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-balance">
            Vote no seu participante favorito do Big Brother Brasil e acompanhe as estatísticas em tempo real
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/votar">Votar Agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/dashboard">Ver Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/login">Entrar</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 w-full mt-12">
            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Votação Fácil</h3>
              <p className="text-sm text-muted-foreground text-balance">
                Vote com apenas um clique no seu participante favorito
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Estatísticas em Tempo Real</h3>
              <p className="text-sm text-muted-foreground text-balance">Acompanhe os votos totais e da última hora</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Dashboard Completo</h3>
              <p className="text-sm text-muted-foreground text-balance">Visualize gráficos e análises detalhadas</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Tv className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Seguro e Confiável</h3>
              <p className="text-sm text-muted-foreground text-balance">
                Sistema protegido com autenticação de usuário
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
