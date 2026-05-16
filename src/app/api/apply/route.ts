import { NextResponse } from "next/server";
import {
  applySchema,
  ACCEPTED_CV_MIME,
  MAX_CV_SIZE_BYTES,
} from "@/lib/apply-schema";
import { sendApplicationEmail } from "@/lib/apply-email";

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = formData.get("cv");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Missing CV file" },
      { status: 400 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json(
      { ok: false, error: "Empty CV file" },
      { status: 400 }
    );
  }
  if (file.size > MAX_CV_SIZE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "CV is larger than 5 MB" },
      { status: 400 }
    );
  }
  if (file.type !== ACCEPTED_CV_MIME) {
    return NextResponse.json(
      { ok: false, error: "CV must be a PDF" },
      { status: 400 }
    );
  }

  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    yearsExperience: String(formData.get("yearsExperience") ?? ""),
    jobSlug: String(formData.get("jobSlug") ?? ""),
    jobTitle: String(formData.get("jobTitle") ?? ""),
    coverNote: String(formData.get("coverNote") ?? ""),
  };

  const parsed = applySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = sanitizeFilename(file.name || "cv.pdf");
  const result = await sendApplicationEmail(parsed.data, {
    filename,
    content: buffer,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  return cleaned || "cv.pdf";
}
