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
    modelo_anv: string
    disp_voo: boolean
}

interface Aula {
    id_aula: number
    modulo: number
    tipo_modulo: string
}

export default function MarcarVoo() {
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [avioes, setAvioes] = useState<Aviao[]>([])
    const [aulas, setAulas] = useState<Aula[]>([])
    const [selectedAluno, setSelectedAluno] = useState("")
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        aluno: "",
        aviao: "",
        aula: "",
        data: "",
        hora_inicio: "",
        hora_fim: "",
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alunosRes = await fetch("/api/usuarios/alunos")
                const avioesRes = await fetch("/api/avioes?disponivel=true")

                if (!alunosRes.ok || !avioesRes.ok) {
                    throw new Error("Erro ao carregar dados")
                }

                const [alunosData, avioesData] = await Promise.all([alunosRes.json(), avioesRes.json()])

                setAlunos(alunosData)
                setAvioes(avioesData)
            } catch (error) {
                console.error("Erro ao carregar dados:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        const fetchAulas = async () => {
            if (!selectedAluno) return

            try {
                const response = await fetch(`/api/aulas/disponiveis/${selectedAluno}`)
                if (response.ok) {
                    const data = await response.json()
                    setAulas(data)
                }
            } catch (error) {
                console.error("Erro ao carregar aulas:", error)
            }
        }

        fetchAulas()
    }, [selectedAluno])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/aulas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    aluno: formData.aluno,
                    aviao_usado: formData.aviao,
                    modulo: formData.aula,
                    dia_aula: formData.data,
                    hora_inicio: formData.hora_inicio,
                    hora_fim: formData.hora_fim,
                    instrutor: localStorage.getItem("userCpf"), // Add instructor's CPF
                }),
            })

            if (response.ok) {
                alert("Voo marcado com sucesso!")
                setFormData({
                    aluno: "",
                    aviao: "",
                    aula: "",
                    data: "",
                    hora_inicio: "",
                    hora_fim: "",
                })
                setSelectedAluno("")
            } else {
                const error = await response.json()
                alert(error.error || "Erro ao marcar voo")
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

        if (name === "aluno") {
            setSelectedAluno(value)
        }
    }

    if (loading) {
        return (
            <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
                <BarraLatEsq userRole="Instrutor" />
                <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200">
                    <div>Carregando...</div>
                </div>
                <BarraLatDir userRole="Instrutor" />
            </main>
        )
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Instrutor" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200">
                <h1 className="text-2xl font-bold mb-6">Marcar Voo</h1>

                <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700">Aula</label>
                        <select
                            name="aula"
                            value={formData.aula}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            disabled={!selectedAluno}
                        >
                            <option value="">Selecione uma aula</option>
                            {aulas.map((aula) => (
                                <option key={aula.id_aula} value={aula.id_aula}>
                                    Aula {aula.id_aula} - Módulo {aula.modulo} ({aula.tipo_modulo})
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
                            {avioes.map((aviao) => (
                                <option key={aviao.matricula} value={aviao.matricula}>
                                    {aviao.modelo_anv} - {aviao.matricula}
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
                        <label className="block text-sm font-medium text-gray-700">Hora Início</label>
                        <input
                            type="time"
                            name="hora_inicio"
                            value={formData.hora_inicio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hora Fim</label>
                        <input
                            type="time"
                            name="hora_fim"
                            value={formData.hora_fim}
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
                </form>
            </div>
            <BarraLatDir userRole="Instrutor" />
        </main>
    )
}


