import { NextRequest, NextResponse } from "next/server";
import { ApiPath } from "@/app/constant";

async function handle(
  req: NextRequest,
  { params }: { params: { query: string[] } },
) {
  const [pdfFile, detailName] = params.query;

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: req.headers,
  };

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL || "";
  const path = ApiPath.Pdf;
  const fetchUrl = `${baseUrl}${path}/${detailName}`;

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
    console.error("[pdf api error]", e);
  }
}

export const GET = handle;
