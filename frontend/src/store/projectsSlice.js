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
  selectedProjectIds: [],
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
  reducers: {
    selectedProjects(state, action) {
      const { projectIds } = action.payload;
      if (projectIds) {
        state.selectedProjectIds = state.projects
          .filter((p) => projectIds.includes(p.id))
          .map((p) => p.id);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = FETCH_STATUS_SUCCESSED;
        state.selectedProjectIds = [];
        state.projects = action.payload;
      })
      .addCase(fetchProjects.pending, (state, action) => {
        state.status = FETCH_STATUS_LOADING;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = FETCH_STATUS_FAILED;
        state.selectedProjectIds = [];
        state.error = action.error.message;
      });
  },
});

export const { selectedProjects } = projectsSlice.actions;

export default projectsSlice.reducer;

export const selectSelectedProjects = (state) =>
  state.projects.projects.filter((p) =>
    state.projects.selectedProjectIds.includes(p.id)
  );
export const selectProjects = (state) => state.projects.projects;
export const selectFetchProjectsStatus = (state) => state.projects.status;
export const selectFetchProjectsError = (state) => state.projects.error;
