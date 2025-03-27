import { useEffect, useRef } from "react";
import anime from "animejs";

const SplitText = ({ text }) => {
  const textRef = useRef(new Array(text.length).fill(null));

  useEffect(() => {
    if (!textRef.current.length) return;

    anime({
      targets: textRef.current.filter((el) => el !== null),
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(50),
      easing: "easeOutQuad",
      duration: 800
    });
  }, []);

  const scatterEffect = (event, index) => {
    const { clientX, clientY } = event;
    const rect = textRef.current[index]?.getBoundingClientRect();

    if (!rect) return;

    const dx = rect.left + rect.width / 2 - clientX;
    const dy = rect.top + rect.height / 2 - clientY;

    anime({
      targets: textRef.current[index],
      translateX: [0, dx * 0.4],
      translateY: [0, dy * 0.4],
      rotate: [(Math.random() - 0.5) * 30],
      easing: "easeOutExpo",
      duration: 300,
      complete: () => {
        anime({
          targets: textRef.current[index],
          translateX: 0,
          translateY: 0,
          rotate: 0,
          easing: "easeOutExpo",
          duration: 500
        });
      }
    });
  };

  return (
    <div className="text-xl font-hero w-full">
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="mr-2">
          {word.split("").map((char, i) => (
            <span
              key={`${wordIndex}-${i}`}
              ref={(el) => {
                if (el) textRef.current[wordIndex * 10 + i] = el;
              }}
              onMouseEnter={(event) => scatterEffect(event, wordIndex * 10 + i)}
              className="inline-block opacity-0 cursor-pointer"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
