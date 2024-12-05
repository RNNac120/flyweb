
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { cpf } = req.query; // Pegando a matrícula da URL

    if (typeof cpf !== "string") {
        return res.status(400).json({ error: "CPF inválido." });
    }

    if (req.method === "DELETE") {
        try {
            const usuarioExistente = await prisma.pessoa.findUnique({
                where: { cpf },
            });

            if (!usuarioExistente) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            // Excluindo o usuário do banco de dados
            await prisma.pessoa.delete({
                where: { cpf },
            });

            console.log("Usuário excluído:", cpf);
            res.status(200).json({ message: "Usuário excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir o usuário:", error);
            res.status(500).json({ error: "Erro ao excluir o usuário no banco de dados." });
        }
    } else if (req.method === "GET") {
        try {
            const usuario = await prisma.pessoa.findUnique({
                where: { cpf: String(cpf) },
            });
            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuário." });
        }
    } else if (req.method === "PUT") {
        try {
            const { nome, data_nasc, cpf, role, carteira_anac, carteira_mec, salario, email, senha } = req.body;

            if (!cpf) {
                return res.status(400).json({ error: "CPF é obrigatório para atualização." });
            }

            const usuarioExistente = await prisma.pessoa.findUnique({
                where: { cpf: String(cpf) },
            });

            if (!usuarioExistente) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            const usuarioAtualizado = await prisma.pessoa.update({
                where: { cpf: String(cpf) },
                data: {
                    nome: nome || usuarioExistente.nome,
                    data_nasc: data_nasc ? new Date(data_nasc) : usuarioExistente.data_nasc,
                    role: role || usuarioExistente.role,
                    carteira_anac: carteira_anac || usuarioExistente.carteira_anac,
                    carteira_mec: carteira_mec || usuarioExistente.carteira_mec,
                    salario: salario !== undefined ? parseFloat(salario) : usuarioExistente.salario,
                    email: email || usuarioExistente.email,
                    senha: senha || usuarioExistente.senha,
                },
            });


            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o usuário." });
        }
    } else {
        res.status(405).json({ error: "Método não permitido." });
    }
}

