const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function GenreMoviesSheet({ genreId, genreName }) {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !genreId) return;
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/media-query/genre/${genreId}`);
        const data = await res.json();
        setMovies(data.content || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, [open, genreId]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-background text-foreground px-3 py-1 rounded-lg hover:bg-gray-600 transition">
          {genreName}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px] bg-transparent text-white p-4 border-0">
        <h2 className="text-xl font-bold mb-4">🎬{genreName} Movies</h2>

        <Carousel className="flex gap-4 px-4 overflow-x-auto hide-scrollbar">
          <CarouselContent /* className="flex gap-4 transition-transform duration-100 ease-in-out" */>
            {movies.map((movie) => (
              <CarouselItem key={movie.id} className="min-w-[180px] max-w-[180px] flex-shrink-0 cursor-pointer">
                <div
                  className="flex flex-col items-center justify-center rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.05] hover:shadow-2xl group"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.posterUrl}`}
                    alt={movie.title}
                    className="rounded-lg shadow-lg hover:scale-105 transition-transform"
                  />

                  <p className="text-center text-sm mt-2">{movie.title}</p>
                  {/* hide movie details*/}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-yellow-400 font-bold text-sm">⭐ {movie.voteAverage.toFixed(1)}</p>
                      <span className="bg-gray-700 px-2 py-1 text-xs rounded-md uppercase">{movie.mediaType.name}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg" />
        </Carousel>
      </SheetContent>
    </Sheet>
  );
}
