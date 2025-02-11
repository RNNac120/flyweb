import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const manuais = await prisma.manual.findMany({
                where: {
                    OR: [{ tipo_manual: "GERAL" }, { tipo_manual: "MECANICO" }],
                },
                select: {
                    id: true,
                    titulo: true,
                    categoria: true,
                    arquivo: true,
                },
            })

            res.status(200).json(manuais)
        } catch (error) {
            console.error("Erro ao buscar manuais:", error)
            res.status(500).json({ error: "Erro ao buscar manuais" })
        }
    } else {
        res.setHeader("Allow", ["GET"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}


