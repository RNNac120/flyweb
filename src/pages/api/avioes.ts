import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const avioes = await prisma.aviao.findMany({
                select: {
                    matricula: true,
                    modelo_anv: true,
                    disp_voo: true,
                },
            })

            if (req.query.disponivel !== undefined) {
                const disponivel = req.query.disponivel === "true"
                return res.status(200).json(avioes.filter((aviao) => aviao.disp_voo === disponivel))
            }

            res.status(200).json(avioes)
        } catch (error) {
            console.error("Erro ao buscar aviões:", error)
            res.status(500).json({ error: "Erro ao buscar aviões" })
        }
    }
}


