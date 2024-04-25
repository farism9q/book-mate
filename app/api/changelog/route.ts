import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.changelog.findMany({
    include: {
      images: true,
    },
  });

  // Needed to transform the data to the format of how react-admin expects it
  const changelogs = data.map(changelog => {
    return {
      id: changelog.id,
      title: changelog.title,
      description: changelog.description,
      categories: changelog.categories.map(categ => ({ name: categ })),
      images: changelog.images.map(image => ({
        url: image.imageUrl,
        key: image.imageKey,
      })),
    };
  });

  return NextResponse.json(changelogs);
}

export async function POST(req: Request) {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const changelog = await db.changelog.create({
    data: {
      title: body.title,
      description: body.description,
      categories: body.categories,
    },
  });

  if (!changelog) {
    return new NextResponse("Error with creating changelog", { status: 500 });
  }

  const changelogImages = await db.changelogImages.createMany({
    data: body.images.map((image: { imageUrl: string; imageKey: string }) => ({
      imageUrl: image.imageUrl,
      imageKey: image.imageKey,
      changelogId: changelog.id,
    })),
  });

  if (!changelogImages) {
    return new NextResponse("Error with creating changelog images", {
      status: 500,
    });
  }

  return NextResponse.json(changelog);
}
