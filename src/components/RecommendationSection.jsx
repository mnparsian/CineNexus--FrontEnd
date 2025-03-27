import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchMovieDetails = async (movieName) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieName)}&api_key=${TMDB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error("❌ Error fetching movie details:", error);
    return null;
  }
};

const RecommendationSection = ({ likedMovies }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/api/recommendations/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(likedMovies)
    });

    const data = await response.text();
    const movieNames = data.split("\n").map((movie) => movie.replace(/^\d+\.\s*/, "").trim());
    const movieDetails = await Promise.all(movieNames.map(fetchMovieDetails));
    setRecommendations(movieDetails.filter(Boolean));
    setLoading(false);
  };

  return (
    <div className="p-6 bg-background rounded-lg shadow-lg max-w-6xl mx-auto w-full text-foreground">
      <h2 className="text-2xl font-bold mb-6 text-center">🤖 AI Movie Recommendations</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-2 rounded transition-all"
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5  gap-6">
        {recommendations.map((movie, index) => (
          <div key={index} className="bg-background p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform border-border">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500"}
              alt={movie.title}
              className="rounded w-full h-72 object-cover mb-3"
            />
            <h3 className="text-lg font-semibold text-foreground">{movie.title}</h3>
            <p className="text-foreground text-sm mt-1">{movie?.overview ? movie.overview.slice(0, 100) + "..." : "No description available."}</p>
            <span className="text-yellow-400 text-sm font-medium mt-2 block">⭐ {movie.vote_average}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
