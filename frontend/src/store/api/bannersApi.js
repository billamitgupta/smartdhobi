// store/api/bannersApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bannersApi = createApi({
  reducerPath: 'bannersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/banner`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // Don't set Content-Type for FormData - browser will set it with boundary
      return headers;
    },
  }),
  tagTypes: ['Banners'],
  endpoints: (builder) => ({
    // Get all banners
    getBanners: builder.query({
      query: () => '/listBanners',
      providesTags: ['Banners'],
      transformResponse: (response) => response.banners || [],
    }),

    // Get single banner
    getBanner: builder.query({
      query: (id) => `/getBanner/${id}`,
      providesTags: (result, error, id) => [{ type: 'Banners', id }],
      transformResponse: (response) => response.banner,
    }),

    // Create banner
    createBanner: builder.mutation({
      query: (formData) => ({
        url: '/createBanner',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Banners'],
    }),

    // Update banner
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/updateBanner/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Banners'],
    }),

    // Delete banner
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/deleteBanner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banners'],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApi;