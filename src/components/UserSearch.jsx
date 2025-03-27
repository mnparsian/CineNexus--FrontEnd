import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { searchUsers } from "@/features/adminSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { setSearchResults } from "../features/adminSlice";

export default function UserSearch({ onSelectUser }) {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchUsers(query));
      } else {
        dispatch(setSearchResults([]));
      }
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [query, dispatch]);

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search users by name or username..."
        className="w-full px-4 py-2 mb-2 rounded bg-muted text-foreground focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="text-foreground">Searching...</p>}

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              onSelectUser(user);
              setQuery("");
            }}
            className="user-item hover:bg-muted/60"
          >
            <img src={user?.profileImage || "/fallback-profile.jpg"} alt="avatar" className="user-avatar" />
            <div className="user-info">
              <p className="text-foreground user-name">{user.username}</p>
              <p className="text-foreground user-fullname">
                {user.name} {user.surname}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
