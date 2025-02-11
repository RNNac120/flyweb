/*
  Warnings:

  - The primary key for the `Pessoa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `salario` on the `Pessoa` table. The data in that column could be lost. The data in that column will be cast from `Decimal(7,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Pessoa" DROP CONSTRAINT "Pessoa_pkey",
ALTER COLUMN "cpf" SET DATA TYPE TEXT,
ALTER COLUMN "salario" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("cpf");

-- CreateTable
CREATE TABLE "Curso" (
    "id_curso" SERIAL NOT NULL,
    "nome_curso" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id_modulo" SERIAL NOT NULL,
    "tipo_modulo" TEXT NOT NULL,
    "id_curso" INTEGER NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id_modulo")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id_aula" SERIAL NOT NULL,
    "dia_aula" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fim" TIMESTAMP(3) NOT NULL,
    "aviao_usado" TEXT NOT NULL,
    "aluno" TEXT NOT NULL,
    "instrutor" TEXT,
    "modulo" INTEGER NOT NULL,
    "nota" INTEGER,
    "freq_radio" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'indisponivel',

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id_aula")
);

-- CreateTable
CREATE TABLE "Competencia" (
    "id_comp" SERIAL NOT NULL,
    "tipo_comp" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentarios" TEXT,
    "aula" INTEGER NOT NULL,

    CONSTRAINT "Competencia_pkey" PRIMARY KEY ("id_comp")
);

-- CreateTable
CREATE TABLE "Manutencao" (
    "id_mnt" SERIAL NOT NULL,
    "inicio_mnt" TIMESTAMP(3) NOT NULL,
    "fim_mnt" TIMESTAMP(3),
    "descricao" TEXT NOT NULL,
    "aviao" TEXT NOT NULL,
    "mecanico" TEXT NOT NULL,

    CONSTRAINT "Manutencao_pkey" PRIMARY KEY ("id_mnt")
);

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_aviao_usado_fkey" FOREIGN KEY ("aviao_usado") REFERENCES "Aviao"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_aluno_fkey" FOREIGN KEY ("aluno") REFERENCES "Pessoa"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_instrutor_fkey" FOREIGN KEY ("instrutor") REFERENCES "Pessoa"("cpf") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_modulo_fkey" FOREIGN KEY ("modulo") REFERENCES "Modulo"("id_modulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competencia" ADD CONSTRAINT "Competencia_aula_fkey" FOREIGN KEY ("aula") REFERENCES "Aula"("id_aula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_aviao_fkey" FOREIGN KEY ("aviao") REFERENCES "Aviao"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_mecanico_fkey" FOREIGN KEY ("mecanico") REFERENCES "Pessoa"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
