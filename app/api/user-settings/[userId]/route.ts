import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  }
) {
  try {
    const { userId } = params;
    const settingFields = await req.json();

    if (!userId) {
      return new NextResponse("Missing user id", { status: 400 });
    }
    if (Object.keys(settingFields).length === 0) {
      return new NextResponse("Missing setting fields", { status: 400 });
    }

    const newUserSettings = await db.userSettings.update({
      where: {
        userId,
      },
      data: { ...settingFields },
    });

    return NextResponse.json(newUserSettings);
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
