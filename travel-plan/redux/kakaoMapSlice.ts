import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// initalState 타입 정의
type StateType = {
  currentView: KakaoLocation;
  loaded: boolean;
  viewBounds: boolean;
};

const initialState: StateType = {
  currentView: {id: 0, place_name: null, address_name: null, y: 0, x: 0, place_url: null},
  loaded: false,
  viewBounds: false,
};

export const kakaoMapSlice = createSlice({
  name: 'kakaoMap',
  initialState,
  reducers: {
    setView: (state: StateType, action: PayloadAction<KakaoLocation>) => {
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
