UPDATE "Candidate"
SET
  nome_completo = TRIM(nome_completo),
  nome_urna     = TRIM(nome_urna),
  partido       = TRIM(partido),
  cargo         = TRIM(cargo),
  municipio     = TRIM(municipio);
