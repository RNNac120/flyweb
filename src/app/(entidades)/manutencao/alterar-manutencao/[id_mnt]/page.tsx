"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BarraLatEsq from "../../../../ui/barralatesq";
import BarraLatDir from "../../../../ui/barralatdir";

export default function AlterarManutencao() {
    const { id_mnt } = useParams() as { id_mnt: string };
    const router = useRouter();

    const [formData, setFormData] = useState({
        descricao: "",
        inicio_mnt: "",
        fim_mnt: "",
        aviao: "",
        mecanico: "",
    });

    const [mecanicos, setMecanicos] = useState([]);

    useEffect(() => {
        const fetchPessoas = async () => {
            try {
                const usuariosResponse = await fetch(`/api/usuarios`);
                if (usuariosResponse.ok) {
                    const usuariosData = await usuariosResponse.json();
                    setMecanicos(usuariosData.filter((usuario: any) => usuario.role === "Mecânico"));
                } else {
                    alert("Erro ao carregar usuários.");
                }
            } catch (error) {
                console.error("Erro ao buscar pessoas:", error);
                alert("Erro ao carregar pessoas.");
            }
        };
        fetchPessoas();
    }, []);


    useEffect(() => {
        if (id_mnt) {
            const fetchManutencoes = async () => {
                try {
                    const response = await fetch(`/api/manutencoes/${id_mnt}`);
                    if (response.ok) {
                        const manutencao = await response.json();
                        setFormData({
                            descricao: manutencao.descricao,
                            inicio_mnt: manutencao.inicio_mnt.split("T")[0],
                            fim_mnt: manutencao.fim_mnt ? manutencao.split("T")[0] : "",
                            aviao: manutencao.aviao,
                            mecanico: manutencao.mecanico,
                        });
                    } else {
                        alert("Erro ao carregar dados da manutenção.");
                    }
                } catch (error) {
                    console.error("Erro ao buscar manutencao:", error);
                    alert("Erro ao carregar dados da manutencao.");
                }
            };
            fetchManutencoes();
        }
    }, [id_mnt]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/manutencoes/${id_mnt}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    inicio_mnt: new Date(formData.inicio_mnt),
                    fim_mnt: new Date(formData.fim_mnt) || "",
                    descricao: formData.descricao,
                    mecanico: formData.mecanico,
                }),
            });

            if (response.ok) {
                alert("Manutenção atualizada com sucesso!");
                router.push("/manutencao");
            } else {
                alert("Erro ao atualizar a manutenção!");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao atualizar a manutenção!");
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
                <h1 className="self-start mt-12 mb-4 text-lg font-bold">Alterar Manutenção</h1>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="descricao" className="block text-gray-600">Descrição do Problema</label>
                        <input
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="inicio_mnt" className="block text-gray-600">Início da Manutenção</label>
                        <input
                            type="date"
                            id="inicio_mnt"
                            name="inicio_mnt"
                            value={formData.inicio_mnt}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="fim_mnt" className="block text-gray-600">Fim da Manutenção</label>
                        <input
                            type="date"
                            id="fim_mnt"
                            name="fim_mnt"
                            value={formData.fim_mnt}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="mecanico" className="block text-gray-600">Mecânico Responsável</label>
                        <select
                            id="mecanico"
                            name="mecanico"
                            value={formData.mecanico}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Selecione um mecânico</option>
                            {mecanicos.map((mecanico: any) => (
                                <option key={mecanico.cpf} value={mecanico.cpf}>
                                    {mecanico.nome}
                                </option>
                            ))}
                        </select>
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

