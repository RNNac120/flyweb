"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "../../../ui/barralatesq"
import BarraLatDir from "../../../ui/barralatdir"
import { useRouter } from "next/navigation"

export default function CadastrarCompetencia() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nota: "",
    tipo_comp: "",
    aula: "",
    comentarios: "",
  })

  const [aulas, setAulas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aulasResponse] = await Promise.all([fetch("/api/aulas")])

        if (aulasResponse.ok) {
          const aulasData = await aulasResponse.json()
          setAulas(aulasData)
        } else {
          console.error("Erro ao buscar aulas")
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/competencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_comp: formData.tipo_comp,
          aula: formData.aula,
          comentarios: formData.comentarios || null,
          nota: Number.parseInt(formData.nota),
        }),
      })

      if (response.ok) {
        alert("Competência cadastrada com sucesso!")
        router.push("/competencia")
      } else {
        alert("Erro ao cadastrar competência!")
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Erro ao cadastrar competência!")
    }
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col gap-4 p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
        <h1 className="self-start mb-4 text-lg font-bold">Cadastrar Competência</h1>
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="tipo_comp" className="block text-gray-600">
                Nome da Competência
              </label>
              <input
                id="tipo_comp"
                name="tipo_comp"
                value={formData.tipo_comp}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="aula" className="block text-gray-600">
                Aula
              </label>
              <select
                id="aula"
                name="aula"
                value={formData.aula}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecione uma aula</option>
                {aulas.map((aula: any) => (
                  <option key={aula.id_aula} value={aula.id_aula}>
                    Aula {aula.id_aula} - Módulo {aula.modulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="nota" className="block text-gray-600">
                Nota
              </label>
              <input
                id="nota"
                name="nota"
                value={formData.nota}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="comentarios" className="block text-gray-600">
                Comentário
              </label>
              <input
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none"
            >
              Cadastrar
            </button>
          </form>
        )}
      </div>
      <BarraLatDir />
    </main>
  )
}

