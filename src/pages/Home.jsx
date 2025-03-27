import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, setCategory } from "../features/moviesSlice";
import CategorySelector from "@/components/CategorySelector";
import Navbar from "@/components/Navbar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import HeroSection from "../components/HeroSection";
import ThemeSwitcher from "../components/ThemeSwitcher";
import AuthSide from "../components/AuthSide";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/authSlice";
import { toast } from "sonner";

export default function Home() {
  const dispatch = useDispatch();
  const { list: movies, status, error, category } = useSelector((state) => state.movies);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const handleSelectItem = (item) => {
    navigate(`/movie/${item.id}`);
  };
  const authUser = useSelector((state) => state.auth.user);
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const handleCategorySelect = (newCategory) => {
    setSelectedCategory(newCategory);
    dispatch(setCategory(newCategory));
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.requireLogin) {
      toast.warning("Please log in to access that page.");
    }
  }, [location]);

  const [authOpen, setAuthOpen] = useState(false);
  const [defaultToLogin, setDefaultToLogin] = useState(true);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      dispatch(fetchMovies(category));
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [dispatch, category]);
  const handleLogout = () => {
    dispatch(logout());
    toast("You are logged out.");
  };

  return (
    <div className="px-4 md:px-6 py-6 bg-background min-h-screen text-black dark:text-white">
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
        centerContent={<CategorySelector selected={selectedCategory} onSelect={handleCategorySelect} />}
      />

      <AuthSide open={authOpen} setOpen={setAuthOpen} defaultToLogin={defaultToLogin} />
      <HeroSection />
      <SearchBar />

      {status === "loading" && <p className="text-center text-gray-500">Loading....</p>}
      {status === "failed" && <p className="text-center text-red-500">Error: {error}</p>}

      <div className={`relative transition-all duration-500 ease-in-out ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        <Carousel className="w-full overflow-hidden">
          <CarouselContent className="flex gap-4 transition-transform duration-100 ease-in-out">
            {movies.map((movie) => (
              <CarouselItem onClick={() => handleSelectItem(movie)} key={movie.id} className="basis-1/1 sm:basis-1/2 md:basis-1/4 lg:basis-1/6">
                <div className="relative bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.05] hover:shadow-2xl group">
                  <img src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`} alt={movie.title} className="w-full aspect-[2/3] object-cover rounded-lg" />

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <h2 className="text-lg font-bold">{movie.title}</h2>
                    <p className="text-sm text-gray-300">{movie.overview.length > 80 ? movie.overview.substring(0, 80) + "..." : movie.overview}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-yellow-400 font-bold text-sm">⭐ {movie.voteAverage.toFixed(1)}</p>
                      <span className="bg-gray-700 px-2 py-1 text-xs rounded-md uppercase">{movie.mediaType.name}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute max-[840px]:hidden sm:flex left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
          <CarouselNext className="absolute max-[840px]:hidden sm:flex right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
        </Carousel>
      </div>
    </div>
  );
}
