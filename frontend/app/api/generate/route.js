import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY environment variable is not set.' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            draft: {
              type: SchemaType.STRING,
              description: "The base unstructured draft text for the post."
            },
            instagram: {
              type: SchemaType.STRING,
              description: "A version of the draft highly optimized for Instagram, including visual descriptions and spacing."
            },
            linkedin: {
              type: SchemaType.STRING,
              description: "A version of the draft highly optimized for LinkedIn, focusing on professional tone and formatting."
            },
            tags: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "An array of 5-10 relevant hashtags."
            }
          },
          required: ["draft", "instagram", "linkedin", "tags"]
        }
      }
    });

    const systemPrompt = `You are a professional social media manager and AI Content Strategist. 
Your goal is to take the user's prompt and generate a high-quality base draft, and then optimize it specifically for Instagram and LinkedIn.
Include emojis where appropriate. Extract the best performing hashtags.`;

    const result = await model.generateContent(systemPrompt + "\\n\\nUser Prompt: " + prompt);
    const response = await result.response;
    const jsonOutput = JSON.parse(response.text());

    return NextResponse.json(jsonOutput);
  } catch (error) {
    console.error('Error in AI generation:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
