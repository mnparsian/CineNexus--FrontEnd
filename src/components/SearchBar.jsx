const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const moviesPromise = fetch(`${BASE_URL}/api/media-query/search?title=${debouncedQuery}`).then((res) => res.json());

        const personsPromise = fetch(`${BASE_URL}/api/crew/search?name=${debouncedQuery}`).then((res) => res.json());

        const [moviesData, personsData] = await Promise.all([moviesPromise, personsPromise]);

        const movieResults = (moviesData?.content || []).map((m) => ({
          type: "movie",
          id: m.id,
          title: m.title,

          poster: m.posterUrl ? `https://image.tmdb.org/t/p/w500${m.posterUrl}` : ""
        }));

        const personResults = (personsData || []).map((p) => ({
          type: "person",
          id: p.id,
          name: p.name,

          profilePic: p.profileImage
        }));

        const combined = [...movieResults, ...personResults];
        setResults(combined);
        setIsOpen(true);
      } catch (error) {
        console.error(error);
        setResults([]);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  const handleSelectItem = (item) => {
    setIsOpen(false);
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/person/${item.id}`);
    }
  };

  return (
    <div className="flex-col gap-4 sm:gap-6 relative w-full max-w-md mx-auto my-4" ref={containerRef}>
      <input
        type="text"
        className="w-full navbar-search rounded-md border border-gray-300 focus:outline-none text-foreground"
        placeholder="search movie or crew..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-background border border-gray-200 rounded shadow-md max-h-72 overflow-auto z-10 text-black dark:text-white">
          {results.map((item, index) => (
            <li
              key={`${item.type}-${item.id}-${index}`}
              onClick={() => handleSelectItem(item)}
              className="flex items-center gap-2 p-2 text-foreground bg-background hover:bg-muted cursor-pointer "
            >
              {item.type === "movie" && item.poster && <img src={item.poster} alt={item.title} className="w-8 h-8 object-cover rounded" />}
              {item.type === "person" && item.profilePic && <img src={item.profilePic} alt={item.name} className="w-8 h-8 object-cover rounded-full" />}

              {item.type === "movie" ? <span className="text-foreground">{item.title}</span> : <span className="text-foreground">{item.name}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
