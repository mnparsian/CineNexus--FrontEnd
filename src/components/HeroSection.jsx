import SplitText from "./SplitText";
import TypingEffect from "./TypingEffect";
export default function HeroSection() {
  return (
    <>
      <div className=" -full text-center py-20 flex flex-col gap-4 sm:gap-6 items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-bold font-hero   text-center text-foreground drop-shadow-lg animate-fade-in-up">CineNexus</h1>
        <div className="text-lg text-foreground mt-4 max-w-3xl mx-auto animate-fade-in-up delay-200">
          {/* A place for movie and series lovers, to review, suggest, and share cinematic experiences 🎥✨ */}
          <SplitText text="A place for movie and series lovers, to review, suggest, and share cinematic experiences" className="text-sm sm:text-lg" />
        </div>
      </div>
    </>
  );
}
