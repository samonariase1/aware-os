import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Authenticate User
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Parse Request Body
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json(
        { error: "Text input is required." },
        { status: 400 }
      );
    }

    // 3. Initialize Google Gemini (1.5 Flash)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Force JSON output for easier parsing
      generationConfig: { responseMimeType: "application/json" },
    });

    // 4. Construct Prompt
    const prompt = `
      Analyze the text below for cognitive and emotional patterns.
      
      Return a JSON object with these exact keys:
      - "emotional_state": (String) A brief 1-2 word description (e.g., "Anxious", "Focused", "Fatigued").
      - "clarity_score": (Integer) 0 to 100 indicating coherence and logic.
      - "attention_score": (Integer) 0 to 100 indicating focus and intent.
      - "recommendation": (String) A short, actionable tip based on the analysis.

      Text to analyze:
      "${text}"
    `;

    // 5. Generate AI Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text();

    // Parse the JSON (Gemini usually returns clean JSON with the MIME type set, 
    // but we add a safety check just in case).
    let analysisData;
    try {
      analysisData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response." },
        { status: 500 }
      );
    }

    // 6. Save to Supabase
    const { data: insertData, error: dbError } = await supabase
      .from("analysis_logs")
      .insert({
        user_id: user.id,
        input_text: text,
        emotional_state: analysisData.emotional_state,
        clarity_score: analysisData.clarity_score,
        attention_score: analysisData.attention_score,
        recommendation: analysisData.recommendation,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database Error:", dbError);
      return NextResponse.json(
        { error: "Failed to save analysis." },
        { status: 500 }
      );
    }

    // 7. Return Success
    return NextResponse.json({ success: true, data: insertData });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}