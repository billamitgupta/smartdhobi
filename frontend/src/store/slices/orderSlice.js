// store/slices/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    filters: {
      status: '', // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
      dateFrom: '',
      dateTo: '',
      search: '',
    },
    selectedOrder: null,
    sortBy: 'newest', // 'newest', 'oldest', 'amount-high', 'amount-low'
  },
  reducers: {
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setDateFromFilter: (state, action) => {
      state.filters.dateFrom = action.payload;
    },
    setDateToFilter: (state, action) => {
      state.filters.dateTo = action.payload;
    },
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        dateFrom: '',
        dateTo: '',
        search: '',
      };
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setStatusFilter,
  setDateFromFilter,
  setDateToFilter,
  setSearchFilter,
  clearFilters,
  setSelectedOrder,
  setSortBy,
} = orderSlice.actions;

export default orderSlice.reducer;