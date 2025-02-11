"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "../../ui/barralatesq"
import BarraLatDir from "../../ui/barralatdir"
import Link from "next/link"

export default function ExcluirCompetencia() {
  const [competencias, setCompetencias] = useState([])
  const [termoPesquisa, setTermoPesquisa] = useState("")

  useEffect(() => {
    const fetchCompetencias = async () => {
      const response = await fetch("/api/competencias")
      if (response.ok) {
        const data = await response.json()
        setCompetencias(data)
      }
    }
    fetchCompetencias()
  }, [])

  const competenciasFiltrados = competencias.filter((competencia) =>
    competencia.tipo_comp.toLowerCase().includes(termoPesquisa.toLowerCase()),
  )

  const handleDelete = async (id_comp: number, tipo_comp: string) => {
    if (confirm(`Tem certeza que deseja excluir a competência ${tipo_comp}?`)) {
      try {
        const response = await fetch(`/api/competencias/${id_comp}`, {
          method: "DELETE",
        })

        if (response.ok) {
          alert("Competência excluída com sucesso!")
          setCompetencias(competencias.filter((competencia) => competencia.id_comp !== id_comp))
        } else {
          alert("Erro ao excluir a competência!")
        }
      } catch (error) {
        console.error("Erro ao excluir competência:", error)
        alert("Erro ao excluir a competência!")
      }
    }
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
        <h1 className="mb-4 text-lg font-bold">Competências</h1>

        <div className="mb-6 flex gap-4 w-full">
          <input
            type="text"
            placeholder="Digite o nome da competência"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>

        {/* Tabela de Competências */}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border p-2 text-center">Nome da Competência</th>
              <th className="border p-2">Nota da Competência</th>
              <th className="border p-2 text-center">Comentários</th>
            </tr>
          </thead>
          <tbody>
            {competenciasFiltrados.map((competencia) => (
              <tr key={competencia.id_comp}>
                <td className="border p-2 text-center">{competencia.tipo_comp}</td>
                <td className="border p-2">{competencia.nota}</td>
                <td className="border p-2 text-center">{competencia.comentarios}</td>
                <td className="border p-2 text-center flex justify-center gap-2">
                  <Link href={`/competencia/alterar-competencia/${competencia.id_comp}`}>
                    <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">Alterar</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(competencia.id_comp, competencia.tipo_comp)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link href={`/competencia/cadastrar-competencia/`}>
          <button className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700">Inserir</button>
        </Link>
      </div>
      <BarraLatDir />
    </main>
  )
}

