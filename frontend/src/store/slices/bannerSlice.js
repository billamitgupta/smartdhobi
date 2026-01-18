// store/slices/bannerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  banners: [],
  selectedBanner: null,
  filters: {
    search: "",
    isActive: null, // null = all, true = active only, false = inactive only
    sortBy: "order", // "order", "createdAt", "title"
  },
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    // Set all banners
    setBanners: (state, action) => {
      state.banners = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set selected banner for editing
    setSelectedBanner: (state, action) => {
      state.selectedBanner = action.payload;
    },

    // Clear selected banner
    clearSelectedBanner: (state) => {
      state.selectedBanner = null;
    },

    // Add new banner to state
    addBanner: (state, action) => {
      state.banners.unshift(action.payload);
    },

    // Update banner in state
    updateBannerInState: (state, action) => {
      const index = state.banners.findIndex(
        (banner) => banner._id === action.payload._id
      );
      if (index !== -1) {
        state.banners[index] = action.payload;
      }
    },

    // Remove banner from state
    removeBanner: (state, action) => {
      state.banners = state.banners.filter(
        (banner) => banner._id !== action.payload
      );
    },

    // Set search filter
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },

    // Set active filter
    setActiveFilter: (state, action) => {
      state.filters.isActive = action.payload;
    },

    // Set sort by
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reorder banners (for drag and drop functionality)
    reorderBanners: (state, action) => {
      state.banners = action.payload;
    },

    // Toggle banner active status
    toggleBannerActive: (state, action) => {
      const index = state.banners.findIndex(
        (banner) => banner._id === action.payload
      );
      if (index !== -1) {
        state.banners[index].isActive = !state.banners[index].isActive;
      }
    },
  },
});

export const {
  setBanners,
  setSelectedBanner,
  clearSelectedBanner,
  addBanner,
  updateBannerInState,
  removeBanner,
  setSearchFilter,
  setActiveFilter,
  setSortBy,
  resetFilters,
  setLoading,
  setError,
  clearError,
  reorderBanners,
  toggleBannerActive,
} = bannerSlice.actions;

export default bannerSlice.reducer;

// Selectors
export const selectAllBanners = (state) => state.banner.banners;
export const selectSelectedBanner = (state) => state.banner.selectedBanner;
export const selectBannerFilters = (state) => state.banner.filters;
export const selectBannerLoading = (state) => state.banner.loading;
export const selectBannerError = (state) => state.banner.error;

// Filtered banners selector
export const selectFilteredBanners = (state) => {
  const { banners, filters } = state.banner;
  let filtered = [...banners];

  // Apply search filter
  if (filters.search) {
    filtered = filtered.filter((banner) =>
      banner.title?.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  // Apply active filter
  if (filters.isActive !== null) {
    filtered = filtered.filter((banner) => banner.isActive === filters.isActive);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "order":
        return a.order - b.order;
      case "createdAt":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      default:
        return 0;
    }
  });

  return filtered;
};