-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "sq_candidato" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "nome_urna" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "titulo_eleitor" TEXT NOT NULL,
    "email_tse" TEXT,
    "partido" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "situacao_candidatura" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ano_ultima_eleicao" INTEGER NOT NULL DEFAULT 2024,
    "patrimonio_total" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateAsset" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "tipo_bem" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CandidateAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSocial" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "tipo_rede" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CandidateSocial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MyCandidate" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "telefone" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "origem_indicacao" TEXT,
    "rede_social" TEXT,
    "tipo_origem" TEXT NOT NULL DEFAULT 'MANUAL',
    "tse_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "partido" TEXT,

    CONSTRAINT "MyCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROSPECT',
    "vendedor_responsavel" TEXT,
    "valor_contrato" DOUBLE PRECISION,
    "data_proxima_acao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "my_candidate_id" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "anotacao" TEXT NOT NULL,
    "tipo_contato" TEXT NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_titulo_eleitor_key" ON "Candidate"("titulo_eleitor");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_my_candidate_id_key" ON "Lead"("my_candidate_id");

-- AddForeignKey
ALTER TABLE "CandidateAsset" ADD CONSTRAINT "CandidateAsset_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSocial" ADD CONSTRAINT "CandidateSocial_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_my_candidate_id_fkey" FOREIGN KEY ("my_candidate_id") REFERENCES "MyCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
