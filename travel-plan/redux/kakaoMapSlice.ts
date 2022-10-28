import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// initalState 타입 정의
type StateType = {
  currentView: Object;
  loaded: boolean;
  viewBounds: boolean;
};

const initialState: StateType = {
  currentView: {},
  loaded: false,
  viewBounds: false,
};

export const kakaoMapSlice = createSlice({
  name: 'kakaoMap',
  initialState,
  reducers: {
    setView: (state: StateType, action: PayloadAction<Object>) => {
      state.currentView = action.payload;
    },
    setLoded: (state: StateType, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    }, 
    setViewBounds: (state: StateType, action: PayloadAction<boolean>) => {
      state.viewBounds = action.payload;
    }, 
  }
});

export const { setView, setLoded, setViewBounds } = kakaoMapSlice.actions;

export default kakaoMapSlice;
