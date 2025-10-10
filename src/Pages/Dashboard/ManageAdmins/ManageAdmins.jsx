import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaSearch,
  FaUserShield,
  FaUserSlash,
  FaUsersCog,
  FaEnvelope,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageAdmins = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  const {
    data: users = [],
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["searchUsers", email],
    queryFn: async () => {
      if (!email) return [];
      const res = await axiosSecure.get(`users/search?email=${email}`);
      return res.data;
    },
    enabled: false,
    retry: false,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`users/${id}/role`, { role }),
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries(["searchUsers", email]);
      const previousUsers = queryClient.getQueryData(["searchUsers", email]);
      queryClient.setQueryData(["searchUsers", email], (old = []) =>
        old.map((user) => (user._id === id ? { ...user, role } : user))
      );
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      Swal.fire("Error", "Failed to update role", "error");
      if (context?.previousUsers) {
        queryClient.setQueryData(["searchUsers", email], context.previousUsers);
      }
    },
    onSuccess: () => {
      Swal.fire("Success", "User role updated successfully", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["searchUsers", email]);
    },
  });

  const handleRoleChange = (id, role) => {
    updateRoleMutation.mutate({ id, role });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      Swal.fire("Warning", "Please enter an email to search", "warning");
      return;
    }
    refetch();
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 text-[#FA2A3B]">
          <FaUsersCog className="text-[#E02032]" /> Manage Admins
        </h1>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Search users by email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FA2A3B]"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-[#FA2A3B] hover:bg-[#E02032] text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <FaSearch /> Search
        </button>
      </form>

      {/* Loading / Error States */}
      {isFetching && (
        <p className="text-center text-gray-500 font-medium animate-pulse">
          Searching users...
        </p>
      )}
      {isError && (
        <p className="text-center text-red-500 font-medium">
          No users found or something went wrong.
        </p>
      )}

      {/* Users List */}
      <div className="space-y-5">
        {users.length > 0
          ? users.map((user) => (
              <div
                key={user._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-sm sm:text-base flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-[#FA2A3B]" />
                    <span className="font-semibold">Email:</span> {user.email}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    <span className="font-semibold">Created At:</span>{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </p>
                  <p className="text-sm sm:text-base mt-1">
                    <span className="font-semibold">Role:</span>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-[#FA2A3B]/10 text-[#FA2A3B] border border-[#FA2A3B]"
                          : "bg-gray-100 text-gray-700 border border-gray-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {user.role !== "admin" ? (
                    <button
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className="flex-1 sm:flex-none bg-[#FA2A3B] hover:bg-[#E02032] text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <FaUserShield /> Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoleChange(user._id, "user")}
                      className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <FaUserSlash /> Remove Admin
                    </button>
                  )}
                </div>
              </div>
            ))
          : !isFetching &&
            !isError && (
              <p className="text-center text-gray-500 italic">
                No users to display. Try searching by email.
              </p>
            )}
      </div>
    </div>
  );
};

export default ManageAdmins;
