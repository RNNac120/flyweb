"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Desempenho {
    totalVoos: number
    horasVoo: number
    notas: { modulo: string; nota: number }[]
}

export default function DesempenhoAluno() {
    const [desempenho, setDesempenho] = useState<Desempenho | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDesempenho = async () => {
            try {
                const response = await fetch("/api/aluno/desempenho")
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados de desempenho")
                }
                const data = await response.json()
                setDesempenho(data)
                setError(null)
            } catch (err) {
                console.error("Erro na requisição:", err)
                setError("Erro ao carregar dados de desempenho")
            } finally {
                setLoading(false)
            }
        }

        fetchDesempenho()
    }, [])

    if (loading) {
        return (
            <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
                <BarraLatEsq userRole="Aluno" />
                <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 justify-center">
                    <div className="text-xl">Carregando dados...</div>
                </div>
                <BarraLatDir userRole="Aluno" />
            </main>
        )
    }

    if (error || !desempenho) {
        return (
            <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
                <BarraLatEsq userRole="Aluno" />
                <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 justify-center">
                    <div className="text-xl text-red-600">{error || "Erro ao carregar dados de desempenho"}</div>
                </div>
                <BarraLatDir userRole="Aluno" />
            </main>
        )
    }

    const chartData = {
        labels: desempenho.notas.map((nota) => nota.modulo),
        datasets: [
            {
                label: "Notas por Módulo",
                data: desempenho.notas.map((nota) => nota.nota),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    }

    const chartOptions: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Desempenho por Módulo",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
            },
        },
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Aluno" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Meu Desempenho</h1>
                <div className="w-full grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Total de Voos</h2>
                        <p className="text-3xl font-bold">{desempenho.totalVoos}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Horas de Voo</h2>
                        <p className="text-3xl font-bold">{desempenho.horasVoo}</p>
                    </div>
                </div>
                <div className="w-full bg-white p-4 rounded-lg shadow">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
            <BarraLatDir userRole="Aluno" />
        </main>
    )
}


