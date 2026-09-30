// import { useEffect } from "react";

// export default function IntroAnimation({ onComplete }) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onComplete();
//     }, 4500);

//     return () => clearTimeout(timer);
//   }, [onComplete]);

//   const particles = Array.from({ length: 22 });

//   return (
//     <div className="intro-screen">

//       {/* Background */}
//       <div className="intro-bg" />

//       {/* Islamic geometric pattern */}
//       <div className="geometric-pattern" />

//       {/* Soft ambient glow */}
//       <div className="ambient-glow glow-one" />
//       <div className="ambient-glow glow-two" />

//       {/* Floating particles */}
//       <div className="particles">
//         {particles.map((_, index) => (
//           <span
//             key={index}
//             className="particle"
//             style={{
//               "--x": `${Math.random() * 100}%`,
//               "--delay": `${Math.random() * 3}s`,
//               "--duration": `${3 + Math.random() * 3}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Main content */}
//       <div className="intro-content">

//         {/* Crescent */}
//         <div className="crescent-wrapper">
//           <div className="crescent">
//             <div className="crescent-cut" />
//           </div>

//           <div className="crescent-ring" />
//         </div>

//         {/* Small top label */}
//         <div className="intro-label">
//           <span />
//           KNOWLEDGE • FAITH • HISTORY
//           <span />
//         </div>

//         {/* Main title */}
//         <div className="title-wrapper">
//           <h1>ISLAMIC QUIZ</h1>
//           <div className="gold-sweep" />
//         </div>

//         {/* Subtitle */}
//         <p className="intro-subtitle">
//           Test Your Knowledge
//         </p>

//         {/* Bottom line */}
//         <div className="intro-line">
//           <div />
//         </div>

//       </div>

//       {/* Cinematic fade */}
//       <div className="intro-fade" />

//       <style>{`

//         /* =========================
//            MAIN SCREEN
//         ========================= */

//         .intro-screen {
//           position: fixed;
//           inset: 0;
//           z-index: 99999;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #050b14;
//           animation: screenExit 4.5s ease-in-out forwards;
//         }

//         .intro-bg {
//           position: absolute;
//           inset: 0;

//           background:
//             radial-gradient(
//               circle at 50% 45%,
//               rgba(17, 75, 64, 0.35),
//               transparent 38%
//             ),
//             radial-gradient(
//               circle at 50% 100%,
//               rgba(190, 145, 45, 0.08),
//               transparent 45%
//             ),
//             linear-gradient(
//               135deg,
//               #030812 0%,
//               #07131f 50%,
//               #030812 100%
//             );
//         }


//         /* =========================
//            GEOMETRIC PATTERN
//         ========================= */

//         .geometric-pattern {
//           position: absolute;
//           width: 700px;
//           height: 700px;
//           border-radius: 50%;

//           background-image:
//             linear-gradient(
//               45deg,
//               transparent 47%,
//               rgba(212, 175, 55, 0.06) 48%,
//               rgba(212, 175, 55, 0.06) 52%,
//               transparent 53%
//             ),
//             linear-gradient(
//               -45deg,
//               transparent 47%,
//               rgba(212, 175, 55, 0.06) 48%,
//               rgba(212, 175, 55, 0.06) 52%,
//               transparent 53%
//             );

//           background-size: 70px 70px;

//           opacity: 0;

//           animation:
//             patternIn 1.8s ease-out 0.1s forwards,
//             patternRotate 20s linear infinite;
//         }


//         /* =========================
//            GLOW
//         ========================= */

//         .ambient-glow {
//           position: absolute;
//           border-radius: 50%;
//           filter: blur(90px);
//           pointer-events: none;
//         }

//         .glow-one {
//           width: 250px;
//           height: 250px;
//           background: rgba(20, 130, 105, 0.18);
//           animation: glowPulse 4s ease-in-out infinite;
//         }

//         .glow-two {
//           width: 180px;
//           height: 180px;
//           background: rgba(218, 169, 54, 0.12);
//           transform: translateY(100px);
//           animation: glowPulse 4s ease-in-out 1s infinite;
//         }


//         /* =========================
//            PARTICLES
//         ========================= */

//         .particles {
//           position: absolute;
//           inset: 0;
//           pointer-events: none;
//         }

//         .particle {
//           position: absolute;
//           left: var(--x);
//           bottom: -10px;

//           width: 2px;
//           height: 2px;

//           border-radius: 50%;

//           background: #d9b44a;

//           box-shadow:
//             0 0 6px rgba(218, 180, 74, 0.8);

//           opacity: 0;

//           animation:
//             particleFloat var(--duration) ease-in-out
//             var(--delay) infinite;
//         }


//         /* =========================
//            CONTENT
//         ========================= */

//         .intro-content {
//           position: relative;
//           z-index: 10;

//           display: flex;
//           flex-direction: column;
//           align-items: center;

//           text-align: center;

//           transform: translateY(10px);

//           animation: contentIn 1.2s ease-out 0.1s forwards;
//         }


//         /* =========================
//            CRESCENT
//         ========================= */

//         .crescent-wrapper {
//           position: relative;

//           width: 100px;
//           height: 100px;

//           margin-bottom: 30px;

//           opacity: 0;

//           animation: crescentIn 1.2s cubic-bezier(.16,1,.3,1)
//             0.2s forwards;
//         }

//         .crescent {
//           position: absolute;

//           width: 76px;
//           height: 76px;

//           left: 12px;
//           top: 8px;

//           border-radius: 50%;

//           background:
//             linear-gradient(
//               135deg,
//               #fff3b0,
//               #e0b84f 45%,
//               #a87916
//             );

//           box-shadow:
//             0 0 20px rgba(226, 185, 72, 0.35),
//             0 0 55px rgba(226, 185, 72, 0.12);
//         }

//         .crescent-cut {
//           position: absolute;

//           width: 70px;
//           height: 70px;

//           left: 21px;
//           top: 1px;

//           border-radius: 50%;

//           background: #07131f;
//         }

//         .crescent-ring {
//           position: absolute;
//           inset: 0;

//           border-radius: 50%;

//           border: 1px solid rgba(220, 180, 70, 0.15);

//           animation: ringPulse 2.5s ease-in-out infinite;
//         }


//         /* =========================
//            LABEL
//         ========================= */

//         .intro-label {
//           display: flex;
//           align-items: center;
//           gap: 12px;

//           color: rgba(220, 190, 110, 0.8);

//           font-size: 9px;
//           font-weight: 500;

//           letter-spacing: 0.35em;

//           margin-bottom: 15px;

//           opacity: 0;

//           animation: labelIn 1s ease-out 1.1s forwards;
//         }

//         .intro-label span {
//           width: 24px;
//           height: 1px;

//           background: rgba(220, 180, 70, 0.5);
//         }


//         /* =========================
//            TITLE
//         ========================= */

//         .title-wrapper {
//           position: relative;

//           overflow: hidden;
//         }

//         .title-wrapper h1 {
//           margin: 0;

//           color: #ffffff;

//           font-size: clamp(2.3rem, 7vw, 5rem);

//           font-weight: 700;

//           letter-spacing: 0.18em;

//           line-height: 1;

//           text-shadow:
//             0 0 25px rgba(255, 255, 255, 0.08);

//           opacity: 0;

//           animation:
//             titleIn 1.1s cubic-bezier(.16,1,.3,1)
//             1.2s forwards;
//         }


//         /* =========================
//            GOLD LIGHT SWEEP
//         ========================= */

//         .gold-sweep {
//           position: absolute;

//           top: 0;
//           bottom: 0;

//           left: -30%;

//           width: 20%;

//           transform: skewX(-20deg);

//           background:
//             linear-gradient(
//               90deg,
//               transparent,
//               rgba(255, 239, 170, 0.75),
//               transparent
//             );

//           filter: blur(5px);

//           animation: sweep 1.3s ease-in-out 2.1s forwards;
//         }


//         /* =========================
//            SUBTITLE
//         ========================= */

//         .intro-subtitle {
//           margin: 18px 0 0;

//           color: rgba(255, 255, 255, 0.62);

//           font-size: 13px;

//           letter-spacing: 0.28em;

//           text-transform: uppercase;

//           opacity: 0;

//           animation:
//             subtitleIn 1s ease-out 1.9s forwards;
//         }


//         /* =========================
//            LINE
//         ========================= */

//         .intro-line {
//           margin-top: 28px;

//           width: 0;

//           height: 1px;

//           background:
//             linear-gradient(
//               90deg,
//               transparent,
//               rgba(214, 174, 61, 0.8),
//               transparent
//             );

//           animation: lineIn 1s ease-out 2.3s forwards;
//         }


//         /* =========================
//            FADE
//         ========================= */

//         .intro-fade {
//           position: absolute;
//           inset: 0;

//           background: #030812;

//           pointer-events: none;

//           opacity: 0;

//           animation: finalFade 0.8s ease-in 3.8s forwards;
//         }


//         /* =========================
//            ANIMATIONS
//         ========================= */

//         @keyframes contentIn {
//           from {
//             opacity: 0;
//             transform: translateY(25px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes crescentIn {
//           from {
//             opacity: 0;
//             transform: scale(0.4) rotate(-25deg);
//           }

//           to {
//             opacity: 1;
//             transform: scale(1) rotate(0);
//           }
//         }

//         @keyframes labelIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes titleIn {
//           from {
//             opacity: 0;
//             transform: translateY(35px) scale(0.94);
//             letter-spacing: 0.4em;
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//             letter-spacing: 0.18em;
//           }
//         }

//         @keyframes subtitleIn {
//           from {
//             opacity: 0;
//             transform: translateY(12px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes lineIn {
//           from {
//             width: 0;
//           }

//           to {
//             width: 190px;
//           }
//         }

//         @keyframes sweep {
//           from {
//             left: -30%;
//           }

//           to {
//             left: 130%;
//           }
//         }

//         @keyframes patternIn {
//           from {
//             opacity: 0;
//             transform: scale(0.7);
//           }

//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         @keyframes patternRotate {
//           from {
//             rotate: 0deg;
//           }

//           to {
//             rotate: 360deg;
//           }
//         }

//         @keyframes glowPulse {
//           0%, 100% {
//             transform: scale(0.9);
//             opacity: 0.5;
//           }

//           50% {
//             transform: scale(1.1);
//             opacity: 0.9;
//           }
//         }

//         @keyframes ringPulse {
//           0%, 100% {
//             transform: scale(0.95);
//             opacity: 0.3;
//           }

//           50% {
//             transform: scale(1.12);
//             opacity: 0.8;
//           }
//         }

//         @keyframes particleFloat {
//           0% {
//             opacity: 0;
//             transform: translateY(0) scale(0.5);
//           }

//           20% {
//             opacity: 0.8;
//           }

//           80% {
//             opacity: 0.5;
//           }

//           100% {
//             opacity: 0;
//             transform: translateY(-100vh) scale(1);
//           }
//         }

//         @keyframes finalFade {
//           from {
//             opacity: 0;
//           }

//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes screenExit {
//           0%, 85% {
//             opacity: 1;
//           }

//           100% {
//             opacity: 0;
//             pointer-events: none;
//           }
//         }


//         /* =========================
//            MOBILE
//         ========================= */

//         @media (max-width: 640px) {

//           .geometric-pattern {
//             width: 450px;
//             height: 450px;
//             background-size: 45px 45px;
//           }

//           .crescent-wrapper {
//             transform: scale(0.85);
//             margin-bottom: 20px;
//           }

//           .intro-label {
//             font-size: 7px;
//             letter-spacing: 0.25em;
//           }

//           .intro-subtitle {
//             font-size: 10px;
//             letter-spacing: 0.2em;
//           }

//           .intro-line {
//             margin-top: 22px;
//           }

//         }

//       `}</style>
//     </div>
//   );
// }