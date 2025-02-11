"use client"

import Image from "next/image"
import Link from "next/link"

// Helper function to normalize strings for comparison
const normalizeString = (str = "") => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .trim()
}

export default function BarraLatEsq({ userRole }) {
  console.log("Received userRole:", userRole) // Debug log

  const menuItems = {
    aluno: [
      { label: "Página Inicial", href: "/home" },
      { label: "Voos", href: "/voos" },
      { label: "Desempenho", href: "/desempenho" },
      { label: "Manuais", href: "/manuais" },
    ],
    instrutor: [
      { label: "Página Inicial", href: "/home" },
      { label: "Voos Anteriores", href: "/voos-anteriores" },
      { label: "Marcar Voo", href: "/marcar-voo" },
      { label: "Manuais", href: "/manuais" },
      { label: "Dar Nota de Voo", href: "/dar-nota" },
    ],
    mecanico: [
      { label: "Página Inicial", href: "/home" },
      { label: "Aviões", href: "/avioes" },
      { label: "Marcar Manutenção", href: "/marcar-manutencao" },
      { label: "Manuais", href: "/manuais" },
    ],
  }

  // Normalize the received role
  const normalizedRole = normalizeString(userRole)
  console.log("Normalized role:", normalizedRole) // Debug log

  // Get menu items for the normalized role
  const currentMenuItems = menuItems[normalizedRole]
  console.log("Menu items found:", currentMenuItems) // Debug log

  return (
    <div key="ble" className="h-full w-1/6 flex flex-col gap-2">
      <div key="user" className="bg-sky-950 p-4 flex gap-8 rounded-lg items-center">
        <Image src="/celso_piloto.png" alt="Foto do usuário" width={64} height={64} className="rounded-full" />
        <div key="greeting" className="text-white">
          <p>Bem vindo!</p>
          <p className="text-sm">{userRole}</p>
        </div>
      </div>
      <div key="menus" className="h-full bg-sky-950 p-4 flex flex-col justify-between rounded-lg">
        <div className="flex flex-col gap-4 text-2xl">
          {currentMenuItems?.map((item, index) => (
            <Link key={index} href={item.href} className="text-white hover:text-gray-300">
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/">
          <div key="logout" className="flex items-end self-center">
            <button className="rounded-full bg-red-600 px-6 py-2 text-white">SAIR X</button>
          </div>
        </Link>
      </div>
    </div>
  )
}

