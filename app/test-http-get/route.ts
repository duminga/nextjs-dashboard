import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    const url = request.nextUrl;


    return new Response('Hello, this is a GET response from test-http-get route!, URL path: ' + url.pathname);
}