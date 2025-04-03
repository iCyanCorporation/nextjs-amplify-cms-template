import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { NextResponse } from "next/server";
import { uploadData } from "aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name.split(/\.\w+$/)[0];
    const fileExtension = file.name.split(".").pop();
    const key = `uploads/${fileName}-${uuidv4()}.${fileExtension}`;

    const result = await uploadData({
      key,
      data: buffer,
      options: {
        contentType: file.type,
        metadata: {
          uploadedAt: new Date().toISOString(),
        },
      },
    }).result;

    return NextResponse.json({
      url: key,
      contentType: file.type,
      contentLength: buffer.length,
      eTag: result.eTag,
      lastModified: new Date(),
      metadata: result.metadata || {},
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
