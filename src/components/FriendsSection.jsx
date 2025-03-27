import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriendships, removeFriend, acceptFriendRequest, rejectFriendRequest } from "../features/friendsSlice";
import MessageSection from "./MessageSection";
import { setFriendId, setChatRoomId } from "../features/chatSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import UserSearch from "./UserSearch";

const FriendSection = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const friends = useSelector((state) => state.friends?.friendsList || []);
  const friendRequests = useSelector((state) => state.friends?.friendRequests || []);
  const loading = useSelector((state) => state.friends.loading);
  const [openChat, setOpenChat] = useState(null);
  const [activeTab, setActiveTab] = useState("friends");

  const navigate = useNavigate();

  const handleUserSelect = (user) => {
    navigate(`/profile/${user.id}`);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchFriendships(userId));
    }
  }, [userId, dispatch]);

  const handleRemoveFriend = async (friendId) => {
    await dispatch(removeFriend({ userId, friendId }));
    dispatch(fetchFriendships(userId));
  };

  const handleAcceptRequest = (friendshipId) => {
    dispatch(acceptFriendRequest(friendshipId));
  };

  const handleRejectRequest = (friendshipId) => {
    dispatch(rejectFriendRequest(friendshipId));
  };

  const selectedFriendId = useSelector((state) => state.chat.friendId);

  const handleSelectFriend = (friendId) => {
    console.log("🔹 Selecting friendId:", friendId);

    dispatch(setFriendId(friendId));

    dispatch(setChatRoomId(null));

    setOpenChat(true);
  };

  return (
    <div className="p-6 bg-background rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4 text-center">👥 Friends</h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4 border-b border-gray-700 pb-2">
        {/* Friends List */}
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            activeTab === "friends" ? "bg-blue-600 text-white border-b-4 border-blue-500" : "bg-muted text-foreground"
          } rounded-t-md`}
          onClick={() => setActiveTab("friends")}
        >
          Friends List
        </button>

        {/* Friend Requests */}
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            activeTab === "requests" ? "bg-blue-600 text-white border-b-4 border-blue-500" : "bg-muted text-foreground"
          } rounded-t-md`}
          onClick={() => setActiveTab("requests")}
        >
          Friend Requests
        </button>

        {/* Search Users */}
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            activeTab === "search" ? "bg-blue-600 text-white border-b-4 border-blue-500" : "bg-muted text-foreground"
          } rounded-t-md`}
          onClick={() => setActiveTab("search")}
        >
          Search Users
        </button>
      </div>

      {/* List of friends */}
      {activeTab === "friends" && (
        <ul className="overflow-y-auto scrollbar-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-muted">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <li
                key={friend.id}
                className="bg-muted  p-4 rounded-lg mb-4 shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-muted/30 transition-all duration-200"
              >
                <Link to={`/profile/${friend.userId}`}>
                  <div className="flex items-center space-x-4">
                    <img src={friend.profileUrl} alt="Profile" className="w-12 h-12 rounded-full border-2 border-border" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {friend.name} {friend.surname}
                      </h3>
                      <p className="text-foreground text-sm">@{friend.username}</p>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    key={friend.userId}
                    onClick={() => handleSelectFriend(friend.userId)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
                  >
                    💬 Message
                  </button>

                  {openChat && <MessageSection chatRoomId={openChat} closeChat={() => setOpenChat(null)} />}
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                    onClick={() => handleRemoveFriend(friend.userId, friend.friendId)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-center">You have no friends yet.</p>
          )}
        </ul>
      )}

      {/* friend requests */}
      {activeTab === "requests" && (
        <ul className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-muted">
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <li
                key={request.id}
                className="bg-muted p-4 rounded-lg mb-4 shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-gray-700 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <img src={request.profileUrl} alt="Profile" className="w-12 h-12 rounded-full border-2 border-yellow-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {request.name} {request.surname}
                    </h3>
                    <p className="text-foreground text-sm">@{request.username}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="bg-green-500 px-4 py-2 rounded-md text-foreground hover:bg-green-600 transition-all duration-200"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    ✔ Accept
                  </button>
                  <button
                    className="bg-red-500 px-4 py-2 rounded-md text-foreground hover:bg-red-600 transition-all duration-200"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-center">No pending friend requests.</p>
          )}
        </ul>
      )}
      {activeTab === "search" && (
        <div className="p-4">
          <UserSearch onSelectUser={handleUserSelect} />
        </div>
      )}
    </div>
  );
};

export default FriendSection;
