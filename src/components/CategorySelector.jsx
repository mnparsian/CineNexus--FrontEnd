import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

const categories = [
  { id: "movie/popular", label: "Movies" },
  { id: "tv/popular", label: "TV Shows" },
  { id: "movie/top_rated", label: "Top Rated" },
  { id: "movie/upcoming", label: "Upcoming" }
];

export default function CategorySelector({ onSelect }) {
  const [selected, setSelected] = useState("movie/popular");

  return (
    <div className="flex justify-center">
      <ToggleGroup
        type="single"
        value={selected}
        onValueChange={(value) => {
          if (value) {
            setSelected(value);
            onSelect(value);
          }
        }}
        /* className="relative bg-black/80 text-white p-2 rounded-full flex items-center gap-0 overflow-hidden" */
        className="bg-gray-900/70 dark:bg-white/10 text-foreground rounded-full flex items-center gap-2 px-2 py-1 overflow-x-auto no-scrollbar w-full justify-center"
      >
        {categories.map((category, index) => (
          <ToggleGroupItem
            key={category.id}
            value={category.id}
            className={`
              relative px-6 py-2 transition-colors duration-300 ease-in-out text-sm font-semibold
              ${selected === category.id ? "text-black bg-yellow-300" : "text-white hover:bg-white/30 hover:text-black"}
              ${
                (index === 0 ? "rounded-l-full" : "", "bg-gray-200 dark:bg-gray-800", "text-black dark:text-white", "hover:bg-gray-300 dark:hover:bg-white/30")
              }  
              ${
                (index === categories.length - 1 ? "rounded-r-full" : "",
                "bg-gray-200 dark:bg-gray-800",
                "text-black dark:text-white",
                "hover:bg-gray-300 dark:hover:bg-white/30")
              } 
              ${
                (index !== 0 && index !== categories.length - 1 ? "rounded-none" : "",
                "bg-gray-200 dark:bg-gray-800",
                "text-black dark:text-white",
                "hover:bg-gray-300 dark:hover:bg-white/30")
              } 
            `}
          >
            {category.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
