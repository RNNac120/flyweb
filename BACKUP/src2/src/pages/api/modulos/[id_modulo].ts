import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id_modulo = Number(req.query.id_modulo)

  if (req.method === "DELETE") {
    try {
      const modulo = await prisma.modulo.findUnique({
        where: { id_modulo },
      })

      if (!modulo) {
        return res.status(404).json({ error: "Módulo não encontrado." })
      }

      await prisma.aula.deleteMany({
        where: { modulo: modulo.id_modulo },
      })

      await prisma.modulo.delete({
        where: { id_modulo: modulo.id_modulo },
      })

      res.status(200).json({ message: "Módulo excluído com sucesso." })
    } catch (error) {
      console.error("Erro ao excluir módulo:", error)
      res.status(500).json({ error: "Erro ao excluir módulo." })
    }
  } else if (req.method === "GET") {
    console.log(id_modulo)
    try {
      const modulo = await prisma.modulo.findUnique({
        where: { id_modulo },
      })

      if (!modulo) {
        return res.status(404).json({ error: "Módulo não encontrado." })
      }

      res.status(200).json(modulo)
    } catch (error) {
      console.error("Erro ao buscar módulo:", error)
      res.status(500).json({ error: "Erro ao buscar módulo." })
    }
  } else if (req.method === "PUT") {
    try {
      const { tipo_modulo } = req.body

      if (!id_modulo) {
        return res.status(400).json({ error: "ID do módulo é obrigatório para atualização." })
      }

      const moduloExistente = await prisma.modulo.findUnique({
        where: { id_modulo },
      })

      if (!moduloExistente) {
        return res.status(404).json({ error: "Módulo não encontrado." })
      }

      const moduloAtualizado = await prisma.modulo.update({
        where: { id_modulo },
        data: {
          tipo_modulo: tipo_modulo || moduloExistente.tipo_modulo,
        },
      })

      res.status(200).json(moduloAtualizado)
    } catch (error) {
      console.error("Erro ao atualizar módulo:", error)
      res.status(500).json({ error: "Erro ao atualizar módulo." })
    }
  } else {
    res.status(405).json({ error: "Método não permitido." })
  }
}

