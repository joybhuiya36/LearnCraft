import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keyword: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

export const { searchword } = searchSlice.actions;

export default searchSlice.reducer;
