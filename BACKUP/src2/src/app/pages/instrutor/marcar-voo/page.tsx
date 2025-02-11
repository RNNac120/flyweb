"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

interface Aluno {
  cpf: string
  nome: string
}

interface Aviao {
  matricula: string
  modelo: string
  disponivel: boolean
}

interface Modulo {
  id: number
  nome: string
}

export default function MarcarVoo() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [avioes, setAvioes] = useState<Aviao[]>([])
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    aluno: "",
    aviao: "",
    modulo: "",
    data: "",
    hora: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosRes, avioesRes, modulosRes] = await Promise.all([
          fetch("/api/alunos"),
          fetch("/api/avioes"),
          fetch("/api/modulos"),
        ])

        const [alunosData, avioesData, modulosData] = await Promise.all([
          alunosRes.json(),
          avioesRes.json(),
          modulosRes.json(),
        ])

        setAlunos(alunosData)
        setAvioes(avioesData)
        setModulos(modulosData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/voos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Voo marcado com sucesso!")
        // Reset form
        setFormData({
          aluno: "",
          aviao: "",
          modulo: "",
          data: "",
          hora: "",
        })
      } else {
        alert("Erro ao marcar voo")
      }
    } catch (error) {
      console.error("Erro ao marcar voo:", error)
      alert("Erro ao marcar voo")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq userRole="Instrutor" />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200">
        <h1 className="text-2xl font-bold mb-6">Marcar Voo</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aluno</label>
              <select
                name="aluno"
                value={formData.aluno}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.cpf} value={aluno.cpf}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Avião</label>
              <select
                name="aviao"
                value={formData.aviao}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um avião</option>
                {avioes
                  .filter((aviao) => aviao.disponivel)
                  .map((aviao) => (
                    <option key={aviao.matricula} value={aviao.matricula}>
                      {aviao.modelo} - {aviao.matricula}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Módulo</label>
              <select
                name="modulo"
                value={formData.modulo}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um módulo</option>
                {modulos.map((modulo) => (
                  <option key={modulo.id} value={modulo.id}>
                    {modulo.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Marcar Voo
            </button>
          </div>
        </form>
      </div>
      <BarraLatDir userRole="Instrutor" />
    </main>
  )
}

