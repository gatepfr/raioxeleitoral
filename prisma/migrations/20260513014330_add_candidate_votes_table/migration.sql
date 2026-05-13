-- CreateTable
CREATE TABLE "CandidateVote" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "votos" INTEGER NOT NULL,

    CONSTRAINT "CandidateVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateVote_candidate_id_idx" ON "CandidateVote"("candidate_id");

-- AddForeignKey
ALTER TABLE "CandidateVote" ADD CONSTRAINT "CandidateVote_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
