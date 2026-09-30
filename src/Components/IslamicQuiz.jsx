import { useState, useEffect, useRef } from "react";
import { db } from "../firebase"; // make sure path is correct
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";

// ==================== QUESTIONS ====================
const questionBanks = {
  easy: [
    { q: "How many pillars of Islam are there?", options: ["3", "4", "5", "7"], correct: 2 },
    { q: "What is the name of the holy book revealed to Prophet Muhammad ﷺ?", options: ["Injil", "Tawrat", "Zabur", "Quran"], correct: 3 },
    { q: "In which month is fasting obligatory for Muslims?", options: ["Shawwal", "Ramadan", "Rajab", "Muharram"], correct: 1 },
    { q: "Who is the final messenger of Allah?", options: ["Prophet Isa (AS)", "Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Muhammad ﷺ"], correct: 3 },
    { q: "What do Muslims face towards when they pray?", options: ["The rising sun", "The Kaaba in Makkah", "Jerusalem", "Madinah"], correct: 1 },
  ],
  medium: [
    { q: "Who was the first person to accept Islam?", options: ["Abu Bakr As-Siddiq (RA)", "Ali ibn Abi Talib (RA)", "Khadijah bint Khuwaylid (RA)", "Zayd ibn Harithah (RA)"], correct: 2 },
    { q: "In which city was the Prophet Muhammad ﷺ born?", options: ["Madinah", "Ta'if", "Makkah", "Yathrib"], correct: 2 },
    { q: "What is the name of the night journey of the Prophet ﷺ?", options: ["Hijrah", "Isra and Mi'raj", "Ghazwah", "Fath Makkah"], correct: 1 },
    { q: "Which Surah is known as the 'Heart of the Quran'?", options: ["Surah Al-Fatihah", "Surah Al-Mulk", "Surah Yaseen", "Surah Ar-Rahman"], correct: 2 },
    { q: "How many times is the word 'Allah' mentioned in Surah Al-Ikhlas?", options: ["1 time", "2 times", "3 times", "4 times"], correct: 1 },
  ],
  hard: [
    { q: "In which year of the Hijrah was the Treaty of Hudaybiyyah signed?", options: ["5 AH", "6 AH", "7 AH", "8 AH"], correct: 1 },
    { q: "Who was the only woman whose name is mentioned in the Quran?", options: ["Khadijah (RA)", "Aisha (RA)", "Maryam (AS)", "Fatimah (RA)"], correct: 2 },
    { q: "Which companion was known as the Sword of Allah?", options: ["Umar ibn Al-Khattab (RA)", "Khalid ibn Al-Walid (RA)", "Hamza ibn Abdul Muttalib (RA)", "Sad ibn Abi Waqqas (RA)"], correct: 1 },
    { q: "How many years did the Prophet Muhammad receive revelation?", options: ["20 years", "23 years", "25 years", "40 years"], correct: 1 },
    { q: "Which battle is also known as Ghazwatul Ahzab?", options: ["Battle of Badr", "Battle of Uhud", "Battle of Khandaq (Trench)", "Battle of Hunayn"], correct: 2 },
  ],
};

// Points system (Fair ranking)
const POINTS = { easy: 1, medium: 2, hard: 3 };

export default function IslamicQuiz() {
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCheatModal, setShowCheatModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [infoModal, setInfoModal] = useState(null);

  const timerRef = useRef(null);

  // Live Leaderboard from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "scores"),
      orderBy("points", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeaderboard(data);
    });

    return () => unsubscribe();
  }, []);

  // Timer
  useEffect(() => {
    if (screen !== "quiz" || answered) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, screen, answered]);

  const saveScore = async (name, scoreVal, difficulty) => {
    const points = scoreVal * (POINTS[difficulty] || 1);

    try {
      await addDoc(collection(db, "scores"), {
        name,
        score: scoreVal,
        points,
        difficulty,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const startQuiz = () => {
    if (!playerName.trim()) {
      setInfoModal({ title: "Name Required", text: "Please enter your name first, inshaAllah." });
      return;
    }
    if (!selectedDifficulty) {
      setInfoModal({ title: "Select Difficulty", text: "Please choose Easy, Medium or Hard." });
      return;
    }
    setShowCheatModal(true);
  };

  const closeCheatModal = () => {
    setShowCheatModal(false);
    setQuestions(questionBanks[selectedDifficulty]);
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setUserAnswers([]);
    setFeedback(null);
    setSelectedOption(null);
    setTimeLeft(30);
    setScreen("quiz");
  };

  const selectAnswer = (idx) => {
    if (answered) return;
    setAnswered(true);
    clearTimeout(timerRef.current);
    setSelectedOption(idx);

    const q = questions[currentQ];
    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = idx;
    setUserAnswers(newAnswers);

    if (idx === q.correct) {
      setScore((s) => s + 1);
      setFeedback({ type: "correct", text: "MashaAllah! Correct ✓" });
    } else {
      setFeedback({ type: "wrong", text: "Incorrect. Correct answer is highlighted." });
    }

    setTimeout(() => nextQuestion(), 1500);
  };

  const handleTimeout = () => {
    if (answered) return;
    setAnswered(true);
    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = -1;
    setUserAnswers(newAnswers);
    setFeedback({ type: "wrong", text: "Time's up! Correct answer is highlighted." });
    setTimeout(() => nextQuestion(), 1500);
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((c) => c + 1);
      setAnswered(false);
      setSelectedOption(null);
      setFeedback(null);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    clearTimeout(timerRef.current);
    saveScore(playerName.trim(), score, selectedDifficulty);
    setScreen("result");
    setShowScoreModal(true);
  };

  const getResultMessage = () => {
    if (score === 5) return { message: "SubhanAllah! Perfect Score!", sub: "May Allah increase you in knowledge." };
    if (score >= 4) return { message: "MashaAllah! Excellent!", sub: "You did very well." };
    if (score >= 3) return { message: "Alhamdulillah! Good effort.", sub: "Keep seeking knowledge." };
    return { message: "Keep going, inshaAllah!", sub: "Every effort is rewarded." };
  };

  const resultMsg = getResultMessage();
  const pointsEarned = score * (POINTS[selectedDifficulty] || 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* START SCREEN */}
        {screen === "start" && (
          <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>
            
            <div className="text-center font-serif text-2xl text-emerald-800 mb-1">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <h1 className="text-center font-serif text-3xl text-emerald-800 mb-1">Islamic Knowledge Quiz</h1>
            <p className="text-center text-gray-600 text-sm mb-6">5 Questions • 30 seconds each</p>

            <div className="mb-5">
              <label className="block font-medium mb-2 text-sm">Enter your name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your beautiful name..."
                maxLength={25}
                className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            <div className="text-center font-semibold mb-3">Select Difficulty</div>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { id: "easy", label: "🌱 Easy", badge: "1 pt each", color: "green" },
                { id: "medium", label: "⭐ Medium", badge: "2 pts each", color: "yellow" },
                { id: "hard", label: "🔥 Hard", badge: "3 pts each", color: "red" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDifficulty(item.id)}
                  className={`flex justify-between items-center px-4 py-3.5 rounded-xl border-2 font-semibold transition
                    ${selectedDifficulty === item.id
                      ? item.color === "green" ? "bg-green-50 border-green-600 text-green-700"
                      : item.color === "yellow" ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                      : "bg-red-50 border-red-600 text-red-700"
                      : "bg-white border-gray-200 hover:shadow-md"
                    }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{item.badge}</span>
                </button>
              ))}
            </div>

            <div className="text-center text-xs text-gray-500 mb-5">
              Hard mode gives highest points → Fair ranking
            </div>

            <button
              onClick={startQuiz}
              disabled={!selectedDifficulty}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Begin with Bismillah →
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => setScreen("leaderboard")}
                className="px-5 py-2.5 rounded-xl border-2 border-emerald-700 text-emerald-700 font-medium hover:bg-emerald-700 hover:text-white transition text-sm"
              >
                View Live Leaderboard
              </button>
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {screen === "quiz" && questions[currentQ] && (
          <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="font-semibold text-emerald-800 text-sm">Question {currentQ + 1} of 5</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold
                  ${selectedDifficulty === "easy" ? "bg-green-100 text-green-700" :
                    selectedDifficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"}`}>
                  {selectedDifficulty?.charAt(0).toUpperCase() + selectedDifficulty?.slice(1)}
                </span>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-white font-bold text-lg min-w-[64px] text-center
                ${timeLeft <= 3 ? "bg-red-600 animate-pulse" : timeLeft <= 5 ? "bg-orange-500 animate-pulse" : "bg-emerald-700"}`}>
                {timeLeft}
              </div>
            </div>

            <div className="h-1.5 bg-emerald-100 rounded-full mb-5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-600 transition-all duration-300"
                   style={{ width: `${((currentQ + 1) / 5) * 100}%` }}></div>
            </div>

            <div className="text-center text-lg font-semibold mb-5 leading-snug">
              {questions[currentQ].q}
            </div>

            <div className="flex flex-col gap-2.5">
              {questions[currentQ].options.map((opt, idx) => {
                let cls = "px-4 py-3.5 rounded-xl border-2 text-left transition cursor-pointer ";
                if (answered) {
                  cls += "opacity-90 cursor-not-allowed ";
                  if (idx === questions[currentQ].correct) cls += "border-green-600 bg-green-50 text-green-700 font-semibold";
                  else if (idx === selectedOption) cls += "border-red-500 bg-red-50 text-red-600";
                  else cls += "border-gray-200 bg-white";
                } else {
                  cls += selectedOption === idx
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-emerald-500 hover:bg-emerald-50";
                }
                return (
                  <div key={idx} className={cls} onClick={() => selectAnswer(idx)}>
                    {opt}
                  </div>
                );
              })}
            </div>

            {feedback && (
              <div className={`mt-4 p-3 rounded-xl text-center font-semibold
                ${feedback.type === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {feedback.text}
              </div>
            )}
          </div>
        )}

        {/* RESULT SCREEN */}
        {screen === "result" && (
          <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>

            <div className="text-center font-serif text-xl text-emerald-800 mb-4">الْحَمْدُ لِلَّهِ</div>

            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-700 to-emerald-600 flex flex-col items-center justify-center text-white shadow-xl mb-4">
              <div className="text-4xl font-bold leading-none">{score}</div>
              <div className="text-sm opacity-90">out of 5</div>
            </div>

            <div className="text-center mb-4">
              <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-4 py-1.5 rounded-full text-sm">
                +{pointsEarned} Points ({selectedDifficulty})
              </div>
            </div>

            <div className="text-center text-lg font-medium mb-1">{resultMsg.message}</div>
            <div className="text-center text-gray-600 text-sm mb-5">{resultMsg.sub}</div>

            {userAnswers.some((ans, i) => ans !== questions[i]?.correct) && (
              <div className="mb-5">
                <h3 className="text-center text-red-600 font-semibold mb-3">Questions you got wrong</h3>
                {questions.map((q, i) => {
                  if (userAnswers[i] === q.correct) return null;
                  const yourAns = userAnswers[i] === -1 ? "No answer (Time up)" : q.options[userAnswers[i]];
                  return (
                    <div key={i} className="bg-white border border-red-200 rounded-xl p-3 mb-2.5 text-sm">
                      <div className="font-semibold mb-1">{i + 1}. {q.q}</div>
                      <div className="text-red-600 mb-0.5">Your answer: {yourAns}</div>
                      <div className="text-green-700 font-medium">Correct: {q.options[q.correct]}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-center text-emerald-800 font-semibold mb-1">JazakAllahu Khairan for playing!</p>
            <p className="text-center text-gray-600 text-sm mb-1">Your points are now on the Live Leaderboard</p>
            <p className="text-center text-gray-500 text-sm mb-5">Made with ❤️ by <strong>Zakii Shaikh</strong></p>

            <button
              onClick={() => setScreen("leaderboard")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold shadow-lg"
            >
              View Live Leaderboard
            </button>
          </div>
        )}

        {/* LEADERBOARD */}
        {screen === "leaderboard" && (
          <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>

            <div className="text-center font-serif text-xl text-emerald-800 mb-1">لوحة المتصدرين</div>
            <h1 className="text-center font-serif text-2xl text-emerald-800 mb-2">Live Leaderboard</h1>
            <p className="text-center text-xs text-gray-500 mb-3">Ranked by Points (Hard = highest value)</p>

            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Live Updates
            </div>

            <ul className="space-y-2 mb-5">
              {leaderboard.length === 0 && (
                <p className="text-center text-gray-500 py-6">No scores yet. Be the first!</p>
              )}
              {leaderboard.map((item, i) => (
                <li
                  key={item.id || i}
                  className={`flex items-center p-3 rounded-xl border
                    ${i === 0 ? "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300" :
                      i === 1 ? "bg-gray-100 border-gray-200" :
                      i === 2 ? "bg-orange-50 border-orange-200" :
                      "bg-white border-emerald-100"}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3
                    ${i === 0 ? "bg-amber-500 text-gray-900" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-600" : "bg-emerald-700"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.difficulty ? item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1) : "-"} • {item.score}/5
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-700">{item.points || 0} pts</div>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setScreen("start")}
              className="w-full py-3 rounded-xl border-2 border-emerald-700 text-emerald-700 font-medium hover:bg-emerald-700 hover:text-white transition"
            >
              ← Back to Home
            </button>
          </div>
        )}

        {screen === "start" && (
          <div className="text-center mt-6 text-white/70 text-sm">
            May Allah increase us in beneficial knowledge<br />
            <span className="text-xs opacity-80">Made by Zakii Shaikh</span>
          </div>
        )}
      </div>

      {/* DON'T CHEAT MODAL */}
      {showCheatModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8f5f0] rounded-2xl p-6 max-w-sm w-full text-center border-2 border-amber-300/40 shadow-2xl">
            <h3 className="font-serif text-xl text-emerald-800 mb-3">⚠️ Do Not Cheat</h3>
            <p className="text-gray-600 text-sm mb-2 leading-relaxed">
              This quiz is for seeking knowledge, not for showing off.<br /><br />
              <strong>“Allah is with those who are honest.”</strong><br />
              <span className="text-xs text-gray-500">(Based on Islamic teachings about honesty)</span>
            </p>
            <p className="text-red-600 font-semibold my-4">Play fairly. Allah is watching.</p>
            <button
              onClick={closeCheatModal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold"
            >
              I Understand – Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* SCORE MODAL */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8f5f0] rounded-2xl p-6 max-w-sm w-full text-center border-2 border-amber-300/40 shadow-2xl">
            <div className="font-serif text-xl text-emerald-800 mb-2">الْحَمْدُ لِلَّهِ</div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">{resultMsg.message}</h3>

            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-700 to-emerald-600 flex flex-col items-center justify-center text-white mb-3">
              <div className="text-3xl font-bold leading-none">{score}</div>
              <div className="text-xs opacity-90">out of 5</div>
            </div>

            <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-4 py-1 rounded-full text-sm mb-3">
              +{pointsEarned} Points
            </div>

            <p className="font-medium mb-1">{resultMsg.sub}</p>
            <p className="text-gray-600 text-sm mb-3">JazakAllahu Khairan for playing!</p>
            <p className="text-gray-500 text-sm mb-5">Made with ❤️ by <strong className="text-emerald-700">Zakii Shaikh</strong></p>

            <button
              onClick={() => setShowScoreModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold"
            >
              See Results & Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* INFO MODAL */}
      {infoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8f5f0] rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="font-serif text-xl text-emerald-800 mb-3">{infoModal.title}</h3>
            <p className="text-gray-600 mb-5">{infoModal.text}</p>
            <button
              onClick={() => setInfoModal(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}