import React from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Community = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: creations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publishedCreations"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data.success)
        throw new Error(data.message || "Failed to fetch creations.");
      return data.creations;
    },
    enabled: !!user,
  });

  // --- Handle toggling a like on a creation ---
  const { mutate: toggleLike } = useMutation({
    mutationFn: async (creationId) => {
      const token = await getToken();
      return axios.post(
        "/api/user/toggle-like-creation",
        { id: creationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onMutate: async (creationId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["publishedCreations"] });

      // Snapshot the previous value
      const previousCreations = queryClient.getQueryData([
        "publishedCreations",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["publishedCreations"], (oldData) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.map((creation) => {
          if (creation.id === creationId) {
            const isLiked = creation.likes.includes(user?.id);
            const newLikes = isLiked
              ? creation.likes.filter((id) => id !== user?.id)
              : [...creation.likes, user?.id];
            return { ...creation, likes: newLikes };
          }
          return creation;
        });
      });

      // Return a context object with the snapshotted value
      return { previousCreations };
    },
    onError: (err, creationId, context) => {
      toast.error("Failed to update like status. Please try again.");
      // Rollback to the previous value on error
      queryClient.setQueryData(
        ["publishedCreations"],
        context.previousCreations
      );
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["publishedCreations"] });
    },
  });

  const handleToggleLike = (creationId) => {
    if (!user) {
      toast.error("You must be signed in to like a creation.");
      return;
    }
    toggleLike(creationId);
  };

  return (
    <div className="flex-1 h-full flex flex-col gap-6 p-6 bg-gradient-to-br from-indigo-100 via-pink-100 to-blue-100 min-h-screen">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-blue-500">
          Community Creations
        </h1>
        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-pink-400 via-indigo-400 to-blue-400 text-white font-semibold text-sm shadow-md border border-indigo-200">
          Live Gallery
        </span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-indigo-500 font-semibold">Loading creations...</p>
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 font-semibold">
            Failed to load creations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {creations?.map((creation) => (
            <div
              key={creation.id}
              className="relative group flex flex-col bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-transform hover:scale-[1.03] hover:shadow-2xl"
            >
              <img
                src={creation.content}
                alt={creation.prompt || "Community Creation"}
                className="w-full h-64 object-cover rounded-t-2xl border-b border-gray-200"
              />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 items-end justify-end p-4 bg-gradient-to-t from-black/70 to-transparent text-white rounded-b-2xl transition-all group-hover:from-indigo-500/60 group-hover:to-transparent">
                <p className="text-base font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left w-full">
                  {creation.prompt}
                </p>
                <div className="flex gap-2 items-center self-end">
                  <p className="font-bold text-lg drop-shadow">
                    {creation.likes.length}
                  </p>
                  <Heart
                    onClick={() => handleToggleLike(creation.id)}
                    className={`min-w-6 h-6 hover:scale-125 cursor-pointer transition-transform duration-200 ${
                      user && creation.likes.includes(user?.id)
                        ? "fill-pink-500 text-pink-600 drop-shadow"
                        : "text-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
