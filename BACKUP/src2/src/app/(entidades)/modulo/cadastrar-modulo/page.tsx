"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "../../../ui/barralatesq"
import BarraLatDir from "../../../ui/barralatdir"

export default function CadastrarModulo() {
  const [formData, setFormData] = useState({
    tipo_modulo: "",
    id_curso: "",
    id_modulo: "",
  })

  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch("/api/cursos")
        if (response.ok) {
          const data = await response.json()
          setCursos(data)
        } else {
          console.error("Erro ao buscar cursos")
        }
      } catch (error) {
        console.error("Erro na requisição dos cursos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCursos()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/modulos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_modulo: formData.tipo_modulo,
          id_curso: Number.parseInt(formData.id_curso),
          id_modulo: Number.parseInt(formData.id_modulo),
        }),
      })

      if (response.ok) {
        alert("Módulo cadastrado com sucesso!")
        setFormData({
          tipo_modulo: "",
          id_curso: "",
          id_modulo: "",
        })
      } else {
        alert("Erro ao cadastrar o módulo!")
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Erro ao cadastrar o módulo!")
    }
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
        <h1 className="self-start mb-4 text-lg font-bold">Cadastrar Módulo</h1>
        {loading ? (
          <p>Carregando cursos...</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="tipo_modulo" className="block text-gray-600">
                Nome do Módulo
              </label>
              <input
                type="text"
                id="tipo_modulo"
                name="tipo_modulo"
                value={formData.tipo_modulo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="id_curso" className="block text-gray-600">
                Curso
              </label>
              <select
                id="id_curso"
                name="id_curso"
                value={formData.id_curso}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso: any) => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.nome_curso}
                  </option>
                ))}
              </select>
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

