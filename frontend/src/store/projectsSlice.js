import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllProjects } from "../lib/api";
import {
  FETCH_STATUS_FAILED,
  FETCH_STATUS_IDLE,
  FETCH_STATUS_LOADING,
  FETCH_STATUS_SUCCESSED,
} from "./helpers";

const initialState = {
  projects: [],
  status: FETCH_STATUS_IDLE,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  fetchAllProjects
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = FETCH_STATUS_SUCCESSED;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.pending, (state, action) => {
        state.status = FETCH_STATUS_LOADING;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = FETCH_STATUS_FAILED;
        state.error = action.error.message;
      });
  },
});

export default projectsSlice.reducer;

export const selectAllProjects = (state) => state.projects.projects;
export const fetchProjectsStatus = (state) => state.projects.status;
export const fetchProjectsError = (state) => state.projects.error;
