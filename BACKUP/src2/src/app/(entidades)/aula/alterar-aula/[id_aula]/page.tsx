"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import BarraLatEsq from "../../../../ui/barralatesq"
import BarraLatDir from "../../../../ui/barralatdir"

export default function AlterarAula() {
  const { id_aula } = useParams() as { id_aula: string }
  const router = useRouter()

  const [formData, setFormData] = useState({
    dia_aula: "",
    hora_inicio: "",
    hora_fim: "",
    aviao_usado: "",
    aluno: "",
    instrutor: "",
    modulo: "",
    nota: "",
    freq_radio: "",
  })

  const [alunos, setAlunos] = useState([])
  const [instrutores, setInstrutores] = useState([])
  const [avioes, setAvioes] = useState([])

  useEffect(() => {
    if (id_aula) {
      const fetchAula = async () => {
        try {
          const response = await fetch(`/api/aulas/${id_aula}`)
          if (response.ok) {
            const aula = await response.json()
            setFormData({
              dia_aula: aula.dia_aula.split("T")[0], // Formato ISO para input date
              hora_inicio: aula.hora_inicio,
              hora_fim: aula.hora_fim,
              aviao_usado: aula.aviao_usado,
              aluno: aula.aluno,
              instrutor: aula.instrutor || "",
              modulo: aula.modulo.toString(),
              nota: aula.nota.toString(),
              freq_radio: aula.freq_radio.toString(),
            })
          } else {
            alert("Erro ao carregar dados da aula.")
          }
        } catch (error) {
          console.error("Erro ao buscar aula:", error)
          alert("Erro ao carregar dados da aula.")
        }
      }
      fetchAula()
    }
  }, [id_aula])

  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const usuariosResponse = await fetch(`/api/usuarios`)
        if (usuariosResponse.ok) {
          const usuariosData = await usuariosResponse.json()
          setAlunos(usuariosData.filter((usuario: any) => usuario.role === "Aluno"))
          setInstrutores(usuariosData.filter((usuario: any) => usuario.role === "Instrutor"))
        } else {
          alert("Erro ao carregar usuários.")
        }
      } catch (error) {
        console.error("Erro ao buscar pessoas:", error)
        alert("Erro ao carregar pessoas.")
      }
    }
    fetchPessoas()
  }, [])

  useEffect(() => {
    const fetchAvioes = async () => {
      try {
        const avioesResponse = await fetch(`/api/avioes`)
        if (avioesResponse.ok) {
          const avioesData = await avioesResponse.json()
          setAvioes(avioesData)
        } else {
          alert("Erro ao carregar aviões.")
        }
      } catch (error) {
        console.error("Erro ao buscar aviões:", error)
        alert("Erro ao carregar aviões.")
      }
    }
    fetchAvioes()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/aulas/${id_aula}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          modulo: Number.parseInt(formData.modulo),
          nota: Number.parseInt(formData.nota),
          freq_radio: Number.parseFloat(formData.freq_radio),
        }),
      })

      if (response.ok) {
        alert("Aula atualizada com sucesso!")
        router.push("/aula")
      } else {
        alert("Erro ao atualizar a aula!")
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Erro ao atualizar a aula!")
    }
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
        <h1 className="self-start mt-12 mb-4 text-lg font-bold">Alterar Aula</h1>
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
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hora_inicio" className="block text-gray-600">
              Hora de Início
            </label>
            <input
              type="time"
              id="hora_inicio"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hora_fim" className="block text-gray-600">
              Hora de Término
            </label>
            <input
              type="time"
              id="hora_fim"
              name="hora_fim"
              value={formData.hora_fim}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="aviao_usado" className="block text-gray-600">
              Avião Usado
            </label>
            <select
              id="aviao_usado"
              name="aviao_usado"
              value={formData.aviao_usado}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
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
              <option value="">Selecione um instrutor</option>
              {instrutores.map((instrutor: any) => (
                <option key={instrutor.cpf} value={instrutor.cpf}>
                  {instrutor.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="modulo" className="block text-gray-600">
              Módulo
            </label>
            <input
              type="text"
              id="modulo"
              name="modulo"
              value={formData.modulo}
              disabled
              className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nota" className="block text-gray-600">
              Nota
            </label>
            <input
              type="text"
              id="nota"
              name="nota"
              value={formData.nota}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="freq_radio" className="block text-gray-600">
              Frequência do Rádio
            </label>
            <input
              type="text"
              id="freq_radio"
              name="freq_radio"
              value={formData.freq_radio}
              onChange={handleInputChange}
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

