"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"
import ModuloAulas from "@/app/ui/row_modulos"

export default function InstrutorPage() {
    const [cursos, setCursos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const userRole = "instrutor" // This should be set based on actual user authentication

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await fetch("/api/cursos")
                const data = await response.json()
                setCursos(data)
                setLoading(false)
            } catch (error) {
                console.error("Erro na requisição:", error)
                setError(true)
                setLoading(false)
            }
        }

        fetchCursos()
    }, [])

    if (loading) {
        return <div className="text-center mt-20 text-xl text-gray-700">Carregando cursos...</div>
    }

    if (error || cursos.length === 0) {
        return <div className="text-center mt-20 text-xl text-red-600">Erro ao carregar os cursos.</div>
    }

    return (
        <div className="flex h-screen bg-sky-700">
            <BarraLatEsq userRole={userRole} />
            <div className="flex-1 p-8 bg-sky-200 overflow-y-auto">
                {cursos.map((curso) => (
                    <div key={curso.id_curso} className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">{curso.nome_curso}</h1>
                        <div className="space-y-6">
                            {curso.modulos?.map((modulo: any) => (
                                <div key={modulo.id_modulo} className="bg-white p-4 rounded-lg shadow">
                                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                        Módulo {modulo.id_modulo}: {modulo.tipo_modulo}
                                    </h2>
                                    <ModuloAulas modulo={modulo} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <BarraLatDir userRole={userRole} />
        </div>
    )
}


