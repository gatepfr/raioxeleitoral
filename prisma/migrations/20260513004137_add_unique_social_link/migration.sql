/*
  Warnings:

  - A unique constraint covering the columns `[candidate_id,url]` on the table `CandidateSocial` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CandidateSocial_candidate_id_url_key" ON "CandidateSocial"("candidate_id", "url");
