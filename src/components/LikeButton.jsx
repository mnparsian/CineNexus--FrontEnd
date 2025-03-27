import { useEffect, useRef, useState } from "react";
import anime from "animejs";

const LikeButton = ({ review, user, onToggle }) => {
  const heartRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (user && Array.isArray(review?.likeIds)) {
      const liked = review.likeIds.includes(user.id);
      console.log("Review.LikeIds:", review.likeIds);
      console.log("Liked (calculated):", liked);
      setIsLiked(liked);
      setLikeCount(review.likeIds.length);
    }
  }, [JSON.stringify(review?.likeIds), user?.id]);

  const handleClick = () => {
    if (!user) return;

    anime({
      targets: heartRef.current,
      scale: [1, 1.4, 1],
      duration: 300,
      easing: "easeInOutQuad"
    });

    const willBeLiked = !isLiked;

    setIsLiked(willBeLiked);
    setLikeCount((prev) => (willBeLiked ? prev + 1 : Math.max(prev - 1, 0)));

    onToggle();
  };

  return (
    <button onClick={handleClick} className="flex items-center gap-1 text-lg transition-all">
      <span ref={heartRef} className={`text-xl transition-all ${isLiked ? "text-red-500" : "text-gray-400"}`}>
        {isLiked ? "❤️" : "🤍"}
      </span>
    </button>
  );
};

export default LikeButton;
