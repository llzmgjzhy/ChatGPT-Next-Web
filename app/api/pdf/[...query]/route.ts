import { NextRequest, NextResponse } from "next/server";
import { ApiPath } from "@/app/constant";

async function handle(
  req: NextRequest,
  { params }: { params: { query: string[] } },
) {
  const [pdfFile, access_token] = params.query;
  req.headers.set("Authorization", `Bearer ${access_token}`);

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: req.headers,
  };

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const path = ApiPath.Pdf;
  const fetchUrl = `${baseUrl}${path}?query=${pdfFile}`;

  try {
    const res = await fetch(fetchUrl, fetchOptions);

    const responseHeaders = new Headers(res.headers);
    responseHeaders.set("Content-Type", "application/pdf");

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (e) {
    console.error("[pdf api]", e);
  }
}

export const GET = handle;
