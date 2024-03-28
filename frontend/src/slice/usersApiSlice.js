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
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
    }), 
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = usersApiSlice;