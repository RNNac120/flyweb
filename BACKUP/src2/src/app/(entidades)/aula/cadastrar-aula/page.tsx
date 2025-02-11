"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "../../../ui/barralatesq"
import BarraLatDir from "../../../ui/barralatdir"

export default function CadastrarAula() {
  const [formData, setFormData] = useState({
    dia_aula: "",
    hora_inicio: "",
    hora_fim: "",
    id_modulo: "",
    aviao_usado: "",
    aluno: "",
    instrutor: "",
  })

  const [modulos, setModulos] = useState([])
  const [avioes, setAvioes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modulosResponse, avioesResponse, usuariosResponse] = await Promise.all([
          fetch("/api/modulos"),
          fetch("/api/avioes"),
          fetch("/api/usuarios"),
        ])

        if (modulosResponse.ok) {
          const modulosData = await modulosResponse.json()
          setModulos(modulosData)
        } else {
          console.error("Erro ao buscar módulos")
        }

        if (avioesResponse.ok) {
          const avioesData = await avioesResponse.json()
          setAvioes(avioesData)
        } else {
          console.error("Erro ao buscar aviões")
        }

        if (usuariosResponse.ok) {
          const usuariosData = await usuariosResponse.json()
          setUsuarios(usuariosData)
        } else {
          console.error("Erro ao buscar usuários")
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
      const response = await fetch("/api/aulas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dia_aula: formData.dia_aula,
          hora_inicio: formData.hora_inicio,
          hora_fim: formData.hora_fim,
          modulo: Number.parseInt(formData.id_modulo),
          aviao_usado: formData.aviao_usado,
          aluno: formData.aluno,
          instrutor: formData.instrutor || null,
          nota: formData.nota != null && !isNaN(formData.nota) ? formData.nota : 0,
          freq_radio: 123.45,
        }),
      })

      if (response.ok) {
        alert("Aula cadastrada com sucesso!")
        setFormData({
          dia_aula: "",
          hora_inicio: "",
          hora_fim: "",
          id_modulo: "",
          aviao_usado: "",
          aluno: "",
          instrutor: "",
        })
      } else {
        alert("Erro ao cadastrar aula!")
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Erro ao cadastrar aula!")
    }
  }

  const alunos = usuarios.filter((usuario: any) => usuario.role === "Aluno")
  const instrutores = usuarios.filter((usuario: any) => usuario.role === "Instrutor")

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col gap-4 p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
        <h1 className="self-start mb-4 text-lg font-bold">Cadastrar Aula</h1>
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="dia_aula" className="block text-gray-600">
                Data da Aula
              </label>
              <input
                type="date"
                id="dia_aula"
                name="dia_aula"
                value={formData.dia_aula}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="hora_inicio" className="block text-gray-600">
                Hora Início
              </label>
              <input
                type="time"
                id="hora_inicio"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="hora_fim" className="block text-gray-600">
                Hora Fim
              </label>
              <input
                type="time"
                id="hora_fim"
                name="hora_fim"
                value={formData.hora_fim}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="id_modulo" className="block text-gray-600">
                Módulo
              </label>
              <select
                id="id_modulo"
                name="id_modulo"
                value={formData.id_modulo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecione um módulo</option>
                {modulos.map((modulo: any) => (
                  <option key={modulo.id_modulo} value={modulo.id_modulo}>
                    {modulo.tipo_modulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="aviao_usado" className="block text-gray-600">
                Avião
              </label>
              <select
                id="aviao_usado"
                name="aviao_usado"
                value={formData.aviao_usado}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecione um avião</option>
                {avioes.map((aviao: any) => (
                  <option key={aviao.matricula} value={aviao.matricula}>
                    {aviao.matricula}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="aluno" className="block text-gray-600">
                Aluno
              </label>
              <select
                id="aluno"
                name="aluno"
                value={formData.aluno}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno: any) => (
                  <option key={aluno.cpf} value={aluno.cpf}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="instrutor" className="block text-gray-600">
                Instrutor
              </label>
              <select
                id="instrutor"
                name="instrutor"
                value={formData.instrutor}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              >
                <option value="">Selecione um instrutor (opcional)</option>
                {instrutores.map((instrutor: any) => (
                  <option key={instrutor.cpf} value={instrutor.cpf}>
                    {instrutor.nome}
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

