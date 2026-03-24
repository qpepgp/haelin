import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { destination, dates, companions, job } = body;

    if (!destination || !dates || !companions || !job) {
      return NextResponse.json(
        { error: "모든 항목(여행지, 날짜, 동행, 직업)을 입력해주세요." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
당신은 대한민국 직장인들의 고충을 깊이 이해하고 있는 맞춤 여행 일정 전문가입니다.
사용자는 다음 정보를 바탕으로 여행 일정을 요청했습니다.

- 여행지: ${destination}
- 일정(날짜): ${dates}
- 동행: ${companions}
- 상태(직업 특성): ${job}

사용자의 직업적 스트레스, 체력 상태, 그리고 동행자와의 관계를 최우선으로 고려하여 가장 완벽하고 현실적인 일정을 만들어주세요.

응답은 반드시 아래 구조의 JSON으로 반환해야 합니다:
{
  "summary": "전체 여행 컨셉을 요약한 매력적인 한 줄 소개",
  "tips": [
    "해당 사용자의 상황에 맞는 실전 팁 1",
    "해당 사용자의 상황에 맞는 실전 팁 2",
    "해당 사용자의 상황에 맞는 실전 팁 3"
  ],
  "items": [
    {
      "day": "1일차",
      "time": "오후 1:00",
      "title": "일정의 제목 (예: 공항 도착 후 가벼운 점심)",
      "description": "구체적인 장소, 활동 설명 및 추천하는 이유 (피로도를 고려한 설명)"
    }
  ]
}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const response = await result.response;
    const text = response.text();
    
    // JSON 문자열 처리 보완
    const jsonResult = JSON.parse(text);

    return NextResponse.json(jsonResult);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "AI 맞춤 일정을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
