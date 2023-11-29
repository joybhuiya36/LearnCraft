import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "",
  id: "",
  name: "",
  email: "",
  address: "",
  phone: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoginInfo: (state, action) => {
      state.role = action.payload.role;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.address = action.payload.address;
      state.phone = action.payload.phone;
    },
    userLogout: (state, action) => {
      state.role = "";
      state.id = "";
      state.name = "";
      state.email = "";
      state.address = "";
      state.phone = "";
    },
  },
});

export const { userLoginInfo, userLogout } = userSlice.actions;

export default userSlice.reducer;
