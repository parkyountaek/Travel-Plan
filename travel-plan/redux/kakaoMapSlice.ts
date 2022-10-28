import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// initalState 타입 정의
type StateType = {
  currentView: Object;
  loaded: boolean;
};

const initialState: StateType = {
  currentView: {},
  loaded: false
};

export const kakaoMapSlice = createSlice({
  name: 'kakaoMap',
  initialState,
  reducers: {
    setView: (state: StateType, action: PayloadAction<Object>) => {
      state.currentView = action.payload;
    },
    setLoded: (state: StateType, action: PayloadAction<boolean>) => {
      console.log(action.payload)
      state.loaded = action.payload;
    }, 
  }
});

export const { setView, setLoded } = kakaoMapSlice.actions;

export default kakaoMapSlice;
