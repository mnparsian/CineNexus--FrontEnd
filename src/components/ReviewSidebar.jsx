const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect } from "react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReviewDetails from "./ReviewDetails";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
export default function ReviewSidebar({ open, setOpen, reviews, fetchReviews, movieId, setReviews }) {
  /* const [open, setOpen] = useState(false); */
  const [selectedReview, setSelectedReview] = useState(null);
  const [writers, setWriters] = useState({});
  const [openDetails, setOpenDetails] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const isLikedByUser = (review) => review.likeIds.includes(user.id);

  useEffect(() => {
    const fetchWriters = async () => {
      const fetchedWriters = {};
      await Promise.all(
        reviews.map(async (review) => {
          const res = await fetch(`${BASE_URL}/api/reviews-comments/reviews/writer/${review.id}`);
          const writer = await res.json();
          fetchedWriters[review.id] = writer;
        })
      );
      setWriters(fetchedWriters);
    };

    if (reviews.length > 0) fetchWriters();
  }, [reviews]);

  const handleSubmitReview = async () => {
    if (!user || !token) return alert("Log in first to post a review!");

    const response = await fetch(`${BASE_URL}/api/reviews-comments/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user.id,
        mediaId: id,
        content: reviewText,
        rating: rating,
        movieId: movieId
      })
    });

    if (response.ok) {
      alert("Your review has been sent!");
      setReviewText("");
      fetchReviews();
    } else {
      alert("Error sending review");
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!user || !token) return alert("Log in first to like/dislike!");

    try {
      console.log("⏳Get Reviwes likes...");
      const responseLikes = await fetch(`${BASE_URL}/api/reviews-comments/reviews/like/${reviewId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!responseLikes.ok) throw new Error("Error receiving Reviwe likes!");
      const likeData = await responseLikes.json();
      console.log("📌 List of likes received:", likeData);

      const likeObject = likeData.find((like) => like.userId === user.id);
      const isLiked = !!likeObject;
      console.log("isLiked:", isLiked);

      if (isLiked) {
        const likeId = likeObject.id;
        console.log(`🗑 Send a request to remove likes with ID:`, likeId);

        const responseUnlike = await fetch(`${BASE_URL}/api/reviews-comments/reviews/likes/${likeId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (responseUnlike.ok) {
          console.log("✅ Like successfully deleted!");
          setReviews((prevReviews) =>
            prevReviews.map((review) => (review.id === reviewId ? { ...review, likeIds: review.likeIds.filter((id) => id !== user.id) } : review))
          );
        } else {
          console.error("❌ Error deleting likes!", responseUnlike.status);
        }
      } else {
        console.log("⏳ Send a request for likes...");

        const responseLike = await fetch(`${BASE_URL}/api/reviews-comments/reviews/${reviewId}/like?userId=${user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.id })
        });

        if (responseLike.ok) {
          console.log("✅ Like successfully registered!");
          setReviews((prevReviews) => prevReviews.map((review) => (review.id === reviewId ? { ...review, likeIds: [...review.likeIds, user.id] } : review)));
        } else {
          console.error("❌ Error registering likes!", responseLike.status);
        }
      }
    } catch (error) {
      console.error("❌ Error in like management:", error);
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      {/*   <DrawerTrigger asChild>
        <Button variant="outline" className="fixed top-30 right-5 z-50">
          Reviews 📄
        </Button>
      </DrawerTrigger> */}
      <DrawerContent className="bg-background text-foreground w-full sm:w-[450px] lg:w-[600px] p-4">
        <h3 className="text-lg text-foreground font-bold mb-4">User's Reviews </h3>

        {user ? (
          <div className="mb-4">
            <textarea
              className="w-full p-2 bg-muted text-foreground rounded"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full mt-2 p-2 bg-muted text-foreground rounded"
            />
            <Button onClick={handleSubmitReview} className="mt-2 w-full bg-accent text-accent-foreground hover:bg-muted/50">
              Submit review
            </Button>
          </div>
        ) : (
          <p className="text-foreground">To write a review, please log in.</p>
        )}

        <ScrollArea className="h-full space-y-2">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-3 m-2 bg-muted text-foreground rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${review.userId}`}>
                    <Avatar>
                      <AvatarImage src={writers[review.id]?.profileImage || "/fallback-profile.jpg"} />
                      <AvatarFallback>{writers[review.id]?.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div onClick={() => setSelectedReview(review)} className="cursor-pointer">
                    <p className="text-foreground text-sm font-medium">
                      {writers[review.id]?.name} {writers[review.id]?.surname}
                    </p>
                    <p className="text-yellow-400 text-xs">⭐ {review.rating}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">Likes {review.likeIds?.length || 0}</span>
                  <LikeButton review={review} user={user} onToggle={() => handleLikeReview(review.id)} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-foreground">No reviews have been posted.</p>
          )}
        </ScrollArea>

        <Sheet open={selectedReview !== null} onOpenChange={() => setSelectedReview(null)}>
          <SheetContent side="right" className="bg-background review-details-wide">
            {selectedReview && <ReviewDetails review={selectedReview} handleLikeReview={handleLikeReview} user={user} token={token} />}
          </SheetContent>
        </Sheet>
      </DrawerContent>
    </Drawer>
  );
}
