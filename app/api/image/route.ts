import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { TDeleteImage } from "@/actions/image.action";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  if (!file) {
    return NextResponse.json({ error: "No fle" }, { status: 400 });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "langaura" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const url: TDeleteImage = (await req.json()) as unknown as TDeleteImage;
  const result = await cloudinary.uploader.destroy(
    url.public_id as string,
    {
      invalidate: true,
    },
    (error, result) => {
      if (error) {
        console.error("Deletion error:", error);
      } else {
        console.log("Deletion result:", result);
        return NextResponse.json(result);
      }
    }
  );
  return NextResponse.json(result);
}
