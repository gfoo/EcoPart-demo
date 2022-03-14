import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  autofitBounds: true,
  viewTrack: false,
  viewTrackIndexes: false,
  highlightedIndex: 1,
  trackedProject: null,
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
    highlighIndex(state, action) {
      state.highlightedIndex = action.payload;
    },
    trackProject(state, action) {
      state.trackedProject = action.payload;
    },
  },
});

export const {
  autofitBoundsEnable,
  viewTrackEnable,
  highlighIndex,
  trackProject,
} = mapFilteringSlice.actions;

export default mapFilteringSlice.reducer;

export const selectAutofitBounds = (state) => state.mapFiltering.autofitBounds;
export const selectViewTrack = (state) => state.mapFiltering.viewTrack;
export const selectHighlightedIndex = (state) =>
  state.mapFiltering.highlightedIndex;
export const selectTrackedProject = (state) =>
  state.mapFiltering.trackedProject;
