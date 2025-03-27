import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchlist, removeFromWatchlist, updateWatchlistStatus } from "../features/watchlistSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const WatchlistSection = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const watchlist = useSelector((state) => state.watchlist?.items || []);
  const [loading, setLoading] = useState(true);
  const isDisabled = watchlist.length === 0 ? true : false;
  const isCombine = watchlist.length > 1 ? true : false;
  const ignoreClipping = watchlist.length > 1 ? true : false;

  useEffect(() => {
    if (userId) {
      dispatch(fetchWatchlist(userId)).finally(() => setLoading(false));
    }
  }, [userId, dispatch]);

  const handleRemove = (mediaId) => {
    dispatch(removeFromWatchlist({ userId, mediaId })).then(() => {
      dispatch(fetchWatchlist(userId));
    });
  };

  const handleStatusChange = (mediaId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 2 : currentStatus === 2 ? 3 : 1;
    dispatch(updateWatchlistStatus({ userId, mediaId, statusId: newStatus })).then(() => {
      dispatch(fetchWatchlist(userId));
    });
  };

  const groupedWatchlist = {
    TO_WATCH: watchlist.filter((item) => item.status.id === 1),
    WATCHING: watchlist.filter((item) => item.status.id === 2),
    WATCHED: watchlist.filter((item) => item.status.id === 3)
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const draggedItem = watchlist.find((item) => item.id.toString() === result.draggableId);
    if (!draggedItem) return;

    const newStatus = result.destination.droppableId === "TO_WATCH" ? 1 : result.destination.droppableId === "WATCHING" ? 2 : 3;

    if (draggedItem.status.id !== newStatus) {
      dispatch(updateWatchlistStatus({ userId, mediaId: draggedItem.mediaId, statusId: newStatus })).then(() => {
        dispatch(fetchWatchlist(userId));
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">🎬 Your Watchlist</h2>

      {loading ? (
        <p className="text-foreground animate-pulse">Loading Watchlist...</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedWatchlist).map(([status, items]) => (
            <div key={status}>
              <h3 className="text-xl font-semibold text-foreground mt-4">{status.replace("_", " ")}</h3>
              <Droppable
                droppableId={status}
                direction="horizontal"
                isDropDisabled={isDisabled}
                isCombineEnabled={isCombine}
                ignoreContainerClipping={ignoreClipping}
              >
                {(provided) => (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 space-x-4 overflow-x-auto py-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-muted border-border p-4 rounded-lg shadow-md w-64 transition transform ${
                              snapshot.isDragging ? "scale-110 shadow-2xl" : "hover:scale-105 hover:shadow-lg"
                            }`}
                          >
                            <img src={`https://image.tmdb.org/t/p/w500${item.posterUrl}`} alt={item.title} className="rounded-lg w-full object-cover" />
                            <h3 className="text-lg font-semibold mt-2 text-foreground">{item.title}</h3>
                            <p className="text-foreground text-sm">{item.overview.slice(0, 100)}...</p>
                            <p className="text-yellow-500 font-bold mt-2">⭐ {item.voteAverage.toFixed(1)}</p>
                            <div className="flex justify-between gap-2 mt-4">
                              <button
                                onClick={() => handleStatusChange(item.mediaId, item.status.id)}
                                className="bg-blue-500 px-3 py-1 text-white rounded text-sm transition hover:bg-blue-700 active:scale-90"
                              >
                                {item.status.id === 1 ? "▶ Watching" : item.status.id === 2 ? "✅ Watched" : "🔖 To Watch"}
                              </button>
                              <button
                                onClick={() => handleRemove(item.mediaId)}
                                className="bg-red-500 px-3 py-1 text-white rounded text-sm transition hover:bg-red-700 active:scale-90"
                              >
                                ❌ Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      )}
    </div>
  );
};

export default WatchlistSection;
