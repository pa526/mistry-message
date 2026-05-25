import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions should encourage friendly interaction.";

    const result = streamText({
      model: openai("gpt-3.5-turbo-instruct"),
      prompt,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("An unexpected error occurred", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}