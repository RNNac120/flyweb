"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "../../ui/barralatesq"
import BarraLatDir from "../../ui/barralatdir"
import Link from "next/link"

export default function ListarAulas() {
  const [aulas, setAulas] = useState([])
  const [pesquisa, setPesquisa] = useState("")

  const fetchAulas = async () => {
    const response = await fetch("/api/aulas")
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      setAulas(data)
    } else {
      console.error("Erro ao buscar aulas")
    }
  }

  const handleDelete = async (id_aula: number) => {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return

    const response = await fetch(`/api/aulas/${id_aula}`, { method: "DELETE" })
    if (response.ok) {
      alert("Aula excluída com sucesso!")
      fetchAulas()
    } else {
      alert("Erro ao excluir a aula.")
    }
  }

  useEffect(() => {
    fetchAulas()
  }, [])

  const aulasFiltradas = aulas.filter((aula) => aula.modulo?.toLowerCase().includes(pesquisa.toLowerCase()))

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 rounded-lg border bg-slate-200">
        <h1 className="text-lg font-bold mb-4">Gerenciar Aulas</h1>

        <div className="mb-6 flex gap-4 w-full">
          <input
            type="text"
            placeholder="Pesquisar por aula..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full mb-4 border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Data</th>
                <th className="border p-2">Hora Início</th>
                <th className="border p-2">Hora Fim</th>
                <th className="border p-2">Avião</th>
                <th className="border p-2">Módulo</th>
                <th className="border p-2">Aluno</th>
                <th className="border p-2">Instrutor</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {aulasFiltradas.map((aula: any) => (
                <tr key={aula.id_aula}>
                  <td className="border p-2 text-center">{aula.id_aula}</td>
                  <td className="border p-2 text-center">{new Date(aula.dia_aula).toLocaleDateString()}</td>
                  <td className="border p-2 text-center">
                    {new Date(aula.hora_inicio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(aula.hora_fim).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="border p-2 text-center">{aula.aviao_usado || "Avião não encontrado"}</td>
                  <td className="border p-2 text-center">{aula.modulo || "Módulo não encontrado"}</td>
                  <td className="border p-2 text-center">{aula.aluno || "Aluno não encontrado"}</td>
                  <td className="border p-2 text-center">{aula.instrutor || "Instrutor não encontrado"}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <Link href={`/aula/alterar-aula/${aula.id_aula}`}>
                      <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">Alterar</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(aula.id_aula)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex self-center mt-4">
          <Link href={"/aula/cadastrar-aula/"}>
            <button className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700">Inserir</button>
          </Link>
        </div>
      </div>
      <BarraLatDir />
    </main>
  )
}

