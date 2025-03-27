const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ReviewComments from "./ReviewComments";

export default function ReviewDetails({ review, handleLikeReview, user, token }) {
  const [comments, setComments] = useState([]);
  const [writer, setWriter] = useState(null);
  const [likeIds, setLikeIds] = useState(review.likeIds || []);

  useEffect(() => {
    if (review) {
      fetch(`${BASE_URL}/api/reviews-comments/comments/review/${review.id}`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((error) => console.error("Error fetching comments:", error));

      fetch(`${BASE_URL}/api/reviews-comments/reviews/writer/${review.id}`)
        .then((res) => res.json())
        .then((data) => setWriter(data))
        .catch((error) => console.error("Error fetching writer info:", error));
    }
  }, [review]);

  const handleLocalLike = async () => {
    if (!user) return;
    await handleLikeReview(review.id);

    setLikeIds((prevLikes) => (prevLikes.includes(user.id) ? prevLikes.filter((id) => id !== user.id) : [...prevLikes, user.id]));
  };

  if (!writer) {
    return (
      <Card className="bg-background text-white mt-4 p-4">
        <CardHeader className="text-lg font-bold">Loading...</CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-muted text-foreground mt-4 p-4">
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Avatar>
              <AvatarImage src={writer.profileImage} alt={writer.name} />
              <AvatarFallback>{writer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-foreground text-sm font-medium">
                {writer.name} {writer.surname}
              </p>
              <p className="text-xs text-foreground">{writer.bio || "Biography not available"}</p>
            </div>
          </div>

          <p className="text-foreground mb-4">{review.content}</p>
          <p className="text-yellow-400 font-medium">⭐ {review.rating}</p>
        </CardContent>
      </Card>
      <ReviewComments reviewId={review.id} user={user} token={token} />
    </>
  );
}
