import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const avioes = await prisma.aviao.findMany()

            const avioesFormatados = avioes.map((aviao) => ({
                matricula: aviao.matricula,
                modelo: aviao.modelo_anv,
                horasVoadas: aviao.horas_voadas,
                proximaManutencao: aviao.data_prox_mnt.toISOString().split("T")[0],
                disponivel: aviao.disp_voo,
            }))

            res.status(200).json(avioesFormatados)
        } catch (error) {
            console.error("Erro ao buscar aviões:", error)
            res.status(500).json({ error: "Erro ao buscar aviões" })
        }
    }
}
