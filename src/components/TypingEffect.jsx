import { useEffect, useRef } from "react";
import anime from "animejs";

const TypingEffect = ({ text }) => {
  const textRef = useRef([]);

  useEffect(() => {
    if (!textRef.current.length) return;

    anime({
      targets: textRef.current.filter((el) => el !== null),
      opacity: [0, 1],
      translateX: [-10, 0],
      delay: anime.stagger(100),
      easing: "easeOutQuad",
      duration: 500
    });
  }, []);

  return (
    <div className="text-3xl font-bold">
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="mr-2">
          {word.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) textRef.current.push(el);
              }}
              className="inline-block opacity-0"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default TypingEffect;
