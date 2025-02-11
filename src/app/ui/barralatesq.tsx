"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"

const menuItems = {
    aluno: [
        { label: "Página Inicial", href: "/home" },
        { label: "Voos", href: "/pages/aluno/voos" },
        { label: "Desempenho", href: "/pages/aluno/desempenho" },
    ],
    instrutor: [
        { label: "Página Inicial", href: "/home" },
        { label: "Voos Anteriores", href: "/pages/instrutor/voos-anteriores" },
        { label: "Marcar Voo", href: "/pages/instrutor/marcar-voo" },
        { label: "Dar Nota de Voo", href: "/pages/instrutor/dar-nota" },
    ],
    mecanico: [
        { label: "Página Inicial", href: "/home" },
        { label: "Aviões", href: "/pages/mecanico/avioes" },
        { label: "Marcar Manutenção", href: "/pages/mecanico/marcar-manutencao" },
    ],
    admin: [
        { label: "Usuários", href: "/usuarios" },
        { label: "Aviões", href: "/aviao" },
        { label: "Cursos", href: "/curso" },
        { label: "Módulos", href: "/modulo" },
        { label: "Aulas", href: "/aula" },
        { label: "Manutenções", href: "/manutencao" },
        { label: "Competências", href: "/competencia" },
    ],
}

export default function BarraLatEsq({ userRole }: { userRole: string }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)
    const [currentRole, setCurrentRole] = useState(userRole)

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole")
        if (storedRole) {
            setCurrentRole(storedRole.toLowerCase())
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("userRole")
        localStorage.removeItem("userCpf")
        window.location.href = "/"
    }

    return (
        <div className={"bg-sky-950 text-white h-full w-64 flex flex-col justify-between"}>
            <div>
                <div className="p-4 flex items-center justify-between">
                    <h2 className={`font-bold text-xl ${isOpen ? "block" : "hidden"}`}>FlyWeb</h2>
                </div>
                <nav className="mt-6">
                    <ul>
                        {menuItems[currentRole as keyof typeof menuItems]?.map((item, index) => (
                            <li key={index} className="mb-2">
                                <Link
                                    href={item.href}
                                    className={`flex items-center p-2 hover:bg-sky-800 ${pathname === item.href ? "bg-sky-800" : ""}`}
                                >
                                    <span className={isOpen ? "block" : "hidden"}>{item.label}</span>
                                    {!isOpen && <span className="block w-full text-center">{item.label[0]}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className={`flex items-center justify-center w-full p-2 bg-red-600 hover:bg-red-700 rounded ${isOpen ? "px-4" : "px-2"
                        }`}
                >
                    <LogOut size={20} />
                    {isOpen && <span className="ml-2">Logout</span>}
                </button>
            </div>
        </div>
    )
}
