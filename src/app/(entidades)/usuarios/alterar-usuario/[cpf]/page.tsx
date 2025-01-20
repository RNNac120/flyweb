"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BarraLatEsq from "../../../../ui/barralatesq";
import BarraLatDir from "../../../../ui/barralatdir";

export default function AlterarUsuario() {
    const { cpf } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        nome: "",
        data_nasc: "",
        cpf: "",
        role: "",
        carteira_anac: "",
        carteira_mec: "",
        salario: "",
        email: "",
        senha: "",
    });

    useEffect(() => {
        if (cpf) {
            const fetchUsuario = async () => {
                const response = await fetch(`/api/usuarios/${cpf}`);
                if (response.ok) {
                    const usuario = await response.json();
                    setFormData(usuario);
                } else {
                    alert("Erro ao carregar dados do usuário.");
                }
            };
            fetchUsuario();
        }
    }, [cpf]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/usuarios/${formData.cpf}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Usuário atualizado com sucesso!");
                router.push("/usuarios");
            } else {
                alert("Erro ao atualizar o usuário!");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao atualizar o usuário!");
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
                <h1 className="self-start mt-12 mb-4 text-lg font-bold">Alterar Usuário</h1>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="nome" className="block text-gray-600">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="data_nasc" className="block text-gray-600">Data de Nascimento</label>
                        <input
                            type="date"
                            id="data_nasc"
                            name="data_nasc"
                            value={formData.data_nasc || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="cpf" className="block text-gray-600">CPF</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleInputChange}
                            disabled
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="role" className="block text-gray-600">Cargo no Aeroclube</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="carteira_anac" className="block text-gray-600">Carteira ANAC</label>
                        <input
                            type="text"
                            id="carteira_anac"
                            name="carteira_anac"
                            value={formData.carteira_anac || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="carteira_mec" className="block text-gray-600">Carteira de Mecânico</label>
                        <input
                            type="text"
                            id="carteira_mec"
                            name="carteira_mec"
                            value={formData.carteira_mec || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="salario" className="block text-gray-600">Salário</label>
                        <input
                            type="number"
                            id="salario"
                            name="salario"
                            value={formData.salario || ""}
                            onChange={handleInputChange}
                            placeholder="R$"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">E-mail</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="senha" className="block text-gray-600">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Atualizar
                    </button>
                </form>
            </div>
            <BarraLatDir />
        </main>
    );
}

