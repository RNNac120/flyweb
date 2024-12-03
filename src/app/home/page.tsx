"use client";

import BarraLatEsq from "../ui/barralatesq";
import BarraLatDir from "../ui/barralatdir";
import Meio from "../ui/meio";

export default function Home() {
    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <Meio />
            <BarraLatDir />
        </main>
    );
}


// logar -- credenciais -- role
// de acordo com seu role, joga esse role pra variavel entidade
// e isso carrega a pagina de acordo com o role do usuario
