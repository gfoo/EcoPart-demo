import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./projectsSlice";
import samplesReducer from "./samplesSlice";

export default configureStore({
  reducer: {
    projects: projectsReducer,
    samples: samplesReducer,
  },
});
