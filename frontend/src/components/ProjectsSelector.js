import {
  Alert,
  Autocomplete,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_STATUS_FAILED,
  FETCH_STATUS_IDLE,
  FETCH_STATUS_LOADING,
} from "../store/helpers";
import {
  fetchProjects,
  fetchProjectsError,
  fetchProjectsStatus,
  selectAllProjects,
} from "../store/projectsSlice";
import { fetchSamples } from "../store/samplesSlice";

const ProjectsSelector = () => {
  const projects = useSelector(selectAllProjects);
  const status = useSelector(fetchProjectsStatus);
  const error = useSelector(fetchProjectsError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === FETCH_STATUS_IDLE) {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  const defaultProps = {
    options: projects,
    getOptionLabel: (p) => `${p.name} (${p.id})`,
  };

  return (
    <Autocomplete
      multiple
      {...defaultProps}
      sx={{
        width: 700,
      }}
      disablePortal
      id="combo-box-demo"
      renderInput={(params) => (
        <>
          <Box sx={{ position: "relative" }}>
            <TextField {...params} label="EcoPart project name" />
            {status === FETCH_STATUS_LOADING && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
          {status === FETCH_STATUS_FAILED && (
            <Alert severity="error">{error}</Alert>
          )}
        </>
      )}
      onChange={(event, newValue) => {
        dispatch(fetchSamples(newValue.map((p) => p.id)));
      }}
    />
  );
};

export default ProjectsSelector;
