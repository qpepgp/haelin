"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const destinations = [
  { id: "도쿄", emoji: "🗼", name: "도쿄", desc: "짧고 굵은 미식 & 쇼핑" },
  { id: "오사카/교토", emoji: "🏯", name: "오사카/교토", desc: "주말 힐링과 감성 충전" },
  { id: "방콕", emoji: "🌴", name: "방콕", desc: "야근 피로를 날릴 호캉스와 마사지" },
  { id: "다낭", emoji: "🏖️", name: "다낭", desc: "연차 하루면 충분한 가성비 휴양" },
  { id: "제주도", emoji: "🍊", name: "제주도", desc: "부담없이 바로 떠나는 리프레시" },
  { id: "타이베이", emoji: "🥟", name: "타이베이", desc: "식도락과 온천으로 완벽한 회복" },
  { id: "후쿠오카", emoji: "🍜", name: "후쿠오카", desc: "금요일 퇴근 후 훌쩍 떠나는 여행" },
  { id: "발리", emoji: "🧘‍♀️", name: "발리", desc: "진정한 워라밸, 온전한 치유의 시간" },
];

const companions = ["혼자 (나홀로 힐링)", "연인과 (로맨틱 힐링)", "친구와 (스트레스 타파)", "가족과 (함께하는 여유)"];
const jobs = ["잦은 야근으로 피곤한 개발자", "항상 긴장 상태인 기획자", "사람에 치이는 서비스/영업직", "체력 방전 일반 직장인", "아이디어 고갈된 디자이너/마케터"];

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // States
  const [selectedDest, setSelectedDest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [companion, setCompanion] = useState("");
  const [job, setJob] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    if (selectedDest) setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedDest || !startDate || !endDate || !companion || !job) return;
    
    setIsLoading(true);
    const dates = `${startDate} ~ ${endDate}`;
    const params = new URLSearchParams({
      destination: selectedDest,
      dates,
      companions: companion,
      job,
    });
    
    router.push(`/result?${params.toString()}`);
  };

  const isStep2Complete = startDate && endDate && companion && job;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black text-white font-sans">
      <div className="w-full max-w-4xl pt-16 pb-20">
        
        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">어디로 떠나고 싶으신가요?</h1>
              <p className="text-zinc-400 text-lg">바쁜 일상을 벗어나, 오롯이 나를 위한 여행지를 선택해주세요.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {destinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDest(dest.id)}
                  className={`flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left h-full
                    ${
                      selectedDest === dest.id
                        ? "border-white bg-white/10"
                        : "border-white/10 bg-zinc-900/40 hover:bg-zinc-800/80"
                    }
                  `}
                >
                  <span className="text-4xl mb-4 block leading-none">{dest.emoji}</span>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">{dest.name}</h3>
                  <p className="text-sm text-zinc-400 leading-snug break-keep">{dest.desc}</p>
                </button>
              ))}
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={handleNextStep}
                disabled={!selectedDest}
                className={`w-full bg-white text-black font-bold py-3 rounded-full text-lg transition-all duration-300
                  ${!selectedDest ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-200 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]"}
                `}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">상세 정보를 알려주세요.</h1>
              <p className="text-zinc-400 text-lg">직장인 맞춤형 여행 코스를 짜기 위한 마지막 단계입니다.</p>
            </div>

            <div className="space-y-10 mb-16">
              {/* Date Selection */}
              <section>
                <h3 className="text-xl font-semibold mb-4 text-zinc-200">일정 (날짜)</h3>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ colorScheme: "dark" }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all font-medium"
                    />
                  </div>
                  <span className="text-zinc-500 font-bold">~</span>
                  <div className="flex-1">
                    <input
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ colorScheme: "dark" }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all font-medium"
                    />
                  </div>
                </div>
              </section>

              {/* Companion Selection */}
              <section>
                <h3 className="text-xl font-semibold mb-4 text-zinc-200">누구와 함께 가시나요?</h3>
                <div className="flex flex-wrap gap-3">
                  {companions.map((comp) => (
                    <button
                      key={comp}
                      onClick={() => setCompanion(comp)}
                      className={`px-5 py-3 rounded-full border transition-all duration-200 text-sm md:text-base font-medium
                        ${
                          companion === comp
                            ? "border-white bg-white text-black"
                            : "border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                        }
                      `}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </section>

              {/* Job Selection */}
              <section>
                <h3 className="text-xl font-semibold mb-4 text-zinc-200">직업 특성을 골라주세요</h3>
                <div className="flex flex-wrap gap-3">
                  {jobs.map((j) => (
                    <button
                      key={j}
                      onClick={() => setJob(j)}
                      className={`px-5 py-3 rounded-full border transition-all duration-200 text-sm md:text-base font-medium
                        ${
                          job === j
                            ? "border-white bg-white text-black"
                            : "border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                        }
                      `}
                    >
                      {j}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Submitting Area */}
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              
              {/* 작은 뱃지로 선택 현황 표시 */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-700 shadow-sm flex items-center gap-1.5">
                  <span>📍</span> {selectedDest}
                </span>
                {startDate && endDate && (
                  <span className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-700 shadow-sm flex items-center gap-1.5">
                    <span>📅</span> {startDate} ~ {endDate}
                  </span>
                )}
                {companion && (
                  <span className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-700 shadow-sm flex items-center gap-1.5">
                    <span>👥</span> {companion.split(' ')[0]}
                  </span>
                )}
                {job && (
                  <span className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-700 shadow-sm flex items-center gap-1.5">
                    <span>💼</span> 선택완료
                  </span>
                )}
              </div>

              {/* 이전/다음 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 bg-zinc-900 text-white font-bold py-3 rounded-full text-lg hover:bg-zinc-800 transition-colors border border-zinc-700"
                >
                  이전
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isStep2Complete || isLoading}
                  className={`flex-[2] font-bold py-3 rounded-full text-lg transition-all duration-300
                    ${
                      !isStep2Complete
                        ? "bg-white text-black opacity-30 cursor-not-allowed"
                        : isLoading 
                          ? "bg-zinc-500 text-white cursor-wait"
                          : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    }
                  `}
                >
                  {isLoading ? "일정 생성 중..." : "결과 만들기"}
                </button>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </main>
  );
}
