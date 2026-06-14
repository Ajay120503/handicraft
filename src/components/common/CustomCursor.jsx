import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";

const CustomCursor = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cursorRef = useRef(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      setIsVisible(true);

      const target = e.target;
      const interactive = target.closest(
        "a, button, [role='button'], input, select, textarea, label, .cursor-pointer, [data-cursor='pointer']"
      );
      setIsPointer(!!interactive);
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);
    const handleLeaveWindow = () => setIsVisible(false);
    const handleEnterWindow = () => setIsVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeaveWindow);
    document.addEventListener("mouseenter", handleEnterWindow);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeaveWindow);
      document.removeEventListener("mouseenter", handleEnterWindow);
    };
  }, []);

  if (!enabled) return null;

  const bladeColor = isDark ? "#f5f5f4" : "#1c1917";
  const handleFill = isDark ? "#3f3f46" : "#e7e5e4";
  const accentColor = isDark ? "#f0abfc" : "#db2777";

  // Open vs cut (closed) blade angles
  const bladeAngle = isClicking ? 0 : 9;
  const scale = isPointer ? 1.25 : 1;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ willChange: "transform" }}
    >
      <svg
        width="40"
        height="28"
        viewBox="0 0 40 28"
        fill="none"
        style={{
          transform: `translate(-4px, -8px) scale(${scale}) rotate(-28deg)`,
          transformOrigin: "10px 14px",
          transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: isDark
            ? "drop-shadow(0 1px 3px rgba(0,0,0,0.6))"
            : "drop-shadow(0 1px 3px rgba(0,0,0,0.25))",
        }}
      >
        {/* Upper blade + handle */}
        <g
          style={{
            transformOrigin: "11px 14px",
            transform: `rotate(${-bladeAngle}deg)`,
            transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <circle
            cx="5"
            cy="6"
            r="4"
            fill={handleFill}
            stroke={bladeColor}
            strokeWidth="1.5"
          />
          <path d="M8 9 L38 13.5 L20 14.5 Z" fill={bladeColor} />
        </g>

        {/* Lower blade + handle */}
        <g
          style={{
            transformOrigin: "11px 14px",
            transform: `rotate(${bladeAngle}deg)`,
            transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <circle
            cx="5"
            cy="22"
            r="4"
            fill={handleFill}
            stroke={bladeColor}
            strokeWidth="1.5"
          />
          <path d="M8 19 L38 14.5 L20 13.5 Z" fill={bladeColor} />
        </g>

        {/* Pivot point */}
        <circle cx="11" cy="14" r="1.6" fill={accentColor} />
      </svg>

      {/* Snip flash on click */}
      {isClicking && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: "0px",
            top: "0px",
            width: "6px",
            height: "6px",
            background: accentColor,
            animation: "cursor-snip 0.3s ease-out forwards",
          }}
        />
      )}
    </div>
  );
};

export default CustomCursor;

// import { useState, useEffect, useRef } from "react";
// import { useTheme } from "../../context/ThemeContext.jsx";

// const CustomCursor = () => {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const cursorRef = useRef(null);
//   const [isClicking, setIsClicking] = useState(false);
//   const [isPointer, setIsPointer] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [enabled, setEnabled] = useState(false);

//   useEffect(() => {
//     const isFinePointer = window.matchMedia("(pointer: fine)").matches;
//     if (!isFinePointer) return;

//     setEnabled(true);
//     document.documentElement.classList.add("custom-cursor-active");

//     const move = (e) => {
//       if (cursorRef.current) {
//         cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
//       }
//       setIsVisible(true);

//       const target = e.target;
//       const interactive = target.closest(
//         "a, button, [role='button'], input, select, textarea, label, .cursor-pointer, [data-cursor='pointer']"
//       );
//       setIsPointer(!!interactive);
//     };

//     const handleDown = () => setIsClicking(true);
//     const handleUp = () => setIsClicking(false);
//     const handleLeaveWindow = () => setIsVisible(false);
//     const handleEnterWindow = () => setIsVisible(true);

//     window.addEventListener("mousemove", move);
//     window.addEventListener("mousedown", handleDown);
//     window.addEventListener("mouseup", handleUp);
//     document.addEventListener("mouseleave", handleLeaveWindow);
//     document.addEventListener("mouseenter", handleEnterWindow);

//     return () => {
//       document.documentElement.classList.remove("custom-cursor-active");
//       window.removeEventListener("mousemove", move);
//       window.removeEventListener("mousedown", handleDown);
//       window.removeEventListener("mouseup", handleUp);
//       document.removeEventListener("mouseleave", handleLeaveWindow);
//       document.removeEventListener("mouseenter", handleEnterWindow);
//     };
//   }, []);

//   if (!enabled) return null;

//   const bladeColor = isDark ? "#f5f5f4" : "#1c1917";
//   const accentColor = isDark ? "#f0abfc" : "#db2777";

//   // Blade rotation: open by default, snaps shut on click
//   const blade1Rotation = isClicking ? -4 : -24;
//   const blade2Rotation = isClicking ? 4 : 24;
//   const scale = isPointer ? 1.25 : 1;

//   return (
//     <div
//       ref={cursorRef}
//       aria-hidden="true"
//       className={`pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-200 ${
//         isVisible ? "opacity-100" : "opacity-0"
//       }`}
//       style={{ willChange: "transform" }}
//     >
//       <svg
//         width="30"
//         height="30"
//         viewBox="0 0 24 24"
//         fill="none"
//         style={{
//           transform: `translate(-2px, -2px) scale(${scale}) rotate(-30deg)`,
//           transformOrigin: "12px 12px",
//           transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
//           filter: isDark
//             ? "drop-shadow(0 1px 3px rgba(0,0,0,0.6))"
//             : "drop-shadow(0 1px 3px rgba(0,0,0,0.25))",
//         }}
//       >
//         {/* Blade 1 + handle */}
//         <g
//           style={{
//             transformOrigin: "12px 12px",
//             transform: `rotate(${blade1Rotation}deg)`,
//             transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
//           }}
//         >
//           <circle cx="6" cy="6" r="2.6" stroke={bladeColor} strokeWidth="2" />
//           <path
//             d="M8.5 8.5 L20 20"
//             stroke={bladeColor}
//             strokeWidth="2"
//             strokeLinecap="round"
//           />
//         </g>

//         {/* Blade 2 + handle */}
//         <g
//           style={{
//             transformOrigin: "12px 12px",
//             transform: `rotate(${blade2Rotation}deg)`,
//             transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
//           }}
//         >
//           <circle cx="6" cy="18" r="2.6" stroke={bladeColor} strokeWidth="2" />
//           <path
//             d="M8.5 15.5 L20 4"
//             stroke={bladeColor}
//             strokeWidth="2"
//             strokeLinecap="round"
//           />
//         </g>

//         {/* Pivot point */}
//         <circle cx="12" cy="12" r="1.4" fill={accentColor} />
//       </svg>

//       {/* Snip flash on click */}
//       {isClicking && (
//         <span
//           className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
//           style={{
//             left: "10px",
//             top: "10px",
//             width: "6px",
//             height: "6px",
//             background: accentColor,
//             animation: "cursor-snip 0.3s ease-out forwards",
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default CustomCursor;
