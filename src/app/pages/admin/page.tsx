"use client"

import { useState } from "react"
import Link from "next/link"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("usuarios")

    const sections = [
        {
            id: "usuarios",
            title: "Usuários",
            routes: {
                list: "/usuarios",
                create: "/usuarios/cadastrar-usuario",
                edit: "/usuarios/alterar-usuario",
            },
        },
        {
            id: "avioes",
            title: "Aviões",
            routes: {
                list: "/aviao",
                create: "/aviao/cadastrar-aviao",
                edit: "/aviao/alterar-aviao",
            },
        },
        {
            id: "cursos",
            title: "Cursos",
            routes: {
                list: "/curso",
                create: "/curso/cadastrar-curso",
                edit: "/curso/alterar-curso",
            },
        },
        {
            id: "modulos",
            title: "Módulos",
            routes: {
                list: "/modulo",
                create: "/modulo/cadastrar-modulo",
                edit: "/modulo/alterar-modulo",
            },
        },
        {
            id: "aulas",
            title: "Aulas",
            routes: {
                list: "/aula",
                create: "/aula/cadastrar-aula",
                edit: "/aula/alterar-aula",
            },
        },
        {
            id: "manutencoes",
            title: "Manutenções",
            routes: {
                list: "/manutencao",
                create: "/manutencao/cadastrar-manutencao",
                edit: "/manutencao/alterar-manutencao",
            },
        },
    ]

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Admin" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

                <div className="w-full">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`px-4 py-2 rounded-lg transition-colors ${activeSection === section.id ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        {sections.map(
                            (section) =>
                                activeSection === section.id && (
                                    <div key={section.id}>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-semibold">Gerenciar {section.title}</h2>
                                            <Link href={section.routes.create}>
                                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                                    Novo {section.title.slice(0, -1)}
                                                </button>
                                            </Link>
                                        </div>

                                        <div className="space-y-4">
                                            <Link href={section.routes.list}>
                                                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                    Lista de {section.title}
                                                </button>
                                            </Link>
                                            <Link href={section.routes.create}>
                                                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                    Cadastrar {section.title.slice(0, -1)}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ),
                        )}
                    </div>
                </div>
            </div>
            <BarraLatDir userRole="Admin" />
        </main>
    )
}


