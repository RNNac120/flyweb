import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id_modulo } = req.query;

    if (req.method === "DELETE") {
        try {
            // Verificar se o módulo existe
            const modulo = await prisma.modulo.findUnique({
                where: { id_modulo: parseInt(id_modulo as string) },
            });

            if (!modulo) {
                return res.status(404).json({ error: "Módulo não encontrado." });
            }

            // Excluir competências, aulas e depois o módulo
            await prisma.competencia.deleteMany({
                where: {
                    aula: {
                        in: (await prisma.aula.findMany({
                            where: { modulo: modulo.id_modulo },
                            select: { id_aula: true },
                        })).map((a) => a.id_aula)
                    }
                }
            });

            await prisma.aula.deleteMany({
                where: { modulo: modulo.id_modulo },
            });

            await prisma.modulo.delete({
                where: { id_modulo: modulo.id_modulo },
            });

            res.status(200).json({ message: "Módulo excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir módulo:", error);
            res.status(500).json({ error: "Erro ao excluir módulo." });
        }
    } else {
        res.status(405).json({ error: "Método não permitido." });
    }
}

