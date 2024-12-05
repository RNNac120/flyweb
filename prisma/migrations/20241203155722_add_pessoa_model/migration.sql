-- CreateTable
CREATE TABLE "Pessoa" (
    "cpf" CHAR(11) NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nasc" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL,
    "carteira_anac" TEXT,
    "carteira_mec" TEXT,
    "salario" DECIMAL(7,2),
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("cpf")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");
