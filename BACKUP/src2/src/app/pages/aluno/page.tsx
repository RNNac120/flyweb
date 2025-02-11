"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"
import ModuloAulas from "@/app/ui/row_modulos"

interface Aula {
  id_aula: number
  status: "disponivel" | "indisponivel" | "feita"
}

interface Modulo {
  id_modulo: number
  tipo_modulo: string
  aulas: Aula[]
}

interface Curso {
  id_curso: number
  nome_curso: string
  modulos: Modulo[]
}

export default function AlunoPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const userRole = "aluno"

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        // First, fetch the courses
        const cursosResponse = await fetch("/api/cursos")
        const cursosData = await cursosResponse.json()

        // Then, for each course, fetch its modules
        const cursosWithModulos = await Promise.all(
          cursosData.map(async (curso: Curso) => {
            const modulosResponse = await fetch(`/api/modulos?curso=${curso.id_curso}`)
            const modulosData = await modulosResponse.json()

            // For each module, fetch its aulas
            const modulosWithAulas = await Promise.all(
              modulosData.map(async (modulo: Modulo) => {
                const aulasResponse = await fetch(`/api/aulas?modulo=${modulo.id_modulo}`)
                const aulasData = await aulasResponse.json()
                return {
                  ...modulo,
                  aulas: aulasData,
                }
              }),
            )

            return {
              ...curso,
              modulos: modulosWithAulas,
            }
          }),
        )

        setCursos(cursosWithModulos)
        setLoading(false)
      } catch (error) {
        console.error("Erro na requisição:", error)
        setError(true)
        setLoading(false)
      }
    }

    fetchCursos()
  }, [])

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-700">Carregando cursos...</div>
  }

  if (error || cursos.length === 0) {
    return <div className="text-center mt-20 text-xl text-red-600">Erro ao carregar os cursos.</div>
  }

  return (
    <div className="flex h-screen bg-sky-700">
      <BarraLatEsq userRole={userRole} />
      <div className="flex-1 bg-sky-700 p-8">
        <div className="bg-sky-200 rounded-lg p-6 min-h-full">
          {cursos.map((curso) => (
            <div key={curso.id_curso} className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">{curso.nome_curso}</h1>
              <div className="space-y-6">
                {curso.modulos?.map((modulo) => (
                  <div key={modulo.id_modulo} className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                      Módulo {modulo.id_modulo}: {modulo.tipo_modulo}
                    </h2>
                    <ModuloAulas modulo={modulo} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BarraLatDir userRole={userRole} />
    </div>
  )
}

