import React from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useAuth, useUser } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: creationsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userCreations"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data.success)
        throw new Error(data.message || "Failed to fetch creations.");
      return data.creations;
    },
    enabled: !!user, // Only run the query if the user is loaded
  });

  // --- Mutation for deleting a creation ---
  const { mutate: deleteCreation } = useMutation({
    mutationFn: async (creationId) => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.post(
        "/api/user/delete-creation",
        { id: creationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to delete creation.");
      }
      return data;
    },
    onMutate: async (creationId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["userCreations"] });

      // Snapshot the previous value
      const previousCreations = queryClient.getQueryData(["userCreations"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["userCreations"], (oldData) =>
        oldData ? oldData.filter((c) => c.id !== creationId) : []
      );

      // Return a context object with the snapshotted value
      return { previousCreations };
    },
    onError: (err, creationId, context) => {
      toast.error("Failed to delete creation.");
      // Rollback to the previous value on error
      if (context?.previousCreations) {
        queryClient.setQueryData(["userCreations"], context.previousCreations);
      }
    },
    onSuccess: () => {
      toast.success("Creation deleted.");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["userCreations"] });
    },
  });

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex justify-start gap-6 flex-wrap">
        {/* Total creations Card */}
        <div className="flex justify-between items-center w-full sm:w-72 p-5 bg-white rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="text-slate-700">
            <p className="text-sm font-medium">Total Creations</p>
            <h2 className="text-3xl font-bold">{creationsData?.length || 0}</h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Active Plan Card*/}
        <div className="flex justify-between items-center w-full sm:w-72 p-5 bg-white rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="text-slate-700">
            <p className="text-sm font-medium">Active Plan</p>
            <h2 className="text-3xl font-bold">
              <Protect plan={"premium"} fallback={"Free"}>
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-inner">
            <Gem className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-5">
          Recent Creations
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <p className="text-slate-500 font-semibold">
              Loading your creations...
            </p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center p-10 bg-red-50 rounded-lg">
            <p className="text-red-500">Failed to load your creations.</p>
          </div>
        ) : creationsData && creationsData.length > 0 ? (
          <div className="space-y-4">
            {creationsData.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <CreationItem item={item} onDelete={deleteCreation} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-10 bg-gray-50 rounded-lg">
            <p className="text-slate-500">
              You haven't made any creations yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
