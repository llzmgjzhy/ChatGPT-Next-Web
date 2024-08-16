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

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const modifiedUrl = baseUrl.replace(/:\d+/, "");
  const path = ApiPath.Pdf;
  const fetchUrl = `${modifiedUrl}${path}/${detailName}`;

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
