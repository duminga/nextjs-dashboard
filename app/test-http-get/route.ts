import type { NextRequest } from "next/server";
import {fetchCardData} from "@/app/lib/data";

export async function GET(request: NextRequest) {

    const url = request.nextUrl;

    const cardData = await fetchCardData();

    return new Response('Hello, this is a GET response from test-http-get route!, URL path: ' + url.pathname + ', Card Data: ' + JSON.stringify(cardData));
}