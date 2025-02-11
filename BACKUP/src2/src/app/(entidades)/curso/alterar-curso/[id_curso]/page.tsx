"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import BarraLatEsq from "../../../../ui/barralatesq"
import BarraLatDir from "../../../../ui/barralatdir"

export default function AlterarCurso() {
  const { id_curso } = useParams() as { id_curso: string }
  const router = useRouter()
  const [nomeCurso, setNomeCurso] = useState("")

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await fetch(`/api/cursos/${id_curso}`)

        if (response.ok) {
          const curso = await response.json()
          setNomeCurso(curso.nome_curso)
        } else {
          alert("Erro ao carregar dados do curso.")
        }
      } catch (error) {
        console.error("Erro ao buscar curso:", error)
        alert("Erro ao carregar dados do curso.")
      }
    }

    fetchCurso()
  }, [id_curso])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/cursos/${id_curso}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_curso: nomeCurso }),
      })

      if (response.ok) {
        alert("Curso atualizado com sucesso!")
        router.push("/curso")
      } else {
        alert("Erro ao atualizar o curso!")
      }
    } catch (error) {
      console.error("Erro ao atualizar curso:", error)
      alert("Erro ao atualizar o curso!")
    }
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
        <h1 className="self-start mb-4 text-lg font-bold">Alterar Curso</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="nomeCurso" className="block text-gray-600">
              Nome do Curso
            </label>
            <input
              type="text"
              id="nomeCurso"
              name="nomeCurso"
              value={nomeCurso}
              onChange={(e) => setNomeCurso(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Atualizar
          </button>
        </form>
      </div>
      <BarraLatDir />
    </main>
  )
}

