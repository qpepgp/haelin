"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface ItineraryItem {
  day: string;
  time: string;
  title: string;
  description: string;
}

interface ItineraryResult {
  summary: string;
  tips: string[];
  items: ItineraryItem[];
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      const destination = searchParams.get("destination");
      const dates = searchParams.get("dates");
      const companions = searchParams.get("companions");
      const job = searchParams.get("job");

      if (!destination || !dates || !companions || !job) {
        setError("필수 정보가 누락되었습니다. 처음부터 다시 선택해주세요.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ destination, dates, companions, job }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "일정을 생성하는 중 오류가 발생했습니다.");
        }

        setResult(data as ItineraryResult);
      } catch (err: any) {
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItinerary();
  }, [searchParams]);

  return (
    <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl relative">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-zinc-100 border-b border-zinc-800 pb-6 text-center">
        당신을 위한 맞춤 여행 일정
      </h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="w-12 h-12 border-4 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium">직장인 특화 AI가 완벽한 일정을 생성하고 있습니다...</p>
        </div>
      ) : error ? (
        <div className="text-red-400 py-16 text-center flex flex-col items-center">
          <svg className="w-12 h-12 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <p className="font-semibold text-lg">{error}</p>
          <button onClick={() => router.push("/")} className="mt-8 px-6 py-3 border border-zinc-700 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white transition-colors">
            처음으로 돌아가기
          </button>
        </div>
      ) : result ? (
        <div className="animate-in fade-in duration-500">
          {/* Summary */}
          <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
            <h2 className="text-xl font-bold text-white mb-2 leading-snug">✨ {result.summary}</h2>
          </div>

          {/* Tips */}
          {result.tips && result.tips.length > 0 && (
            <div className="mb-10 pl-2">
              <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">💡 여행 실전 팁</h3>
              <ul className="space-y-3">
                {result.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-zinc-300">
                    <span className="text-zinc-500">•</span>
                    <span className="leading-snug">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-4 mb-12">
            <h3 className="text-lg font-semibold text-zinc-300 mb-6 pl-2">🗓️ 상세 일정</h3>
            {result.items?.map((item, idx) => (
              <div key={idx} className="p-5 bg-zinc-950/50 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 mb-2">
                  <div className="flex gap-2 items-center md:w-32 shrink-0">
                    <span className="text-sm font-bold text-zinc-400 bg-zinc-900 px-2 py-1 rounded">{item.day}</span>
                    <span className="text-sm font-medium text-zinc-500">{item.time}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white leading-tight mt-1 md:mt-0">{item.title}</h4>
                </div>
                <p className="text-white/50 text-sm md:text-base leading-relaxed break-keep md:pl-[9rem]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button onClick={() => router.push("/")} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] w-full md:w-auto min-w-[200px]">
              다시 만들기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Result() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black font-sans">
      <Suspense fallback={<div className="text-white text-lg font-bold">결과를 불러오는 중입니다...</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}
