"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "../../ui/barralatesq"
import BarraLatDir from "../../ui/barralatdir"
import Link from "next/link"

export default function ExcluirAviao() {
  const [avioes, setAvioes] = useState([])
  const [termoPesquisa, setTermoPesquisa] = useState("")

  useEffect(() => {
    const fetchAvioes = async () => {
      const response = await fetch("/api/avioes")
      if (response.ok) {
        const data = await response.json()
        setAvioes(data)
      }
    }
    fetchAvioes()
  }, [])

  const avioesFiltrados = avioes.filter((aviao) => aviao.matricula.toLowerCase().includes(termoPesquisa.toLowerCase()))

  const handleDelete = async (matricula: string) => {
    if (confirm(`Tem certeza que deseja excluir o avião ${matricula}?`)) {
      try {
        const response = await fetch(`/api/avioes/${matricula}`, {
          method: "DELETE",
        })

        if (response.ok) {
          alert("Avião excluído com sucesso!")
          setAvioes(avioes.filter((aviao) => aviao.matricula !== matricula))
        } else {
          alert("Erro ao excluir o avião!")
        }
      } catch (error) {
        console.error("Erro ao excluir avião:", error)
        alert("Erro ao excluir o avião!")
      }
    }
  }

  // Função para formatar a data
  const formatarData = (data: string) => {
    const novaData = new Date(data)
    return novaData.toLocaleDateString("pt-BR") // Formato dia/mês/ano
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
        <h1 className="mb-4 text-lg font-bold">Aviões</h1>

        <div className="mb-6 flex gap-4 w-full">
          <input
            type="text"
            placeholder="Digite a matrícula da aeronave"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>

        {/* Tabela de Aviões */}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border p-2 text-center">Matrícula</th>
              <th className="border p-2">Fabricante</th>
              <th className="border p-2 text-center">Data de Manutenção</th>
              <th className="border p-2 text-center">Disponibilidade</th>
              <th className="border p-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {avioesFiltrados.map((aviao) => (
              <tr key={aviao.matricula}>
                <td className="border p-2 text-center">{aviao.matricula}</td>
                <td className="border p-2">{aviao.fabricante}</td>
                <td className="border p-2 text-center">{formatarData(aviao.data_prox_mnt)}</td>
                <td className="border p-2 text-center">{aviao.disp_voo ? "Disponível" : "Indisponível"}</td>
                <td className="border p-2 text-center flex justify-center gap-2">
                  <Link href={`/aviao/alterar-aviao/${aviao.matricula}`}>
                    <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">Alterar</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(aviao.matricula)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link href={`/aviao/cadastrar-aviao/`}>
          <button className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700">Inserir</button>
        </Link>
      </div>
      <BarraLatDir />
    </main>
  )
}

