import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const alunos = await prisma.pessoa.findMany({
        where: {
          role: "Aluno",
        },
      })
      res.status(200).json(alunos)
    } catch (error) {
      console.error("Erro ao buscar alunos:", error)
      res.status(500).json({ error: "Erro ao buscar alunos" })
    }
  }
}

