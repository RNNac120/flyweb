-- CreateTable
CREATE TABLE "Aviao" (
    "matricula" CHAR(5) NOT NULL,
    "horas_voadas" INTEGER NOT NULL,
    "data_prox_mnt" DATE NOT NULL,
    "fabricante" VARCHAR NOT NULL,
    "modelo_anv" VARCHAR NOT NULL,
    "disp_voo" BOOLEAN NOT NULL,
    "num_hangar" INTEGER NOT NULL,

    CONSTRAINT "Aviao_pkey" PRIMARY KEY ("matricula")
);
