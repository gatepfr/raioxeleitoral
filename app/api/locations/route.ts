import { NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, any>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'states' or 'cities'
  const uf = searchParams.get("uf");

  const cacheKey = `${type}-${uf || ""}`;
  if (cache.has(cacheKey)) {
    return NextResponse.json(cache.get(cacheKey));
  }

  try {
    let url = "";
    if (type === "states") {
      url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
    } else if (type === "cities" && uf) {
      url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`;
    } else {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const response = await fetch(url);
    const data = await response.json();
    
    // Map to a simpler format
    const result = data.map((item: any) => ({
      id: item.id,
      nome: item.nome,
      sigla: item.sigla || item.id // 'sigla' for states, 'id' for cities
    }));

    cache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from IBGE" }, { status: 500 });
  }
}
