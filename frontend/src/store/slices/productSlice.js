import { createSlice } from "@reduxjs/toolkit";


// Product Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    filters: {
      search: '',
      categoryId: '',
      subCategoryId: '',
    },
    selectedProduct: null,
    viewMode: 'grid', // 'grid' or 'list'
    sortBy: 'newest', // 'newest', 'price-low', 'price-high', 'name'
  },
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filters.categoryId = action.payload;
      // Reset subcategory when category changes
      state.filters.subCategoryId = '';
    },
    setSubCategoryFilter: (state, action) => {
      state.filters.subCategoryId = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        categoryId: '',
        subCategoryId: '',
      };
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setSearchFilter,
  setCategoryFilter,
  setSubCategoryFilter,
  clearFilters,
  setSelectedProduct,
  setViewMode,
  setSortBy,
} = productSlice.actions;
export default productSlice.reducer;
