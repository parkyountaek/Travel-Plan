import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// initalState 타입 정의
type StateType = {
  node: Object[];
};

const initialState: StateType = { node: [] };

export const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    addPlan: (state: StateType, action: PayloadAction<Object>) => {
      if(state.node.filter(n => n.id !== undefined && n.id === action.payload.id).length === 0)
        state.node.push(action.payload);
    },
    setPlan: (state: StateType, action: PayloadAction<Object[]>) => {
      state.node = action.payload;
    }
  }
});

export const { addPlan } = planSlice.actions;

export default planSlice;
