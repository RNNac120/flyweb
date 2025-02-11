"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

interface Aviao {
    matricula: string
    modelo: string
    horasVoadas: number
    proximaManutencao: string
    disponivel: boolean
}

export default function ListaAvioes() {
    const [avioes, setAvioes] = useState<Aviao[]>([])
    const [loading, setLoading] = useState(true)

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

    if (loading) {
        return <div>Carregando...</div>
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Mecanico" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Lista de Aviões</h1>
                <div className="w-full">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left">Matrícula</th>
                                <th className="py-2 px-4 text-left">Modelo</th>
                                <th className="py-2 px-4 text-left">Horas Voadas</th>
                                <th className="py-2 px-4 text-left">Próxima Manutenção</th>
                                <th className="py-2 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avioes.map((aviao) => (
                                <tr key={aviao.matricula} className="border-t">
                                    <td className="py-2 px-4">{aviao.matricula}</td>
                                    <td className="py-2 px-4">{aviao.modelo}</td>
                                    <td className="py-2 px-4">{aviao.horasVoadas}</td>
                                    <td className="py-2 px-4">{new Date(aviao.proximaManutencao).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${aviao.disponivel ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {aviao.disponivel ? "Disponível" : "Indisponível"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <BarraLatDir userRole="Mecanico" />
        </main>
    )
}


