import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchWithAuth } from "../utils/api";
import { Trash, Pencil, Heart, HeartOff } from "lucide-react";

export default function ReviewComments({ reviewId, user, token }) {
  const [comments, setComments] = useState([]);
  const [likedComments, setLikedComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    if (!reviewId || !user) return;

    const fetchCommentsAndLikes = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reviews-comments/comments/review/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        const newLikedComments = {};
        await Promise.all(
          data.map(async (comment) => {
            try {
              const likeResponse = await fetch(`http://localhost:8080/api/reviews-comments/comments/${comment.id}/isLiked?userId=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const isLiked = await likeResponse.json();
              newLikedComments[comment.id] = isLiked;
            } catch {
              newLikedComments[comment.id] = false;
            }
          })
        );

        setComments(data);
        setLikedComments(newLikedComments);
      } catch (error) {
        console.error("❌ Error receiving comments:", error);
      }
    };

    fetchCommentsAndLikes();
  }, [reviewId, user]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return alert("The comment text cannot be empty!");

    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/reviews-comments/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reviewId, userId: user.id, content: newComment })
      });

      if (response.ok) {
        const newAddedComment = await response.json();
        setComments([...comments, newAddedComment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("❌ Error sending comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user || !token) return alert("Log in first to delete!");

    try {
      const response = await fetch(`http://localhost:8080/api/reviews-comments/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        setLikedComments((prev) => {
          const updatedLikes = { ...prev };
          delete updatedLikes[commentId];
          return updatedLikes;
        });
      } else {
        console.error("❌ Error deleting comment:", await response.text());
      }
    } catch (error) {
      console.error("❌ Error deleting comment:", error);
    }
  };

  const toggleLikeComment = async (commentId) => {
    if (!user || !token) return alert("Log in first to like!");

    try {
      console.log("⏳ Get comment likes...");
      const responseLikes = await fetch(`http://localhost:8080/api/reviews-comments/comments/${commentId}/likes`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!responseLikes.ok) throw new Error("Error receiving comment likes!");
      const likeData = await responseLikes.json();
      console.log("📌 List of likes received:", likeData);

      const likeObject = likeData.find((like) => like.userId === user.id);
      const isLiked = !!likeObject;
      console.log("isLiked:", isLiked);

      if (isLiked) {
        const likeId = likeObject.id;
        console.log(`🗑 Send a request to remove likes with ID:`, likeId);

        const responseUnlike = await fetch(`http://localhost:8080/api/reviews-comments/comments/likes/${likeId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (responseUnlike.ok) {
          console.log("✅ Like successfully deleted!");
          setLikedComments((prev) => ({ ...prev, [commentId]: false }));

          const updatedLikesResponse = await fetch(`http://localhost:8080/api/reviews-comments/comments/${commentId}/likes`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!updatedLikesResponse.ok) throw new Error("Error getting new likes!");

          const updatedComment = await updatedLikesResponse.json();
          console.log("🔄 Number of new likes:", updatedComment.likes);

          setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, likes: updatedComment.likes } : comment)));
        } else {
          console.error("❌ Error deleting likes!", responseUnlike.status);
        }
      } else {
        console.log("⏳ Send a request for likes...");

        const responseLike = await fetch(`http://localhost:8080/api/reviews-comments/comments/${commentId}/like?userId=${user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.id })
        });

        if (responseLike.ok) {
          console.log("✅ Like successfully registered!");
          setLikedComments((prev) => ({ ...prev, [commentId]: true }));

          const updatedLikesResponse = await fetch(`http://localhost:8080/api/reviews-comments/comments/${commentId}/likes`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!updatedLikesResponse.ok) throw new Error("Error getting new likes!");

          const updatedComment = await updatedLikesResponse.json();
          console.log("🔄 Number of new likes:", updatedComment.likes);

          setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, likes: updatedComment.likes } : comment)));
        } else {
          console.error("❌Error registering likes!", responseLike.status);
        }
      }
    } catch (error) {
      console.error("❌ Error in like management:", error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!user || !token) return alert("Log in first to edit a comment!");

    try {
      const response = await fetch(`http://localhost:8080/api/reviews-comments/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newContent })
      });

      if (response.ok) {
        setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, content: newContent } : comment)));
      }
    } catch (error) {
      console.error("❌ Error editing comment:", error);
    }
  };

  return (
    <Card className="bg-muted text-foreground mt-4 p-4">
      <CardContent>
        <h4 className="text-foreground text-lg font-semibold">💬 Users comments</h4>

        {user ? (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-card text-foreground p-2 rounded-lg "
            />
            <Button onClick={handleAddComment} className="bg-blue-500 text-white px-4">
              Send
            </Button>
          </div>
        ) : (
          <p className="text-foreground">To write a comment, please log in.</p>
        )}

        <ScrollArea className="h-full space-y-2 mt-2">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="p-2 m-1 bg-card rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={comment.profileImage} alt={comment.username} />
                    <AvatarFallback>{comment.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground text-sm font-medium">{comment.username}</p>
                  </div>
                </div>
                <p className="text-foreground my-2">{comment.content}</p>

                <div className="flex items-center gap-2 mt-2">
                  {comment.userId === user.id && (
                    <Button
                      onClick={() => {
                        setEditingComment(comment.id);
                        setEditedContent(comment.content);
                      }}
                      variant="ghost"
                      size="icon"
                      className="hover:text-yellow-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}

                  <button
                    onClick={() => toggleLikeComment(comment.id)}
                    className="cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110"
                    style={{ color: likedComments[comment.id] ? "red" : "gray" }}
                  >
                    {likedComments[comment.id] ? <Heart className="w-5 h-5 text-red-500 fill-red-500" /> : <Heart className="w-5 h-5 text-gray-400" />}
                  </button>

                  {comment.userId === user.id && (
                    <Button onClick={() => handleDeleteComment(comment.id)} variant="ghost" size="icon" className="hover:text-red-500">
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-foreground">No comments have been posted.</p>
          )}
          {editingComment !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center round-lg">
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md w-[90%] max-w-md">
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Edit Comment</h3>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-24 p-2 border rounded text-black dark:text-white dark:bg-gray-700"
                />
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingComment(null);
                      setEditedContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await handleEditComment(editingComment, editedContent);
                      setEditingComment(null);
                      setEditedContent("");
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
