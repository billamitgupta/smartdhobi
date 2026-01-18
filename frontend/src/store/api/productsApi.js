import { useState } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Provider, useDispatch, useSelector } from "react-redux";

// RTK Query API
const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Categories", "SubCategories", "Dealers"],
  endpoints: (builder) => ({
    // Get all categories
 getCategories: builder.query({
  query: () => "/admin/categories/listCategories",
  providesTags: ["Categories"],
  transformResponse: (response) => response || response,
}),
    // Get subcategories by category ID
  getSubCategories: builder.query({
  query: () => "/admin/subCategories/listSubCategories",
  providesTags: ["SubCategories"],
  transformResponse: (response) => {
    const data = response.data || response;

    console.log("SubCategories Response:", response);
    // Transform categoryId from object to string
    return Array.isArray(data) ? data.map(sub => ({
      ...sub,
      categoryId:  sub.categoryId?._id
    })) : data;
  },
}),
getSubCategoriesByCategory: builder.query({
  query: (categoryId) =>
    `/admin/subCategories/getSubCategory/${categoryId}`,
  providesTags: ["SubCategories"],
  transformResponse: (response) => {
    // Handle the case when no subcategories found
    if (!response.success && response.message) {
      return [];
    }
    return response.data || response || [];
  },
}),
    // Get dealers
    getDealers: builder.query({
      query: () => "/auth/getAllDealers",
      providesTags: ["Dealers"],
      transformResponse: (response) => response.data,
    }),
    // Get products with filters
    getProducts: builder.query({
      query: ({ categoryId, subCategoryId, search }) => {
        const params = new URLSearchParams();
        if (categoryId) params.append("categoryId", categoryId);
        if (subCategoryId) params.append("subCategoryId", subCategoryId);
        if (search) params.append("search", search);
        const queryString = params.toString();
        return `/dealer/products/listProducts${
          queryString ? `?${queryString}` : ""
        }`;
      },
      providesTags: ["Products"],
      transformResponse: (response) => response.data,
    }),

    getProductById: builder.query({
      query: (productId) => `/products/getById/${productId}`,
      providesTags: ["Products"],
      transformResponse: (response) => response.product,
    }),
    createCategory: builder.mutation({
  query: (data) => ({
    url: "/admin/categories/createCategory",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Categories"],
}),

// Update category
updateCategory: builder.mutation({
  query: ({ id, data }) => ({
    url: `/admin/categories/updateCategory/${id}`,
    method: "PATCH",
    body: data,
  }),
  invalidatesTags: ["Categories"],
}),

// Create subcategory
createSubCategory: builder.mutation({
  query: (data) => ({
    url: "/admin/subCategories/createSubCategory",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["SubCategories"],
}),

// Update subcategory
updateSubCategory: builder.mutation({
  query: ({ id, data }) => ({
    url: `/admin/subCategories/updateSubCategory/${id}`,
    method: "PATCH",
    body: data,
  }),
  invalidatesTags: ["SubCategories"],
}),

    // Create new product
    createProduct: builder.mutation({
      query: (product) => ({
        url: "/dealer/products/createProduct",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    approveProduct: builder.mutation({
      query: (productId) => ({
        url: `/admin/products/approveProduct/${productId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),
     rejectProduct: builder.mutation({
      query: (productId) => ({
        url: `/admin/products/rejectProduct/${productId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),

  }),
});

export const {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetSubCategoriesByCategoryQuery,
  useGetDealersQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useApproveProductMutation,
  useRejectProductMutation,
  useGetProductByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
} = productsApi;

export { productsApi };
