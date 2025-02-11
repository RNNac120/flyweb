"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

export default function MecanicoPage() {
  const [avioes, setAvioes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const userRole = "mecanico" // This should be set based on actual user authentication

  useEffect(() => {
    const fetchAvioes = async () => {
      try {
        const response = await fetch("/api/avioes")
        const data = await response.json()
        setAvioes(data)
        setLoading(false)
      } catch (error) {
        console.error("Erro na requisição:", error)
        setError(true)
        setLoading(false)
      }
    }

    fetchAvioes()
  }, [])

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-700">Carregando aviões...</div>
  }

  if (error || avioes.length === 0) {
    return <div className="text-center mt-20 text-xl text-red-600">Erro ao carregar os aviões.</div>
  }

  return (
    <div className="flex h-screen bg-sky-700">
      <BarraLatEsq userRole={userRole} />
      <div className="flex-1 p-8 bg-sky-200 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista de Aviões</h1>
        <div className="space-y-4">
          {avioes.map((aviao) => (
            <div key={aviao.matricula} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700">Matrícula: {aviao.matricula}</h2>
              <p>Modelo: {aviao.modelo_anv}</p>
              <p>Horas voadas: {aviao.horas_voadas}</p>
              <p>Próxima manutenção: {new Date(aviao.data_prox_mnt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
      <BarraLatDir userRole={userRole} />
    </div>
  )
}

