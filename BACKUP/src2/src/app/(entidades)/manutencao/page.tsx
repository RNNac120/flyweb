"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "../../ui/barralatesq"
import BarraLatDir from "../../ui/barralatdir"
import Link from "next/link"

export default function ExcluirManutencao() {
  const [manutencoes, setManutencoes] = useState([])
  const [termoPesquisa, setTermoPesquisa] = useState("")

  useEffect(() => {
    const fetchManutencoes = async () => {
      const response = await fetch("/api/manutencoes")
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setManutencoes(data)
      }
    }
    fetchManutencoes()
  }, [])

  const manutencoesFiltrados = manutencoes.filter((manutencao) =>
    manutencao.aviao.toLowerCase().includes(termoPesquisa.toLowerCase()),
  )

  const handleDelete = async (id_mnt: number, aviao: string) => {
    if (confirm(`Tem certeza que deseja excluir a manutenção de ${aviao}?`)) {
      try {
        const response = await fetch(`/api/manutencoes/${id_mnt}`, {
          method: "DELETE",
        })

        if (response.ok) {
          alert("Manutenção excluída com sucesso!")
          setManutencoes(manutencoes.filter((manutencao) => manutencao.id_mnt !== id_mnt))
        } else {
          alert("Erro ao excluir a manutenção!")
        }
      } catch (error) {
        console.error("Erro ao excluir manutenção:", error)
        alert("Erro ao excluir a manutenção!")
      }
    }
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
        <h1 className="mb-4 text-lg font-bold">Manutenções</h1>

        <div className="mb-6 flex gap-4 w-full">
          <input
            type="text"
            placeholder="Digite a matrícula do avião"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>

        {/* Tabela de Manutenções */}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border p-2 text-center">Matrícula do Avião</th>
              <th className="border p-2">Mecânico Responsável</th>
              <th className="border p-2 text-center">Data da Manutenção</th>
            </tr>
          </thead>
          <tbody>
            {manutencoesFiltrados.map((manutencao: any) => (
              <tr key={manutencao.id_mnt}>
                <td className="border p-2 text-center">{manutencao.aviao}</td>
                <td className="border p-2 text-center">{manutencao.mecanico}</td>
                <td className="border p-2 text-center">{manutencao.inicio_mnt.split("T")[0]}</td>
                <td className="border p-2 text-center flex justify-center gap-2">
                  <Link href={`/manutencao/alterar-manutencao/${manutencao.id_mnt}`}>
                    <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">Alterar</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(manutencao.id_mnt, manutencao.aviao)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link href={`/manutencao/cadastrar-manutencao/`}>
          <button className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700">Inserir</button>
        </Link>
      </div>
      <BarraLatDir />
    </main>
  )
}

