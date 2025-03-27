import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function CrewMembersSheet({ personId, personName, open, onOpenChange }) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (personId && open) {
      fetch(`http://localhost:8080/api/crew/media/person/${personId}`)
        .then((res) => res.json())
        .then((data) => setMovies(data))
        .catch((error) => console.error("Error receiving person's Movies:", error));
    }
  }, [personId, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[400px] bg-transparent border-0 text-white p-4 ">
        <h2 className="text-xl font-bold mb-4">🎬{personName}</h2>

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

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-yellow-400 font-bold text-sm">⭐ {movie.voteAverage.toFixed(1)}</p>
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
