import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../features/reviewsSlice";
import { fetchFavorites } from "../features/favoriteSlice";
import { fetchWatchlist } from "../features/watchlistSlice";
import { fetchUserFriends } from "../features/publicProfileSlice";
import { fetchUserProfile } from "../features/publicProfileSlice";
import { fetchLoggedInUserFriends } from "../features/publicProfileSlice";
import { setFriendId } from "../features/chatSlice";
import { useParams } from "react-router-dom";
import { FaFilm, FaStar, FaUserFriends } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import MessageSection from "../components/MessageSection";
import { sendFriendRequest } from "@/features/friendsSlice";
import Navbar from "@/components/Navbar";
import { LucideBarChart2, LucideClock, LucideFileBarChart2, LucideLock } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { FaHeart } from "react-icons/fa";
import AuthSide from "../components/AuthSide";
import { logout } from "@/features/authSlice";
import { toast } from "sonner";

const PublicProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { items: reviews } = useSelector((state) => state.reviews);
  const { items: favorites } = useSelector((state) => state.favorites);
  const { items: watchlist } = useSelector((state) => state.watchlist);
  const { user, friends, loggedInUserFriends, status, error } = useSelector((state) => state.publicProfile);

  const [authOpen, setAuthOpen] = useState(false);
  const [defaultToLogin, setDefaultToLogin] = useState(true);

  const loggedInUserId = useSelector((state) => state.auth.user?.id);
  const authUser = useSelector((state) => state.auth.user);
  const isFriend = friends?.some((friend) => friend.userId === loggedInUserId);

  const watchedCount = watchlist.filter((item) => item.statusId === 3).length;
  const reviewCount = reviews.length;
  const favoriteCount = favorites.length;
  const friendCount = friends.length;

  const friendshipStatus = (() => {
    if (!user || !loggedInUserId) return "NOT_FRIEND";

    const isFriend = friends?.some((f) => f.userId === loggedInUserId) || loggedInUserFriends?.some((f) => f.userId === user.id);
    const isPending =
      friends?.some((f) => f.userId === loggedInUserId && f.requestStatus === "PENDING") ||
      loggedInUserFriends?.some((f) => f.userId === user.id && f.requestStatus === "PENDING");

    if (isPending) return "PENDING";
    if (isFriend) return "FRIEND";

    return "NOT_FRIEND";
  })();

  console.log("LogedIn User Id:", loggedInUserId);
  console.log("is Friend:", isFriend);

  console.log("🔍 Current Profile User ID:", userId);
  const navigate = useNavigate();
  const handleSendFriendRequest = async () => {
    if (loggedInUserId && user.id) {
      await dispatch(sendFriendRequest({ userId: loggedInUserId, friendId: user.id }));

      dispatch(fetchUserFriends(user.id));
    }
  };
  useEffect(() => {
    console.log("🔍 Friends Data in Redux:", friends);
  }, [friends]);
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserReviews(userId));
      dispatch(fetchFavorites(userId));
      dispatch(fetchWatchlist(userId));
      dispatch(fetchUserFriends(userId));
      dispatch(fetchUserProfile(userId));
      dispatch(fetchLoggedInUserFriends(loggedInUserId));
    }
  }, [userId, loggedInUserId, dispatch]);

  useEffect(() => {
    console.log("Updated Friends:", friends);
    console.log("Updated user", user);
  }, [friends, user]);

  const activities = [
    ...reviews.map((r) => ({
      type: "review",
      text: `wrote a review for "${r.mediaTitle}"`,
      date: r.createdAt
    })),
    ...watchlist.map((w) => ({
      type: "watchlist",
      text: `added "${w.title}" to Watchlist`,
      date: w.updatedAt
    })),
    ...favorites.map((f) => ({
      type: "favorite",
      text: `favorited "${f.title}"`,
      date: f.createdAt
    }))
  ];

  const recentActivities = activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const handleLogout = () => {
    dispatch(logout());
    toast("You are logged out.");
    navigate("/");
  };
  return (
    <div className="w-full min-h-screen bg-background text-foreground px-4 py-6 mt-14">
      <Navbar
        authUser={authUser}
        onLogout={handleLogout}
        onLoginClick={() => {
          setDefaultToLogin(true);
          setAuthOpen(true);
        }}
        onSignupClick={() => {
          setDefaultToLogin(false);
          setAuthOpen(true);
        }}
      />
      <AuthSide open={authOpen} setOpen={setAuthOpen} defaultToLogin={defaultToLogin} />

      <div className=" flex flex-col md:flex-row items-center justify-between gap-6 bg-muted rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-6">
          <Avatar className="w-45 h-45">
            <AvatarImage src={user?.profileImage || ""} alt="profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {user?.name} {user?.surname}
            </h2>
            <p className="text-muted-foreground">@{user?.username}</p>
            <p className="text-sm mt-2 max-w-xs">{user?.bio}</p>
          </div>
        </div>
        <div className="flex gap-4">
          {friendshipStatus === "FRIEND" && (
            <Button variant="default" onClick={() => dispatch(setFriendId(user.id))} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Message
            </Button>
          )}

          {friendshipStatus === "PENDING" && (
            <Button variant="secondary" disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg">
              Pending Request...
            </Button>
          )}

          {friendshipStatus === "NOT_FRIEND" && (
            <Button variant="secondary" className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSendFriendRequest}>
              Add Friend
            </Button>
          )}
        </div>
      </div>

      {/* دکمه‌های باز کردن Sheet */}
      <div className="flex justify-center mt-8 gap-4 flex-wrap">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FaStar /> Favorites
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex gap-4 flex-wrap justify-center mt-4 bg-transparent border-0">
            <SheetHeader>
              <SheetTitle>Favorite Movies</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Carousel className="flex flex-wrap justify-center gap-4 px-4">
                <CarouselContent /* className="flex gap-4 transition-transform duration-100 ease-in-out" */>
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">This user hasn’t any favorite movie.</p>
                  ) : (
                    favorites.map((movie) => (
                      <CarouselItem key={movie.id} className="flex-1 min-w-[160px] sm:min-w-[180px] md:min-w-[200px] max-w-[250px] basis-[calc(100%/auto)]">
                        <div
                          className="flex flex-col items-center justify-center rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.05] hover:shadow-2xl group"
                          onClick={() => navigate(`/movie/${movie.mediaId}`)}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w200${movie.posterUrl}`}
                            alt={movie.title}
                            className="rounded-lg shadow-lg hover:scale-105 transition-transform"
                          />

                          <p className="text-center text-sm mt-2">{movie.title}</p>

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-yellow-400 font-bold text-sm">⭐ {movie.voteAverage.toFixed(1)}</p>
                              <span className="bg-gray-700 px-2 py-1 text-xs rounded-md uppercase">{movie.mediaType?.name}</span>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
              </Carousel>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FaFilm /> Watchlist
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex gap-4 flex-wrap justify-center mt-4 bg-transparent border-0">
            <SheetHeader>
              <SheetTitle>Watchlist</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Carousel className="flex flex-wrap justify-center gap-4 px-4">
                <CarouselContent /* className="flex gap-4 transition-transform duration-100 ease-in-out" */>
                  {watchlist.map((movie) => (
                    <CarouselItem key={movie.id} className="flex-1 min-w-[160px] sm:min-w-[180px] md:min-w-[200px] max-w-[250px] basis-[calc(100%/auto)]">
                      <div
                        className="flex flex-col items-center justify-center rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.05] hover:shadow-2xl group"
                        onClick={() => navigate(`/movie/${movie.mediaId}`)}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.posterUrl}`}
                          alt={movie.title}
                          className="rounded-lg shadow-lg hover:scale-105 transition-transform"
                        />

                        <p className="text-center text-sm mt-2">{movie.title}</p>

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-yellow-400 font-bold text-sm">⭐ {movie.voteAverage.toFixed(1)}</p>
                            <span className="bg-gray-700 px-2 py-1 text-xs rounded-md uppercase">{movie.mediaType?.name}</span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
              </Carousel>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FaUserFriends /> Friends
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex gap-4 flex-wrap justify-center mt-4 bg-transparent border-0">
            <SheetHeader>
              <SheetTitle>Friends</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Carousel className="flex flex-wrap justify-center gap-4 px-4">
                <CarouselContent /* className="flex gap-4 transition-transform duration-100 ease-in-out" */>
                  {friends.map((friend) => (
                    <CarouselItem key={friend.id} className="flex-1 min-w-[160px] sm:min-w-[200px] max-w-[250px] flex-shrink">
                      <div
                        className="flex w-60 h-90 flex-col items-center justify-center rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.05] hover:shadow-2xl group"
                        onClick={() => navigate(`/profile/${friend.userId}`)}
                      >
                        <img
                          src={friend.profileUrl}
                          alt={friend.userId}
                          className="mb-3 w-40 h-40 rounded-full shadow-lg hover:scale-105 transition-transform"
                        />

                        <div>
                          <p className="font-medium">
                            {friend.name} {friend.surname}
                          </p>
                          <p className="text-xs text-muted-foreground">@{friend.username}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
              </Carousel>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 mt-6">
          {/* User Stats */}
          <div className="bg-muted/30 p-4 rounded-xl">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <LucideFileBarChart2 /> User Stats
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <div className="grid gap-6">
                {/* Movies Watched */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      🎬
                      <span className="text-foreground font-semibold">Movies Watched</span>
                      <Badge variant="secondary">Film Lover</Badge>
                    </div>
                    <span className="text-lg font-bold text-foreground">{watchedCount}</span>
                  </div>
                  <Progress value={(watchedCount / 100) * 100} />
                </div>

                {/* Reviews */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      📝
                      <span className="text-foreground font-semibold">Reviews</span>
                      {reviewCount >= 10 && <Badge variant="destructive">Critic</Badge>}
                    </div>
                    <span className="text-lg font-bold text-foreground">{reviewCount}</span>
                  </div>
                  <Progress value={(reviewCount / 20) * 100} />
                </div>

                {/* Favorites */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      ❤️
                      <span className="text-foreground font-semibold">Favorites</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{favoriteCount}</span>
                  </div>
                  <Progress value={(favoriteCount / 50) * 100} />
                </div>

                {/* Friends */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      👥
                      <span className="text-foreground font-semibold">Friends</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{friendCount}</span>
                  </div>
                  <Progress value={(friendCount / 50) * 100} />
                </div>
              </div>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="bg-muted/30 rounded-xl shadow-md p-4 space-y-3 w-full">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaUserFriends /> Recent Activity
            </h3>

            {recentActivities.map((activity, index) => {
              const date = new Date(activity.date);
              const isValidDate = !isNaN(date.getTime());

              return (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-1">
                    {activity.type === "review" && <FaStar className="text-yellow-400" />}
                    {activity.type === "favorite" && <FaHeart className="text-red-400" />}
                    {activity.type === "watchlist" && <FaFilm className="text-blue-400" />}
                    {activity.type === "friend" && <FaUserFriends className="text-green-400" />}
                  </span>

                  <div>
                    <p className="text-foreground">{activity.text}</p>
                    {isValidDate && <p className="text-xs text-muted-foreground">{formatDistanceToNow(date)} ago</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">This user hasn’t posted any reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-muted p-4 rounded-lg shadow-sm flex ">
                <img
                  src={`https://image.tmdb.org/t/p/w500${review.mediaPosterUrl}`}
                  alt={review.userId}
                  className="mb-3 w-30 h-45 rounded-lg shadow-lg hover:scale-105 transition-transform"
                />

                <div className="ms-3">
                  <h3 className="font-bold">{review.mediaTitle}</h3>
                  <p className="text-sm my-2">{review.content}</p>
                  <span className="text-xs text-muted-foreground">⭐ {review.rating}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <MessageSection />
    </div>
  );
};

export default PublicProfile;
