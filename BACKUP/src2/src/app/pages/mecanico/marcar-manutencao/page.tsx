"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

interface Aviao {
  matricula: string
  modelo: string
}

export default function MarcarManutencao() {
  const [avioes, setAvioes] = useState<Aviao[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    aviao: "",
    dataInicio: "",
    dataFim: "",
    descricao: "",
  })

  useEffect(() => {
    const fetchAvioes = async () => {
      try {
        const response = await fetch("/api/avioes")
        if (response.ok) {
          const data = await response.json()
          setAvioes(data)
        } else {
          console.error("Erro ao buscar aviões")
        }
      } catch (error) {
        console.error("Erro na requisição:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvioes()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/manutencoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Manutenção agendada com sucesso!")
        setFormData({
          aviao: "",
          dataInicio: "",
          dataFim: "",
          descricao: "",
        })
      } else {
        alert("Erro ao agendar manutenção")
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Erro ao agendar manutenção")
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq userRole="Mecanico" />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Marcar Manutenção</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="aviao" className="block text-sm font-medium text-gray-700">
              Avião
            </label>
            <select
              id="aviao"
              name="aviao"
              value={formData.aviao}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um avião</option>
              {avioes.map((aviao) => (
                <option key={aviao.matricula} value={aviao.matricula}>
                  {aviao.modelo} - {aviao.matricula}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">
              Data de Início
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">
              Data de Fim (estimada)
            </label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição da Manutenção
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Agendar Manutenção
          </button>
        </form>
      </div>
      <BarraLatDir userRole="Mecanico" />
    </main>
  )
}

