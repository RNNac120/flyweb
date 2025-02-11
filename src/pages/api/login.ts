import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" })
    }

    const { cpf, senha } = req.body

    if (!cpf || !senha) {
        return res.status(400).json({ error: "CPF e senha são obrigatórios." })
    }

    try {
        const usuario = await prisma.pessoa.findUnique({
            where: { cpf },
        })

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida) {
            return res.status(401).json({ error: "Senha inválida." })
        }

        res.status(200).json({
            message: "Login bem-sucedido",
            usuario: {
                cpf: usuario.cpf,
                nome: usuario.nome,
                role: usuario.role,
            },
        })
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error)
        res.status(500).json({ error: "Erro ao autenticar usuário." })
    }
}


