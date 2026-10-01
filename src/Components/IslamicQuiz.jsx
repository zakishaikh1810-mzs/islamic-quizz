import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";

// ==================== QUESTIONS ====================

const questionBanks = {
  easy: [
    {
  q: "Which Prophet rebuilt the Ka'bah with his son Isma'il (AS)?",
  options: [
    "Ibrahim (AS)",
    "Nuh (AS)",
    "Ya'qub (AS)",
    "Musa (AS)",
  ],
  correct: 0,
},

{
  q: "Which Prophet was imprisoned after refusing the advances of the wife of Al-Aziz?",
  options: [
    "Yusuf (AS)",
    "Musa (AS)",
    "Yunus (AS)",
    "Ibrahim (AS)",
  ],
  correct: 0,
},

{
  q: "Who was the first person to accept Islam among the adult men?",
  options: [
    "Umar ibn Al-Khattab (RA)",
    "Abu Bakr As-Siddiq (RA)",
    "Uthman ibn Affan (RA)",
    "Ali ibn Abi Talib (RA)",
  ],
  correct: 1,
},

{
  q: "Which Prophet was swallowed by the great fish?",
  options: [
    "Ayyub (AS)",
    "Yunus (AS)",
    "Zakariyya (AS)",
    "Ilyas (AS)",
  ],
  correct: 1,
},

{
  q: "Which battle was fought in the second year after the Hijrah?",
  options: [
    "Battle of Uhud",
    "Battle of Badr",
    "Battle of Khandaq",
    "Battle of Hunayn",
  ],
  correct: 1,
},

{
  q: "Which Prophet was known for his patience during severe trials and illness?",
  options: [
    "Ayyub (AS)",
    "Ya'qub (AS)",
    "Yusuf (AS)",
    "Ismail (AS)",
  ],
  correct: 0,
},
{
  q: "Who was the father of Prophet Muhammad ﷺ?",
  options: [
    "Abu Talib",
    "Abdullah",
    "Abdul-Muttalib",
    "Hamzah",
  ],
  correct: 1,
},

{
  q: "Which Prophet was thrown into the fire by his people?",
  options: [
    "Ibrahim (AS)",
    "Musa (AS)",
    "Nuh (AS)",
    "Yusuf (AS)",
  ],
  correct: 0,
},

{
  q: "In which city was Prophet Muhammad ﷺ born?",
  options: [
    "Madinah",
    "Ta'if",
    "Makkah",
    "Jerusalem",
  ],
  correct: 2,
},

{
  q: "Who was the first Caliph after the death of Prophet Muhammad ﷺ?",
  options: [
    "Umar ibn Al-Khattab (RA)",
    "Ali ibn Abi Talib (RA)",
    "Uthman ibn Affan (RA)",
    "Abu Bakr As-Siddiq (RA)",
  ],
  correct: 3,
},
],

  medium: [
    {
      q: "Who was the first woman to accept Islam?",
      options: [
        "Aisha (RA)",
        "Khadijah (RA)",
        "Fatimah (RA)",
        "Hafsa (RA)",
      ],
      correct: 1,
    },
    {
      q: "Who was known as Al-Farooq?",
      options: [
        "Abu Bakr (RA)",
        "Uthman (RA)",
        "Umar ibn Al-Khattab (RA)",
        "Ali ibn Abi Talib (RA)",
      ],
      correct: 2,
    },
    {
      q: "Which Surah contains Ayat al-Kursi?",
      options: [
        "Surah Al-Imran",
        "Surah Al-Baqarah",
        "Surah An-Nisa",
        "Surah Al-Ma'idah",
      ],
      correct: 1,
    },
    {
      q: "What was the name of Prophet Muhammad's ﷺ father?",
      options: [
        "Abu Talib",
        "Abdullah",
        "Abdul Muttalib",
        "Hamzah",
      ],
      correct: 1,
    },
    {
      q: "Which was the first major battle between the Muslims and Quraysh?",
      options: [
        "Battle of Uhud",
        "Battle of Khandaq",
        "Battle of Badr",
        "Battle of Hunayn",
      ],
      correct: 2,
    },
    {
      q: "Which companion was given the title Dhun-Nurayn?",
      options: [
        "Umar ibn Al-Khattab (RA)",
        "Uthman ibn Affan (RA)",
        "Ali ibn Abi Talib (RA)",
        "Abu Bakr (RA)",
      ],
      correct: 1,
    },
    {
      q: "Which Prophet built the Ark by the command of Allah?",
      options: [
        "Ibrahim (AS)",
        "Nuh (AS)",
        "Yusuf (AS)",
        "Dawud (AS)",
      ],
      correct: 1,
    },
    {
      q: "Which Surah is the longest Surah in the Quran?",
      options: [
        "Surah Al-Imran",
        "Surah An-Nisa",
        "Surah Al-Baqarah",
        "Surah Al-A'raf",
      ],
      correct: 2,
    },
    {
      q: "Which Surah is the shortest Surah in the Quran?",
      options: [
        "Al-Asr",
        "Al-Kawthar",
        "An-Nasr",
        "Al-Ikhlas",
      ],
      correct: 1,
    },
    {
      q: "Which Prophet was given the Zabur?",
      options: [
        "Musa (AS)",
        "Isa (AS)",
        "Dawud (AS)",
        "Ibrahim (AS)",
      ],
      correct: 2,
    },
    {
      q: "Which Prophet was swallowed by a large fish?",
      options: [
        "Yunus (AS)",
        "Ayyub (AS)",
        "Zakariyya (AS)",
        "Yahya (AS)",
      ],
      correct: 0,
    },
    {
      q: "How many Surahs are there in the Quran?",
      options: ["110", "112", "114", "116"],
      correct: 2,
    },
  ],

  hard: [
  {
    q: "In which year of the Hijrah was the Treaty of Hudaybiyyah signed?",
    options: ["5 AH", "6 AH", "7 AH", "8 AH"],
    correct: 1,
  },

  {
    q: "Who was the only woman whose name is mentioned in the Quran?",
    options: [
      "Khadijah (RA)",
      "Aisha (RA)",
      "Maryam (AS)",
      "Fatimah (RA)",
    ],
    correct: 2,
  },

  {
    q: "How many years did Prophet Muhammad ﷺ receive revelation?",
    options: ["20 years", "23 years", "25 years", "40 years"],
    correct: 1,
  },

  {
    q: "Which battle is also known as Ghazwatul Ahzab?",
    options: [
      "Battle of Badr",
      "Battle of Uhud",
      "Battle of Khandaq (Trench)",
      "Battle of Hunayn",
    ],
    correct: 2,
  },

  {
    q: "Which companion was known as the Keeper of the Secrets of the Prophet ﷺ?",
    options: [
      "Abu Hurairah (RA)",
      "Hudhayfah ibn Al-Yaman (RA)",
      "Anas ibn Malik (RA)",
      "Abdullah ibn Umar (RA)",
    ],
    correct: 1,
  },

  {
    q: "Who accompanied Prophet Muhammad ﷺ during the Hijrah and stayed with him in the Cave of Thawr?",
    options: [
      "Umar ibn Al-Khattab (RA)",
      "Abu Bakr As-Siddiq (RA)",
      "Ali ibn Abi Talib (RA)",
      "Uthman ibn Affan (RA)",
    ],
    correct: 1,
  },

  {
    q: "Which companion was sent to Madinah before the Hijrah to teach people about Islam?",
    options: [
      "Mus'ab ibn Umayr (RA)",
      "Mu'adh ibn Jabal (RA)",
      "Zayd ibn Thabit (RA)",
      "Abu Musa Al-Ash'ari (RA)",
    ],
    correct: 0,
  },

  {
    q: "During the Hijrah, who slept in the Prophet's ﷺ bed to help mislead the Quraysh?",
    options: [
      "Ali ibn Abi Talib (RA)",
      "Abu Bakr As-Siddiq (RA)",
      "Umar ibn Al-Khattab (RA)",
      "Zubayr ibn Al-Awwam (RA)",
    ],
    correct: 0,
  },

  {
    q: "Which companion was given the title Hawariyy, meaning a close supporter of the Prophet ﷺ?",
    options: [
      "Zubayr ibn Al-Awwam (RA)",
      "Talhah ibn Ubaydillah (RA)",
      "Sa'd ibn Abi Waqqas (RA)",
      "Abdur-Rahman ibn Awf (RA)",
    ],
    correct: 0,
  },


{
  q: "Which Prophet's people were destroyed by a wind lasting seven nights and eight days?",
  options: [
    "Salih (AS)",
    "Hud (AS)",
    "Lut (AS)",
    "Nuh (AS)",
  ],
  correct: 1,
},

  // ==================== NEW HARD QUESTIONS ====================

  {
    q: "During the Mi'raj, in which heaven did Prophet Muhammad ﷺ meet Prophet Musa (AS)?",
    options: [
      "Second heaven",
      "Fourth heaven",
      "Sixth heaven",
      "Seventh heaven",
    ],
    correct: 2,
  },

  {
    q: "Which Prophet was given the special blessing that iron was made pliable for him?",
    options: [
      "Sulayman (AS)",
      "Dawud (AS)",
      "Musa (AS)",
      "Ibrahim (AS)",
    ],
    correct: 1,
  },

 {
  q: "Which Prophet was sent to both mankind and jinn?",
  options: [
    "Dawud (AS)",
    "Sulayman (AS)",
    "Musa (AS)",
    "Ibrahim (AS)",
  ],
  correct: 1,
},

  {
    q: "Which Prophet was given the ability to understand the speech of birds and an ant, as mentioned in the Qur'an?",
    options: [
      "Dawud (AS)",
      "Sulayman (AS)",
      "Nuh (AS)",
      "Yusuf (AS)",
    ],
    correct: 1,
  },

  {
    q: "According to the Qur'an, what material did Dhul-Qarnayn use together with iron to construct the barrier against Ya'juj and Ma'juj ?",
    options: [
      "Molten copper",
      "Molten gold",
      "Silver",
      "Lead",
    ],
    correct: 0,
  },

  {
    q: "Which companion was described by the Prophet ﷺ as the most knowledgeable of his Ummah regarding what is lawful and unlawful?",
    options: [
      "Zayd ibn Thabit (RA)",
      "Mu'adh ibn Jabal (RA)",
      "Ubayy ibn Ka'b (RA)",
      "Abu Ubaidah ibn Al-Jarrah (RA)",
    ],
    correct: 1,
  },
],
};

// ==================== POINTS ====================

const POINTS = {
  easy: 1,
  medium: 2,
  hard: 3,
};

// ==================== COMPONENT ====================

export default function IslamicQuiz() {
  const [screen, setScreen] = useState("start");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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

  // Exact leaderboard document belonging to this player
  const [myScoreId, setMyScoreId] = useState(null);

  const timerRef = useRef(null);
  const myRowRef = useRef(null);

  // ==================== PLAYER ID ====================

  useEffect(() => {
    let playerId = localStorage.getItem("islamicQuizPlayerId");

    if (!playerId) {
      playerId =
        crypto.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      localStorage.setItem("islamicQuizPlayerId", playerId);
    }
  }, []);

  const getPlayerId = () => {
    let playerId = localStorage.getItem("islamicQuizPlayerId");

    if (!playerId) {
      playerId =
        crypto.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      localStorage.setItem("islamicQuizPlayerId", playerId);
    }

    return playerId;
  };

  // ==================== LIVE LEADERBOARD ====================

  useEffect(() => {
    const leaderboardQuery = query(
      collection(db, "scores"),
      orderBy("totalPoints", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      leaderboardQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLeaderboard(data);
      },
      (error) => {
        console.error("Leaderboard error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==================== AUTO SCROLL TO YOUR ROW ====================

  useEffect(() => {
    if (
      screen === "leaderboard" &&
      myScoreId &&
      myRowRef.current
    ) {
      setTimeout(() => {
        myRowRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [screen, leaderboard, myScoreId]);

  // ==================== TIMER ====================

  useEffect(() => {
    if (screen !== "quiz" || answered) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, screen, answered]);

  // ==================== NAME ====================

  const getFullName = () => {
    return `${firstName.trim()} ${lastName.trim()}`
      .replace(/\s+/g, " ")
      .trim();
  };

  const getNameKey = (name) => {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
  };

  // ==================== CHECK NAME + DIFFICULTY ====================

  const checkDifficultyAlreadyPlayed = async (
    fullName,
    difficulty
  ) => {
    try {
      const nameKey = getNameKey(fullName);

      const nameQuery = query(
        collection(db, "scores"),
        where("nameKey", "==", nameKey)
      );

      const snapshot = await getDocs(nameQuery);

      if (snapshot.empty) {
        return false;
      }

      const data = snapshot.docs[0].data();

      return data[`${difficulty}Played`] === true;
    } catch (error) {
      console.error(
        "Checking previous score failed:",
        error
      );

      return false;
    }
  };

  // ==================== SAVE SCORE ====================

  const saveScore = async (
    name,
    scoreVal,
    difficulty
  ) => {
    const points =
      scoreVal * (POINTS[difficulty] || 1);

    try {
      const playerId = getPlayerId();
      const nameKey = getNameKey(name);

      const nameQuery = query(
        collection(db, "scores"),
        where("nameKey", "==", nameKey)
      );

      const snapshot = await getDocs(nameQuery);

      // ==================== NEW PLAYER ====================

      if (snapshot.empty) {
        const docRef = await addDoc(
          collection(db, "scores"),
          {
            playerId,
            name,
            nameKey,

            firstName: firstName.trim(),
            lastName: lastName.trim(),

            easyScore:
              difficulty === "easy"
                ? scoreVal
                : null,

            mediumScore:
              difficulty === "medium"
                ? scoreVal
                : null,

            hardScore:
              difficulty === "hard"
                ? scoreVal
                : null,

            easyPoints:
              difficulty === "easy"
                ? points
                : 0,

            mediumPoints:
              difficulty === "medium"
                ? points
                : 0,

            hardPoints:
              difficulty === "hard"
                ? points
                : 0,

            easyPlayed:
              difficulty === "easy",

            mediumPlayed:
              difficulty === "medium",

            hardPlayed:
              difficulty === "hard",

            totalScore: scoreVal,

            totalQuestions:
              questionBanks.easy.length +
              questionBanks.medium.length +
              questionBanks.hard.length,

            totalPoints: points,

            time: new Date().toISOString(),
          }
        );

        setMyScoreId(docRef.id);

        return docRef.id;
      }

      // ==================== EXISTING PLAYER ====================

      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();

      const updatedEasyScore =
        difficulty === "easy"
          ? scoreVal
          : existingData.easyScore ?? null;

      const updatedMediumScore =
        difficulty === "medium"
          ? scoreVal
          : existingData.mediumScore ?? null;

      const updatedHardScore =
        difficulty === "hard"
          ? scoreVal
          : existingData.hardScore ?? null;

      const updatedEasyPoints =
        difficulty === "easy"
          ? points
          : existingData.easyPoints || 0;

      const updatedMediumPoints =
        difficulty === "medium"
          ? points
          : existingData.mediumPoints || 0;

      const updatedHardPoints =
        difficulty === "hard"
          ? points
          : existingData.hardPoints || 0;

      const updatedTotalScore =
        (updatedEasyScore || 0) +
        (updatedMediumScore || 0) +
        (updatedHardScore || 0);

      const updatedTotalPoints =
        updatedEasyPoints +
        updatedMediumPoints +
        updatedHardPoints;

      await updateDoc(existingDoc.ref, {
        easyScore: updatedEasyScore,
        mediumScore: updatedMediumScore,
        hardScore: updatedHardScore,

        easyPoints: updatedEasyPoints,
        mediumPoints: updatedMediumPoints,
        hardPoints: updatedHardPoints,

        easyPlayed:
          difficulty === "easy"
            ? true
            : existingData.easyPlayed || false,

        mediumPlayed:
          difficulty === "medium"
            ? true
            : existingData.mediumPlayed || false,

        hardPlayed:
          difficulty === "hard"
            ? true
            : existingData.hardPlayed || false,

        totalScore: updatedTotalScore,

        totalQuestions:
          questionBanks.easy.length +
          questionBanks.medium.length +
          questionBanks.hard.length,

        totalPoints: updatedTotalPoints,

        time: new Date().toISOString(),
      });

      setMyScoreId(existingDoc.id);

      return existingDoc.id;
    } catch (error) {
      console.error(
        "Error saving score:",
        error
      );

      return null;
    }
  };

  // ==================== START QUIZ ====================

  const startQuiz = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setInfoModal({
        title: "Name Required",
        text: "Please enter both First Name and Last Name.",
      });

      return;
    }

    if (!selectedDifficulty) {
      setInfoModal({
        title: "Select Difficulty",
        text: "Please choose Easy, Medium or Hard.",
      });

      return;
    }

    if (
      !/^[A-Za-z ]{3,}$/.test(
        firstName.trim()
      )
    ) {
      setInfoModal({
        title: "Invalid First Name",
        text: "Please enter a valid first name with at least 3 letters.",
      });

      return;
    }

    if (
      !/^[A-Za-z ]{3,}$/.test(
        lastName.trim()
      )
    ) {
      setInfoModal({
        title: "Invalid Last Name",
        text: "Please enter a valid last name with at least 3 letters.",
      });

      return;
    }

    const fullName = getFullName();

    const alreadyPlayed =
      await checkDifficultyAlreadyPlayed(
        fullName,
        selectedDifficulty
      );

    if (alreadyPlayed) {
      setInfoModal({
        title: "Already Played",
        text: `${fullName} has already played ${selectedDifficulty}. You can still play the other difficulty levels.`,
      });

      return;
    }

    setShowCheatModal(true);
  };

  // ==================== BEGIN QUIZ ====================

  const closeCheatModal = () => {
    setShowCheatModal(false);

    setQuestions(
      questionBanks[selectedDifficulty]
    );

    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setUserAnswers([]);
    setFeedback(null);
    setSelectedOption(null);
    setTimeLeft(30);

    setScreen("quiz");
  };

  // ==================== ANSWER ====================

  const selectAnswer = (idx) => {
    if (answered) return;

    setAnswered(true);

    clearTimeout(timerRef.current);

    setSelectedOption(idx);

    const currentQuestion =
      questions[currentQ];

    const newAnswers = [
      ...userAnswers,
    ];

    newAnswers[currentQ] = idx;

    setUserAnswers(newAnswers);

    if (
      idx === currentQuestion.correct
    ) {
      setScore(
        (previousScore) =>
          previousScore + 1
      );

      setFeedback({
        type: "correct",
        text: "MashaAllah! Correct ✓",
      });
    } else {
      setFeedback({
        type: "wrong",
        text: "Incorrect. Correct answer is highlighted.",
      });
    }

    setTimeout(() => {
      nextQuestion(idx);
    }, 2000);
  };

  // ==================== TIMEOUT ====================

  const handleTimeout = () => {
    if (answered) return;

    setAnswered(true);

    clearTimeout(timerRef.current);

    const newAnswers = [
      ...userAnswers,
    ];

    newAnswers[currentQ] = -1;

    setUserAnswers(newAnswers);

    setFeedback({
      type: "wrong",
      text: "Time's up! Correct answer is highlighted.",
    });

    setTimeout(() => {
      nextQuestion(-1);
    }, 2000);
  };

  // ==================== NEXT QUESTION ====================

  const nextQuestion = (
    latestAnswer = null
  ) => {
    if (
      currentQ + 1 <
      questions.length
    ) {
      setCurrentQ(
        (current) => current + 1
      );

      setAnswered(false);
      setSelectedOption(null);
      setFeedback(null);
      setTimeLeft(30);
    } else {
      finishQuiz(latestAnswer);
    }
  };

  // ==================== FINISH ====================

  const finishQuiz = async (
    latestAnswer = null
  ) => {
    clearTimeout(timerRef.current);

    const fullName = getFullName();

    const finalAnswers = [
      ...userAnswers,
    ];

    if (latestAnswer !== null) {
      finalAnswers[currentQ] =
        latestAnswer;
    }

    const finalScore =
      questions.reduce(
        (total, question, index) => {
          return (
            total +
            (finalAnswers[index] ===
            question.correct
              ? 1
              : 0)
          );
        },
        0
      );

    setScore(finalScore);

    await saveScore(
      fullName,
      finalScore,
      selectedDifficulty
    );

    setScreen("result");
    setShowScoreModal(true);
  };

  // ==================== RESULT MESSAGE ====================

  const getResultMessage = () => {
    const totalQuestions =
      questions.length;

    if (
      score === totalQuestions
    ) {
      return {
        message:
          "SubhanAllah! Perfect Score!",
        sub: "May Allah increase you in knowledge.",
      };
    }

    if (
      score >=
      Math.ceil(
        totalQuestions * 0.8
      )
    ) {
      return {
        message:
          "MashaAllah! Excellent!",
        sub: "You did very well.",
      };
    }

    if (
      score >=
      Math.ceil(
        totalQuestions * 0.6
      )
    ) {
      return {
        message:
          "Alhamdulillah! Good effort.",
        sub: "Keep seeking knowledge.",
      };
    }

    return {
      message:
        "Keep going, inshaAllah!",
      sub: "Every effort is rewarded.",
    };
  };

  const resultMsg =
    getResultMessage();

  const pointsEarned =
    score *
    (POINTS[selectedDifficulty] ||
      1);

  // ==================== UI ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* ==================== START SCREEN ==================== */}

        {screen === "start" && (
          <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden quiz-card-animation ">

            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>

            <div className="text-center font-serif text-2xl text-emerald-800 mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            <h1 className="text-center font-serif text-3xl text-emerald-800 mb-1">
              Islamic Knowledge Quiz
            </h1>

            <p className="text-center text-gray-600 text-sm mb-6">
              Question • 30 seconds each
            </p>

            {/* FIRST NAME */}

            <div className="mb-4">
              <label className="block font-medium mb-2 text-sm">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) =>
                  setFirstName(
                    e.target.value
                  )
                }
                placeholder="First name..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            {/* LAST NAME */}

            <div className="mb-5">
              <label className="block font-medium mb-2 text-sm">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) =>
                  setLastName(
                    e.target.value
                  )
                }
                placeholder="Last name..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            {/* DIFFICULTY */}

            <div className="text-center font-semibold mb-3">
              Select Difficulty
            </div>

            <div className="flex flex-col gap-3 mb-5">

              {[
                {
                  id: "easy",
                  label: " Easy",
                  badge: "1 pt each",
                  color: "green",
                },
                {
                  id: "medium",
                  label: " Medium",
                  badge: "2 pts each",
                  color: "yellow",
                },
                {
                  id: "hard",
                  label: " Hard",
                  badge: "3 pts each",
                  color: "red",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setSelectedDifficulty(
                      item.id
                    )
                  }
                  className={`flex justify-between items-center px-4 py-3.5 rounded-xl border-2 font-semibold transition ${
                    selectedDifficulty ===
                    item.id
                      ? item.color ===
                        "green"
                        ? "bg-green-50 border-green-600 text-green-700"
                        : item.color ===
                          "yellow"
                        ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                        : "bg-red-50 border-red-600 text-red-700"
                      : "bg-white border-gray-200 hover:shadow-md"
                  }`}
                >
                  <span>
                    {item.label}
                  </span>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-center text-xs text-gray-500 mb-5">
              You can play each difficulty once.
            </div>

            <button
              onClick={startQuiz}
              disabled={
                !selectedDifficulty
              }
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition button-animation"
            >
              Begin with Bismillah →
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() =>
                  setScreen(
                    "leaderboard"
                  )
                }
                className="px-5 py-2.5 rounded-xl border-2 border-emerald-700 text-emerald-700 font-medium hover:bg-emerald-700 hover:text-white transition text-sm"
              >
                View Live Leaderboard
              </button>
            </div>
          </div>
        )}

        {/* ==================== QUIZ SCREEN ==================== */}

        {screen === "quiz" &&
          questions[currentQ] && (
            <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden">

              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>

              <div className="flex justify-between items-center mb-4">

                <div>
                  <span className="font-semibold text-emerald-800 text-sm">
                    Question{" "}
                    {currentQ + 1} of{" "}
                    {questions.length}
                  </span>

                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
                      selectedDifficulty ===
                      "easy"
                        ? "bg-green-100 text-green-700"
                        : selectedDifficulty ===
                          "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedDifficulty
                      ?.charAt(0)
                      .toUpperCase() +
                      selectedDifficulty?.slice(
                        1
                      )}
                  </span>
                </div>

                <div
                  className={`px-4 py-1.5 rounded-full text-white font-bold text-lg min-w-[64px] text-center ${
                    timeLeft <= 3
                      ? "bg-red-600 animate-pulse"
                      : timeLeft <= 5
                      ? "bg-orange-500 animate-pulse"
                      : "bg-emerald-700"
                  }`}
                >
                  {timeLeft}
                </div>
              </div>

              <div className="h-1.5 bg-emerald-100 rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-600 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQ + 1) /
                        questions.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="text-center text-lg font-semibold mb-5 leading-snug">
                {questions[currentQ].q}
              </div>

              <div className="flex flex-col gap-2.5">

                {questions[
                  currentQ
                ].options.map(
                  (opt, idx) => {
                    let cls =
                      "px-4 py-3.5 rounded-xl border-2 text-left transition cursor-pointer ";

                    if (answered) {
                      cls +=
                        "opacity-90 cursor-not-allowed ";

                      if (
                        idx ===
                        questions[
                          currentQ
                        ].correct
                      ) {
                        cls +=
                          "border-green-600 bg-green-50 text-green-700 font-semibold";
                      } else if (
                        idx ===
                        selectedOption
                      ) {
                        cls +=
                          "border-red-500 bg-red-50 text-red-600";
                      } else {
                        cls +=
                          "border-gray-200 bg-white";
                      }
                    } else {
                      cls +=
                        selectedOption ===
                        idx
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-emerald-500 hover:bg-emerald-50";
                    }

                    return (
                      <div
                        key={idx}
                        className={cls}
                        onClick={() =>
                          selectAnswer(
                            idx
                          )
                        }
                      >
                        {opt}
                      </div>
                    );
                  }
                )}
              </div>

              {feedback && (
                <div
                  className={`mt-4 p-3 rounded-xl text-center font-semibold ${
                    feedback.type ===
                    "correct"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {feedback.text}
                </div>
              )}
            </div>
          )}

        {/* ==================== RESULT SCREEN ==================== */}

        {screen === "result" && (
          <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden fade-animation">

            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>

            <div className="text-center font-serif text-xl text-emerald-800 mb-4">
              الْحَمْدُ لِلَّهِ
            </div>

            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-700 to-emerald-600 flex flex-col items-center justify-center text-white shadow-xl mb-4">

              <div className="text-4xl font-bold leading-none">
                {score}
              </div>

              <div className="text-sm opacity-90">
                out of{" "}
                {questions.length}
              </div>
            </div>

            <div className="text-center mb-4">

              <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-4 py-1.5 rounded-full text-sm">
                +{pointsEarned} Points (
                {selectedDifficulty})
              </div>
            </div>

            <div className="text-center text-lg font-medium mb-1">
              {resultMsg.message}
            </div>

            <div className="text-center text-gray-600 text-sm mb-5">
              {resultMsg.sub}
            </div>

            {userAnswers.some(
              (ans, i) =>
                ans !==
                questions[i]?.correct
            ) && (
              <div className="mb-5">

                <h3 className="text-center text-red-600 font-semibold mb-3">
                  Questions you got wrong
                </h3>

                {questions.map(
                  (q, i) => {
                    if (
                      userAnswers[i] ===
                      q.correct
                    ) {
                      return null;
                    }

                    const yourAns =
                      userAnswers[i] ===
                      -1
                        ? "No answer (Time up)"
                        : q.options[
                            userAnswers[i]
                          ];

                    return (
                      <div
                        key={i}
                        className="bg-white border border-red-200 rounded-xl p-3 mb-2.5 text-sm"
                      >
                        <div className="font-semibold mb-1">
                          {i + 1}. {q.q}
                        </div>

                        <div className="text-red-600 mb-0.5">
                          Your answer:{" "}
                          {yourAns}
                        </div>

                        <div className="text-green-700 font-medium">
                          Correct:{" "}
                          {
                            q.options[
                              q.correct
                            ]
                          }
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            <p className="text-center text-emerald-800 font-semibold mb-1">
              JazakAllahu Khairan for playing!
            </p>

            <p className="text-center text-gray-600 text-sm mb-1">
              Your points are now on the Live Leaderboard
            </p>

            <p className="text-center text-gray-500 text-sm mb-5">
              Made by{" "}
              <strong>
                Zakii Shaikh
              </strong>
            </p>

            <button
              onClick={() =>
                setScreen(
                  "leaderboard"
                )
              }
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold shadow-lg"
            >
              View Live Leaderboard
            </button>
          </div>
        )}

        {/* ==================== LEADERBOARD ==================== */}

        {screen === "leaderboard" && (
          <div className="bg-[#f8f5f0] rounded-3xl p-7 shadow-2xl border-2 border-amber-300/30 relative overflow-hidden fade-animation">

            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400"></div>

            <h1 className="text-center font-serif text-2xl text-emerald-800 mb-2">
              Live Leaderboard
            </h1>

            <p className="text-center text-xs text-gray-500 mb-3">
              Ranked by Points • Easy 1 • Medium 2 • Hard 3
            </p>

            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Live Updates
            </div>

            <ul className="space-y-2 mb-5 max-h-[400px] overflow-y-auto">

              {leaderboard.length ===
                0 && (
                <p className="text-center text-gray-500 py-6">
                  No scores yet. Be the first!
                </p>
              )}

              {leaderboard.map(
                (item, i) => {

                  const isYou =
                    myScoreId &&
                    item.id ===
                      myScoreId;

                  const playedDifficulties =
                    [
                      item.easyPlayed &&
                        "Easy",
                      item.mediumPlayed &&
                        "Medium",
                      item.hardPlayed &&
                        "Hard",
                    ]
                      .filter(Boolean)
                      .join(" • ");

                  return (
                    <li
                      key={
                        item.id || i
                      }
                      ref={
                        isYou
                          ? myRowRef
                          : null
                      }
                      className={`flex items-center p-3 rounded-xl border ${
                        isYou
                          ? "ring-2 ring-red-500 border-red-400 bg-red-50"
                          : i === 0
                          ? "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300"
                          : i === 1
                          ? "bg-gray-100 border-gray-200"
                          : i === 2
                          ? "bg-orange-50 border-orange-200"
                          : "bg-white border-emerald-100"
                      }`}
                    >

                      {/* RANK */}

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                          i === 0
                            ? "bg-amber-500 text-gray-900"
                            : i === 1
                            ? "bg-gray-400"
                            : i === 2
                            ? "bg-orange-600"
                            : "bg-emerald-700"
                        }`}
                      >
                        {i + 1}
                      </div>

                      {/* NAME */}

                      <div className="flex-1 min-w-0">

                        <div className="font-medium truncate">
                          {item.name}
                        </div>

                        <div className="text-xs text-gray-500">
                          {playedDifficulties ||
                            "-"}
                          {" • "}
                          {item.totalPoints ||
                            0}{" "}
                          Points
                        </div>

                      </div>

                      {/* POINTS + YOU */}

                      <div className="text-right flex items-center gap-2">

                        {isYou && (
                          <span className="text-[10px] font-bold text-red-600 border border-red-500 rounded px-1.5 py-0.5">
                            YOU
                          </span>
                        )}

                        <div className="font-bold text-emerald-700">
                          {item.totalPoints ||
                            0}{" "}
                          pts
                        </div>

                      </div>
                    </li>
                  );
                }
              )}
            </ul>

            <button
              onClick={() =>
                setScreen("start")
              }
              className="w-full py-3 rounded-xl border-2 border-emerald-700 text-emerald-700 font-medium hover:bg-emerald-700 hover:text-white transition"
            >
              ← Back to Home
            </button>
          </div>
        )}

        {/* ==================== FOOTER ==================== */}

        {screen === "start" && (
          <div className="text-center mt-6 text-white/70 text-sm">
            May Allah increase us in beneficial knowledge
            <br />

            <span className="text-xs opacity-80">
              Made by Zakii Shaikh
            </span>
          </div>
        )}
      </div>

      {/* ==================== CHEAT MODAL ==================== */}

      {showCheatModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

          <div className="bg-[#f8f5f0] rounded-2xl p-6 max-w-sm w-full text-center border-2 border-amber-300/40 shadow-2xl">

            <h3 className="font-serif text-xl text-emerald-800 mb-3">
              ⚠️ Do Not Cheat
            </h3>

            <p className="text-gray-600 text-sm mb-2 leading-relaxed">
              This quiz is for seeking knowledge, not for showing off.
              <br />
              <br />

              <strong>
                “Allah is with those who are honest.”
              </strong>

              <br />

              <span className="text-xs text-gray-500">
                (Based on Islamic teachings about honesty)
              </span>
            </p>

            <p className="text-red-600 font-semibold my-4">
              Play fairly. Allah is watching.
            </p>

            <button
              onClick={
                closeCheatModal
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold"
            >
              I Understand – Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* ==================== SCORE MODAL ==================== */}

      {showScoreModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

          <div className="bg-[#f8f5f0] rounded-2xl p-6 max-w-sm w-full text-center border-2 border-amber-300/40 shadow-2xl">

            <div className="font-serif text-xl text-emerald-800 mb-2">
              الْحَمْدُ لِلَّهِ
            </div>

            <h3 className="text-xl font-semibold text-emerald-800 mb-3">
              {resultMsg.message}
            </h3>

            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-700 to-emerald-600 flex flex-col items-center justify-center text-white mb-3">

              <div className="text-3xl font-bold leading-none">
                {score}
              </div>

              <div className="text-xs opacity-90">
                out of{" "}
                {questions.length}
              </div>
            </div>

            <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-4 py-1 rounded-full text-sm mb-3">
              +{pointsEarned} Points
            </div>

            <p className="font-medium mb-1">
              {resultMsg.sub}
            </p>

            <p className="text-gray-600 text-sm mb-3">
              JazakAllahu Khairan for playing!
            </p>

            <p className="text-gray-500 text-sm mb-5">
              Made with ❤️ by{" "}
              <strong className="text-emerald-700">
                Zakii Shaikh
              </strong>
            </p>

            <button
              onClick={() =>
                setShowScoreModal(
                  false
                )
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold"
            >
              See Results & Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* ==================== INFO MODAL ==================== */}

      {infoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

          <div className="bg-[#f8f5f0] rounded-2xl p-6 max-w-sm w-full text-center">

            <h3 className="font-serif text-xl text-emerald-800 mb-3">
              {infoModal.title}
            </h3>

            <p className="text-gray-600 mb-5">
              {infoModal.text}
            </p>

            <button
              onClick={() =>
                setInfoModal(null)
              }
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