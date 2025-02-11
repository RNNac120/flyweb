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

    useEffect(() => {
        const fetchDesempenho = async () => {
            try {
                const userCpf = localStorage.getItem("userCpf")
                const response = await fetch(`/api/aluno/desempenho/${userCpf}`)
                if (!response.ok) throw new Error("Erro ao carregar desempenho")
                const data = await response.json()
                setDesempenho(data)
            } catch (error) {
                console.error("Erro ao carregar desempenho:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDesempenho()
    }, [])

    if (loading) return <div>Carregando...</div>

    if (!desempenho) return <div>Erro ao carregar dados de desempenho</div>

    const chartData = {
        labels: desempenho.notas.map((nota) => nota.modulo),
        datasets: [
            {
                label: "Notas por Módulo",
                data: desempenho.notas.map((nota) => nota.nota),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    }

    const options: ChartOptions<"bar"> = {
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
            <BarraLatEsq userRole="aluno" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Meu Desempenho</h1>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Total de Voos</h2>
                        <p className="text-3xl font-bold text-blue-600">{desempenho.totalVoos}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Horas de Voo</h2>
                        <p className="text-3xl font-bold text-blue-600">{desempenho.horasVoo.toFixed(1)}h</p>
                    </div>
                </div>

                <div className="w-full bg-white p-6 rounded-lg shadow-md">
                    <Bar options={options} data={chartData} />
                </div>
            </div>
            <BarraLatDir userRole="aluno" />
        </main>
    )
}


