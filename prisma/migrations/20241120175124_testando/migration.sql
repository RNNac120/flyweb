/*
  Warnings:

  - The primary key for the `Aviao` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Aviao" DROP CONSTRAINT "Aviao_pkey",
ALTER COLUMN "matricula" SET DATA TYPE TEXT,
ALTER COLUMN "data_prox_mnt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "fabricante" SET DATA TYPE TEXT,
ALTER COLUMN "modelo_anv" SET DATA TYPE TEXT,
ADD CONSTRAINT "Aviao_pkey" PRIMARY KEY ("matricula");
