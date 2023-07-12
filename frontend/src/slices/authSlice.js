import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
};

const authSlice = createSlice({
  name: 'auth', // keep 'login' for the method in usersApiSlice
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    destroyCredentials: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, destroyCredentials } = authSlice.actions;
export default authSlice.reducer;
