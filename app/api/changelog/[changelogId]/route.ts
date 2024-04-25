import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { changelogId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.changelog.findFirst({
    where: {
      id: params.changelogId,
    },
    include: {
      images: true,
    },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { changelogId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.changelogId) {
    return new NextResponse("Missing changelog id", { status: 400 });
  }

  const body = await req.json();

  const data = await db.changelog.update({
    where: {
      id: params.changelogId,
    },
    data: {
      title: body.title,
      description: body.description,
      categories: body.categories,
      images: {
        deleteMany: {
          changelogId: params.changelogId,
        },
        createMany: {
          data: body.images.map(
            (image: { imageUrl: string; imageKey: string }) => ({
              imageUrl: image.imageUrl,
              imageKey: image.imageKey,
            })
          ),
        },
      },
    },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { changelogId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.changelog.delete({
    where: {
      id: params.changelogId,
    },
  });

  return NextResponse.json(data);
};
