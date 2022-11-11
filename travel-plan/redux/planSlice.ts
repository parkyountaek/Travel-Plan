import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// initalState 타입 정의
type StateType = {
  node: KakaoLocation[];
};

const initialState: StateType = { node: [] };

export const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    addPlan: (state: StateType, action: PayloadAction<KakaoLocation>) => {
      if(state.node.filter(n => n.id !== undefined && n.id === action.payload.id).length === 0)
        state.node.push(action.payload);
    },
    setPlan: (state: StateType, action: PayloadAction<KakaoLocation[]>) => {
      state.node = action.payload;
    }
  }
});

export const { addPlan, setPlan } = planSlice.actions;

export default planSlice;
