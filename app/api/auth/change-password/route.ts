import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return new NextResponse("Senha deve ter pelo menos 6 caracteres", { status: 400 });
    }

    await db.user.update({
      where: { email: session.user.email },
      data: { password: newPassword }
    });

    return NextResponse.json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
