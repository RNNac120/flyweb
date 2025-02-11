"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

interface Aula {
    id_aula: number
    status: "disponivel" | "indisponivel" | "feita"
}

interface Modulo {
    id_modulo: number
    tipo_modulo: string
    aulas: Aula[]
}

interface Curso {
    id_curso: number
    nome_curso: string
    modulos: Modulo[]
}

const statusColors = {
    disponivel: "bg-green-500",
    indisponivel: "bg-gray-500",
    feita: "bg-blue-500",
}

export default function VoosAluno() {
    const [cursos, setCursos] = useState<Curso[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await fetch("/api/cursos/aluno")
                if (response.ok) {
                    const data = await response.json()
                    setCursos(data)
                } else {
                    console.error("Erro ao buscar cursos")
                }
            } catch (error) {
                console.error("Erro na requisição:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCursos()
    }, [])

    if (loading) {
        return <div>Carregando...</div>
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Aluno" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Meus Voos</h1>
                {cursos.map((curso) => (
                    <div key={curso.id_curso} className="w-full mb-8">
                        <h2 className="text-xl font-semibold mb-4">{curso.nome_curso}</h2>
                        {curso.modulos.map((modulo) => (
                            <div key={modulo.id_modulo} className="mb-6">
                                <h3 className="text-lg font-medium mb-2">{modulo.tipo_modulo}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {modulo.aulas.map((aula) => (
                                        <div
                                            key={aula.id_aula}
                                            className={`w-12 h-12 ${statusColors[aula.status]} rounded-lg flex items-center justify-center text-white font-bold`}
                                        >
                                            {aula.id_aula}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <BarraLatDir userRole="Aluno" />
        </main>
    )
}


