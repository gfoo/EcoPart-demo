import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSamplesOfProjectIds } from "../lib/api";
import {
  FETCH_STATUS_FAILED,
  FETCH_STATUS_IDLE,
  FETCH_STATUS_LOADING,
  FETCH_STATUS_SUCCESSED,
} from "./helpers";

const initialState = {
  samples: [],
  status: FETCH_STATUS_IDLE,
  error: null,
};

export const fetchSamples = createAsyncThunk(
  "samples/fetchSamples",
  fetchSamplesOfProjectIds
);

const samplesSlice = createSlice({
  name: "samples",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSamples.fulfilled, (state, action) => {
        state.status = FETCH_STATUS_SUCCESSED;
        state.samples = action.payload;
      })
      .addCase(fetchSamples.pending, (state, action) => {
        state.status = FETCH_STATUS_LOADING;
      })
      .addCase(fetchSamples.rejected, (state, action) => {
        state.status = FETCH_STATUS_FAILED;
        state.error = action.error.message;
      });
  },
});

export default samplesSlice.reducer;

export const selectAllSamples = (state) => state.samples.samples;
export const fetchSamplesStatus = (state) => state.samples.status;
export const fetchSamplesError = (state) => state.samples.error;
