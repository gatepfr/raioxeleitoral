-- Remove duplicate CandidateAsset rows, keeping one per (candidate_id, tipo_bem, descricao, valor)
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY candidate_id, tipo_bem, descricao, valor
           ORDER BY id
         ) AS rn
  FROM "CandidateAsset"
)
DELETE FROM "CandidateAsset"
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Recalculate patrimonio_total for all affected candidates
UPDATE "Candidate" c
SET patrimonio_total = (
  SELECT COALESCE(SUM(valor), 0)
  FROM "CandidateAsset"
  WHERE candidate_id = c.id
);
