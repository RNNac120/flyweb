"use client"

import { useState } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"
import Link from "next/link"

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("usuarios")

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Admin" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

                <div className="w-full">
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab("usuarios")}
                            className={`px-4 py-2 rounded-lg ${activeTab === "usuarios" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Usuários
                        </button>
                        <button
                            onClick={() => setActiveTab("avioes")}
                            className={`px-4 py-2 rounded-lg ${activeTab === "avioes" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Aviões
                        </button>
                        <button
                            onClick={() => setActiveTab("cursos")}
                            className={`px-4 py-2 rounded-lg ${activeTab === "cursos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Cursos
                        </button>
                        <button
                            onClick={() => setActiveTab("modulos")}
                            className={`px-4 py-2 rounded-lg ${activeTab === "modulos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Módulos
                        </button>
                        <button
                            onClick={() => setActiveTab("aulas")}
                            className={`px-4 py-2 rounded-lg ${activeTab === "aulas" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Aulas
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        {activeTab === "usuarios" && (
                            <div>
                                <div className="flex justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
                                    <Link href="/usuarios/cadastrar-usuario">
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Novo Usuário</button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {activeTab === "avioes" && (
                            <div>
                                <div className="flex justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Gerenciar Aviões</h2>
                                    <Link href="/aviao/cadastrar-aviao">
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Novo Avião</button>
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <BarraLatDir userRole="Admin" />
        </main>
    )
}


