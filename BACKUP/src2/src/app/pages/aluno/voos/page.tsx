"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

interface Aula {
  id_aula: number
  status: "disponivel" | "indisponivel" | "feita"
  data: string
  nota?: number
}

interface Modulo {
  id_modulo: number
  tipo_modulo: string
  aulas: Aula[]
}

export default function VoosAluno() {
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVoos = async () => {
      try {
        const response = await fetch("/api/aulas/aluno")
        if (!response.ok) {
          throw new Error("Erro ao carregar voos")
        }
        const data = await response.json()
        setModulos(data)
      } catch (err) {
        console.error("Erro:", err)
        setError("Erro ao carregar voos")
      } finally {
        setLoading(false)
      }
    }

    fetchVoos()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "feita":
        return "bg-green-500"
      case "disponivel":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq userRole="Aluno" />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Meus Voos</h1>

        {modulos.map((modulo) => (
          <div key={modulo.id_modulo} className="w-full mb-8">
            <h2 className="text-xl font-semibold mb-4">{modulo.tipo_modulo}</h2>
            <div className="flex flex-wrap gap-4">
              {modulo.aulas.map((aula) => (
                <div
                  key={aula.id_aula}
                  className={`w-24 h-24 ${getStatusColor(aula.status)} rounded-lg flex flex-col items-center justify-center text-white`}
                >
                  <div className="text-lg font-bold">Aula {aula.id_aula}</div>
                  {aula.nota && <div className="text-sm">Nota: {aula.nota}</div>}
                  <div className="text-xs">{new Date(aula.data).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <BarraLatDir userRole="Aluno" />
    </main>
  )
}

