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
        const groupedByProj = action.payload.reduce((res, sample) => {
          const projId = sample.project_id;
          if (!(projId in res)) {
            res[projId] = [];
          }
          res[projId].push(sample);
          return res;
        }, {});
        const projSamplesIndexed = Object.values(groupedByProj).map(
          (projSamples) =>
            projSamples
              .sort((s1, s2) => s1.datetime >= s2.datetime)
              .map((s, index) => ({
                ...s,
                index_: index + 1,
              }))
        );
        state.samples = projSamplesIndexed.flat();
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

export const selectSamples = (state) => state.samples.samples;
export const selectSamplesAndMaxIndexByProjectId = (state, projectId) => {
  const samples = state.samples.samples.filter(
    (s) => s.project_id === projectId
  );
  const maxIndex = Math.max(...samples.map((s) => s.index_)) || 1;
  return [samples, maxIndex];
};
export const selectFetchSamplesStatus = (state) => state.samples.status;
export const selectFetchSamplesError = (state) => state.samples.error;
