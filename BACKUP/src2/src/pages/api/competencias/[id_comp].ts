import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id_comp = Number(req.query.id_comp)

  if (req.method === "DELETE") {
    try {
      const competencia = await prisma.competencia.findUnique({
        where: { id_comp },
      })

      if (!competencia) {
        return res.status(404).json({ error: "Competência não encontrada." })
      }

      await prisma.competencia.delete({
        where: { id_comp },
      })

      res.status(200).json({ message: "Competência excluída com sucesso." })
    } catch (error) {
      console.error("Erro ao excluir competência:", error)
      res.status(500).json({ error: "Erro ao excluir competência no banco de dados." })
    }
  } else if (req.method === "GET") {
    try {
      const competencia = await prisma.competencia.findUnique({
        where: { id_comp },
      })
      if (!competencia) {
        return res.status(404).json({ error: "Competência não encontrada." })
      }
      res.status(200).json(competencia)
    } catch (error) {
      console.error("Erro ao buscar competência:", error)
      res.status(500).json({ error: "Erro ao buscar competência no banco de dados." })
    }
  } else if (req.method === "PUT") {
    try {
      const { nota, comentarios } = req.body

      if (!id_comp) {
        return res.status(400).json({ error: "ID da competencia é obrigatório para atualização." })
      }

      const competenciaExistente = await prisma.competencia.findUnique({
        where: { id_comp },
      })

      if (!competenciaExistente) {
        return res.status(404).json({ error: "Competência não encontrada." })
      }

      const competenciaAtualizada = await prisma.competencia.update({
        where: { id_comp },
        data: {
          nota: nota !== undefined ? Number.parseInt(nota, 10) : competenciaExistente.nota,
          comentarios: comentarios !== undefined ? comentarios : competenciaExistente.comentarios,
        },
      })

      res.status(200).json(competenciaAtualizada)
    } catch (error) {
      console.error("Erro ao atualizar competência:", error)
      res.status(500).json({ error: "Erro ao atualizar competência no banco de dados." })
    }
  } else {
    res.status(405).json({ error: "Método não permitido." })
  }
}

