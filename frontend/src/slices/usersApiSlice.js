import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data,
                // If using cors add these 2 as well
                headers: { "Content-Type": "application/json" },        
                credentials: "include",
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
                // If using cors add these 2 as well
                headers: { "Content-Type": "application/json" },        
                credentials: "include",
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
                // If using cors add these 2 as well
                headers: { "Content-Type": "application/json" },        
                credentials: "include",
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data,
                // If using cors add these 2 as well
                headers: { "Content-Type": "application/json" },        
                credentials: "include",
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
                // If using cors add these 2 as well
                 headers: { "Content-Type": "application/json" },        
                 credentials: "include",
            }),
            providesTags: ["Users"],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: "DELETE",
                // If using cors add these 2 as well
                headers: { "Content-Type": "application/json" },        
                credentials: "include",
            }),
        }),
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                // If using cors add these 2 as well
                headers: { "Content-Type": "application/json" },        
                credentials: "include",
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: "PUT",
                body: data,
                // If using cors add these 2 as well
                 headers: { "Content-Type": "application/json" },        
                 credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),
    }), 
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useProfileMutation, useGetUsersQuery, useDeleteUserMutation, useGetUserDetailsQuery, useUpdateUserMutation } = usersApiSlice;