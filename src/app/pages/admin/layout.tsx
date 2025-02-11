import type { ReactNode } from "react"
import Link from "next/link"

const adminMenuItems = [
    {
        title: "Usuários",
        path: "/usuarios",
    },
    {
        title: "Aviões",
        path: "/aviao",
    },
    {
        title: "Cursos",
        path: "/curso",
    },
    {
        title: "Módulos",
        path: "/modulo",
    },
    {
        title: "Aulas",
        path: "/aula",
    },
    {
        title: "Manutenções",
        path: "/manutencao",
    },
    {
        title: "Competências",
        path: "/competencia",
    },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-sky-950 text-white p-6">
                <h1 className="text-2xl font-bold mb-8">Admin</h1>
                <nav className="space-y-4">
                    {adminMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={`/pages/admin${item.path}`}
                            className="block py-2 px-4 hover:bg-sky-900 rounded-lg transition-colors"
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 overflow-auto bg-sky-700 p-8">{children}</main>
        </div>
    )
}


