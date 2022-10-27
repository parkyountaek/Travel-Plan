import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// initalState 타입 정의
type StateType = {
  currentView: Object;
};

const initialState: StateType = { currentView: {} };

export const kakaoMapSlice = createSlice({
  name: 'kakaoMap',
  initialState,
  reducers: {
    setView: (state: StateType, action: PayloadAction<Object>) => {
      state.currentView = action.payload;
    }
  }
});

export const { setView } = kakaoMapSlice.actions;

export default kakaoMapSlice;
