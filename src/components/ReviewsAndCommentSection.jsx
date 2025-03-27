import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews, fetchReviewLikes, fetchReviewComments, editReview, deleteReview } from "../features/reviewsSlice";

const ReviewAndCommentSection = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const reviews = useSelector((state) => state.reviews.items);
  const likes = useSelector((state) => state.reviews.likes);
  const commentsCount = useSelector((state) => state.reviews.commentsCount);
  const [editingReview, setEditingReview] = useState(null);
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(0);
  const textAreaRef = useRef(null);
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [newText]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserReviews(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (reviews.length > 0) {
      reviews.forEach((review) => {
        dispatch(fetchReviewLikes(review.id));
        dispatch(fetchReviewComments(review.id));
      });
    }
  }, [dispatch, reviews.length]);

  const handleEdit = (review) => {
    setEditingReview(review.id);
    setNewText(review.content);
    setNewRating(review.rating);
  };

  const handleSaveEdit = (reviewId) => {
    dispatch(
      editReview({
        reviewId,
        updatedText: newText,
        updatedRating: newRating
      })
    ).then(() => {
      setEditingReview(null);
    });
  };

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">📝 Your Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="bg-background p-4 rounded-lg mb-4 shadow-md h-full flex flex-col md:flex-row">
          <img
            src={`https://image.tmdb.org/t/p/w500${review.mediaPosterUrl}`}
            alt="Profile"
            className="w-28 h-40 rounded-sm border border-gray-600 mb-4 md:mb-0 md:me-4"
          />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{review.mediaTitle}</h3>
            <p className="text-yellow-500 font-bold mt-2">⭐ {review.rating.toFixed(1)}</p>
            <p>
              👍 {review.likeIds?.length} | 💬 {commentsCount[review.id] || 0}
            </p>

            {editingReview === review.id ? (
              <>
                <textarea
                  ref={textAreaRef}
                  className="w-full min-h-[60px] p-2 mt-2 rounded-md bg-muted text-foreground resize-none"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                <input
                  type="number"
                  className="w-full p-2 mt-2 rounded-md bg-muted text-foreground"
                  value={newRating}
                  onChange={(e) => setNewRating(parseFloat(e.target.value))}
                  min="0"
                  max="10"
                  step="0.1"
                />
                <div className="mt-2 flex gap-2">
                  <button className="px-4 py-2 bg-green-500 text-foreground rounded-md" onClick={() => handleSaveEdit(review.id)}>
                    💾 Save
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-foreground rounded-md" onClick={() => setEditingReview(null)}>
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-foreground font-bold mt-2">{review.content}</p>
                <div className="mt-2 flex gap-4">
                  <button className="px-4 py-2 bg-blue-500 text-foreground rounded-md" onClick={() => handleEdit(review)}>
                    ✏ Edit
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-foreground rounded-md" onClick={() => handleDelete(review.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewAndCommentSection;
