-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "ue_id" TEXT,
ALTER COLUMN "cpf" DROP NOT NULL;
