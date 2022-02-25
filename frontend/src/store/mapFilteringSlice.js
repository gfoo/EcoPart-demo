import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  autofitBounds: true,
  viewTrack: false,
  viewTrackIndexes: false,
};

const mapFilteringSlice = createSlice({
  name: "mapFiltering",
  initialState,
  reducers: {
    autofitBoundsEnable(state, action) {
      state.autofitBounds = action.payload;
    },
    viewTrackEnable(state, action) {
      state.viewTrack = action.payload;
    },
  },
});

export const { autofitBoundsEnable, viewTrackEnable } =
  mapFilteringSlice.actions;

export default mapFilteringSlice.reducer;

export const selectAutofitBounds = (state) => state.mapFiltering.autofitBounds;
export const selectViewTrack = (state) => state.mapFiltering.viewTrack;
