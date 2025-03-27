import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist } from "../features/watchlistSlice";
import AuthSide from "../components/AuthSide";
import ReviewSidebar from "../components/ReviewSideBar";
import { Button } from "@/components/ui/button";
import SearchBar from "../components/SearchBar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GenreMoviesSheet from "../components/GenreMoviesSheet";
import CrewMembersSheet from "../components/CrewMembersSheet";
import { addToFavorites } from "../features/favoriteSlice";
import Navbar from "../components/Navbar";
import { logout } from "@/features/authSlice";
import { toast } from "sonner";
import { fetchWatchlist } from "../features/watchlistSlice";
import { fetchFavorites } from "../features/favoriteSlice";
import { removeFromWatchlist } from "../features/watchlistSlice";
import { removeFromFavorites } from "../features/favoriteSlice";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const authUser = useSelector((state) => state.auth.user);

  const [movie, setMovie] = useState(null);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [_selectedReview, setSelectedReview] = useState(null);
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [defaultToLogin, setDefaultToLogin] = useState(true);
  const watchlist = useSelector((state) => state.watchlist.items);
  const favorites = useSelector((state) => state.favorites.items);
  const isInWatchlist = watchlist?.some((item) => item.mediaId === movie?.id);
  const isInFavorites = favorites?.some((item) => item.tmdbId === movie?.tmdbId);

  console.log("Wathvlist:", watchlist);
  console.log("favoriteLost:", favorites);

  const fetchData = async () => {
    try {
      const movieRes = await fetch(`http://localhost:8080/api/media-query/${id}`);
      const movieData = await movieRes.json();
      setMovie(movieData);

      const crewRes = await fetch(`http://localhost:8080/api/crew/media/${id}`);
      const crewData = await crewRes.json();
      setCrew(crewData);

      const reviewRes = await fetch(`http://localhost:8080/api/reviews-comments/reviews/media/${id}`);
      const reviewData = await reviewRes.json();
      setReviews([...reviewData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    if (userId) {
      dispatch(fetchWatchlist(userId));
      dispatch(fetchFavorites(userId));
    }
  }, [id, userId]);

  if (!movie) return <p className="text-white text-center">Loading...</p>;

  const handleAddToWatchlist = async () => {
    if (userId) {
      await dispatch(addToWatchlist({ userId, mediaId: id, statusId: 1 }));
      dispatch(fetchWatchlist(userId));
      toast.success("Added to your watchlist!");
    } else {
      toast.error("Please log in to add to watchlist.");
    }
  };

  const handleAddToFavorites = async () => {
    if (userId) {
      await dispatch(addToFavorites({ userId, tmdbId: movie.tmdbId }));
      dispatch(fetchFavorites(userId));
      toast.success("Added to your favorites!");
    } else {
      toast.error("Please log in to add to favorites.");
    }
  };
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    toast("You are logged out.");
    navigate("/");
  };

  const handleRemoveFromWatchlist = async () => {
    if (userId) {
      await dispatch(removeFromWatchlist({ userId, mediaId: id }));

      dispatch(fetchWatchlist(userId));
      toast.success("Removed from your watchlist.");
    } else {
      toast.error("Please log in to remove from watchlist.");
    }
  };
  const handleRemoveFromFavorites = async () => {
    if (userId) {
      await dispatch(removeFromFavorites({ userId, tmdbId: movie.tmdbId }));
      dispatch(fetchFavorites(userId));
      toast.success("Removed from your favorites.");
    } else {
      toast.error("Please log in to remove from favorites.");
    }
  };
  if (!movie) return <LoadingSpinner />;
  return (
    <>
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
        centerContent={
          <div className="flex gap-3 items-center">
            <Button variant="ghost" className="text-sm px-3 py-1 rounded-full" onClick={() => navigate("/")}>
              Home
            </Button>

            <Button variant="ghost" className="text-sm px-3 py-1 rounded-full" onClick={() => setReviewDrawerOpen(true)}>
              Reviews 📄
            </Button>

            <div className="w-140 sm:w-60 max-[840px]:w-65 xl:w-150">
              <SearchBar />
            </div>
          </div>
        }
      />
      <AuthSide open={authOpen} setOpen={setAuthOpen} defaultToLogin={defaultToLogin} />

      <div
        className="relative min-h-screen text-white bg-cover bg-center before:absolute before:inset-0 before:bg-black before:opacity-50"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdropUrl})` }}
      >
        <div className="relative z-10 flex flex-col items-start gap-8 p-10  pt-[120px] sm:pt-[140px] items-center">
          <div className="flex flex-col md:flex-row items-start gap-8 w-full max-w-5xl">
            <img className="w-64 rounded-lg shadow-lg" src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`} alt={movie.title} />
            <div className="flex flex-col max-w-2xl">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <p className="text-lg text-gray-300">{movie.overview}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">⭐ {movie.voteAverage.toFixed(1)}</span>
                <div className="flex gap-2">
                  {movie.mediaGenres.map((g) => (
                    <GenreMoviesSheet key={g.genre.id} genreId={g.genre.id} genreName={g.genre.name} />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-gray-400">📅 {movie.releaseDate}</p>
              <div className="shrink-0">
                <div className="flex gap-3 mt-4 flex-wrap">
                  <Button
                    onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                    className={`text-sm ${isInWatchlist ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                  >
                    {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  </Button>

                  <Button
                    onClick={isInFavorites ? handleRemoveFromFavorites : handleAddToFavorites}
                    className={`text-sm ${isInFavorites ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"} text-white`}
                  >
                    {isInFavorites ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-5xl">
            <h2 className="text-xl font-semibold mb-3">Cast And Crew</h2>
            {crew.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {crew.map((member) => (
                  <div
                    key={member.person.id}
                    className="flex items-center bg-background text-foreground p-3 rounded-lg shadow-lg gap-4 transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedCrew(member)}
                  >
                    <Avatar>
                      <AvatarImage
                        src={member.person.profileImage ? `https://image.tmdb.org/t/p/w185${member.person.profileImage}` : "/fallback-profile.jpg"}
                      />
                      <AvatarFallback>{member.person.name || "?"}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium">{member.person.name}</p>
                      <p className="text-xs text-gray-400">{member.crewRole.name}</p>
                    </div>

                    <CrewMembersSheet personId={member.person.id} personName={member.person.name} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No information available for cast and crew.</p>
            )}
            {selectedCrew && (
              <CrewMembersSheet
                open={!!selectedCrew}
                onOpenChange={() => setSelectedCrew(null)}
                personId={selectedCrew.person.id}
                personName={selectedCrew.person.name}
              />
            )}
          </div>
        </div>
        <ReviewSidebar
          open={reviewDrawerOpen}
          setOpen={setReviewDrawerOpen}
          reviews={reviews}
          fetchReviews={fetchData}
          onSelectReview={setSelectedReview}
          setReviews={setReviews}
        />

        <div className="absolute top-6 right-140 z-50 w-100">{/* <SearchBar /> */}</div>
      </div>
    </>
  );
}
