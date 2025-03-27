import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites, removeFromFavorites } from "../features/favoriteSlice";
import { Link } from "react-router-dom";

const FavoritesSection = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const favorites = useSelector((state) => state.favorites?.items || []);
  console.log(favorites);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId)).finally(() => setLoading(false));
    }
  }, [userId, dispatch]);

  const handleRemove = (tmdbId) => {
    dispatch(removeFromFavorites({ userId, tmdbId })).then(() => {
      dispatch(fetchFavorites(userId));
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">❤️ Favorite Movies</h2>

      {loading ? (
        <p className="text-foreground animate-pulse">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-foreground">No favorite movies added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 py-4">
          {favorites.map((movie) => (
            <div key={movie.id} className="bg-muted p-4 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg">
              <Link to={`/movie/${movie.mediaId}`}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`} alt={movie.title} className="rounded-lg w-full h-72 object-cover" />
                <h3 className="text-lg font-semibold mt-2 text-foreground">{movie.title}</h3>
              </Link>
              <p className="text-foregroundtext-sm mt-1">{movie.overview ? movie.overview.slice(0, 100) + "..." : "No description available"}</p>
              <p className="text-yellow-500 font-bold mt-2">⭐ {movie.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"}</p>
              <button
                onClick={() => handleRemove(movie.tmdbId)}
                className="bg-red-500 px-3 py-1 mt-3 w-full text-white rounded text-sm transition hover:bg-red-700 active:scale-95"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
