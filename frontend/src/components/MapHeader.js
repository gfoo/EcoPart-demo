import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_STATUS_FAILED,
  FETCH_STATUS_IDLE,
  FETCH_STATUS_LOADING,
  FETCH_STATUS_SUCCESSED,
} from "../store/helpers";
import {
  autofitBoundsEnable,
  highlighIndex,
  selectAutofitBounds,
  selectHighlightedIndex,
  selectTrackedProject,
  selectViewTrack,
  trackProject,
  viewTrackEnable,
} from "../store/mapFilteringSlice";
import { selectSelectedProjects } from "../store/projectsSlice";
import {
  selectFetchSamplesError,
  selectFetchSamplesStatus,
  selectSamples,
} from "../store/samplesSlice";

const NoProject = " ";

const MapHeader = () => {
  const dispatch = useDispatch();
  const samples = useSelector(selectSamples);
  const status = useSelector(selectFetchSamplesStatus);
  const error = useSelector(selectFetchSamplesError);
  const autofitBounds = useSelector(selectAutofitBounds);
  const viewTrack = useSelector(selectViewTrack);
  const selectedProjects = useSelector(selectSelectedProjects);
  const trackedProject = useSelector(selectTrackedProject);
  const [trackedProjectSamples, setTrackedProjectSamples] = useState([]);
  const [trackedProjectMaxIndex, setTrackedProjectMaxIndex] = useState(1);
  const highlightedIndex = useSelector(selectHighlightedIndex);

  useEffect(() => {
    dispatch(highlighIndex(0));
    if (trackedProject && samples.length > 0) {
      const pSamples = samples.filter(
        (s) => s.project_id === trackedProject.id
      );
      setTrackedProjectSamples(pSamples);
      setTrackedProjectMaxIndex(Math.max(...pSamples.map((s) => s.index_)));
    } else {
      setTrackedProjectMaxIndex(1);
      setTrackedProjectSamples([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackedProject, samples]);

  useEffect(() => {
    if (
      selectedProjects.length <= 0 ||
      (trackedProject &&
        !selectedProjects.find((p) => p.id === trackedProject.id))
    ) {
      dispatch(trackProject(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        {(status === FETCH_STATUS_IDLE ||
          (samples.length <= 0 && status !== FETCH_STATUS_LOADING)) && (
          <p>No samples to view</p>
        )}
        {status === FETCH_STATUS_SUCCESSED && samples.length > 0 && (
          <p>Viewing {samples.length} samples</p>
        )}
        {status === FETCH_STATUS_LOADING && (
          <p>
            Fetching samples <CircularProgress size={20} />
          </p>
        )}
      </Grid>
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={autofitBounds}
              onChange={(e) => dispatch(autofitBoundsEnable(e.target.checked))}
            />
          }
          label="Auto fit samples bounds"
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Project to track
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={trackedProject || NoProject}
              defaultValue={trackedProject || NoProject}
              label="Project to track"
              onChange={(e) => dispatch(trackProject(e.target.value))}
            >
              {selectedProjects.length > 0 && (
                <MenuItem key={-1} value={NoProject}>
                  <p>{NoProject}</p>
                </MenuItem>
              )}
              {selectedProjects.map((p) => {
                return (
                  <MenuItem key={p.id} value={p}>
                    {p.name} ({p.id})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Slider
            size="small"
            disabled={trackedProject === null}
            defaultValue={1}
            value={highlightedIndex}
            min={1}
            max={trackedProjectMaxIndex}
            valueLabelDisplay="auto"
            marks={[
              {
                value: 1,
                label: "1",
              },
              {
                value: trackedProjectMaxIndex,
                label: `${trackedProjectMaxIndex}`,
              },
            ]}
            onChange={(e, v) => dispatch(highlighIndex(v))}
            valueLabelFormat={(v) => {
              const s = trackedProjectSamples.find((s) => s.index_ === v);
              return s ? `${v} (${s.datetime})` : v;
            }}
          ></Slider>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={viewTrack}
                onChange={(e) => dispatch(viewTrackEnable(e.target.checked))}
              />
            }
            label="View track"
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {status === FETCH_STATUS_FAILED && (
          <Alert severity="error">{error}</Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default MapHeader;
