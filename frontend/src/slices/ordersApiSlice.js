import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: "POST",
                body: order,
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
            keepUnusedDataFor: 5
        }),
        payOrder: builder.mutation({
            query: ({orderId, details}) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: "PUT",
                body: { ...details },
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myOrders`,
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",
            }),
            keepUnusedDataFor: 5,
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: "PUT",
                // If using cors add these 2 as well
                // headers: { "Content-Type": "application/json" },        
                // credentials: "include",  
            }),
        }),
    }),
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation } = ordersApiSlice;