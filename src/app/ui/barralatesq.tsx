"use client";

import Image from "next/image";
import Link from "next/link";

export default function BarraLatEsq() {
    return (
        <div key="ble" className="h-full w-1/6 flex flex-col gap-2">
            <div key="user" className="bg-sky-950 p-4 flex gap-8 rounded-lg items-center">
                <Image
                    src="/celso_piloto.png"
                    alt="Foto do aluno"
                    width={64}
                    height={64}
                    className="rounded-full"
                />
                <div key="greeting" className="">
                    <p>Olá, Celso!</p>
                </div>
            </div>
            <div key="menus" className="h-full bg-sky-950 p-4 flex flex-col justify-between rounded-lg">
                <div className="flex flex-col gap-4 text-2xl">
                    <a href="/home">Home</a>
                    <a href="/aviao">Avião</a>
                    <a href="/usuarios">Usuário</a>
                </div>
                <Link href="/">
                    <div key="logout" className="flex items-end self-center">
                        <button className="rounded-full bg-red-600 px-6 py-2">
                            SAIR X
                        </button>
                    </div>
                </Link>
            </div>
        </div>
    );
}

