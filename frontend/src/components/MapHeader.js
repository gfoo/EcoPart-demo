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
import { useEffect } from "react";
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
  selectSamplesAndMaxIndexByProjectId,
} from "../store/samplesSlice";

const NoProject = "";

const MapHeader = () => {
  const dispatch = useDispatch();
  const samples = useSelector(selectSamples);
  const status = useSelector(selectFetchSamplesStatus);
  const error = useSelector(selectFetchSamplesError);
  const autofitBounds = useSelector(selectAutofitBounds);
  const viewTrack = useSelector(selectViewTrack);
  const selectedProjects = useSelector(selectSelectedProjects);
  const trackedProject = useSelector(selectTrackedProject);
  const highlightedIndex = useSelector(selectHighlightedIndex);
  const [trackedProjectSamples, trackedProjectMaxIndex] = useSelector((state) =>
    selectSamplesAndMaxIndexByProjectId(state, trackedProject?.id)
  );

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
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={5}>
          <FormControl fullWidth>
            <InputLabel id="select-label">Project to track</InputLabel>
            <Select
              labelId="select-label"
              value={trackedProject || NoProject}
              defaultValue={trackedProject || NoProject}
              label="Project to track"
              onChange={(e) => dispatch(trackProject(e.target.value))}
            >
              {selectedProjects.length > 0 && (
                <MenuItem key={NoProject} value={NoProject}>
                  <p>{NoProject}</p>
                </MenuItem>
              )}
              {selectedProjects.map((p) => {
                return (
                  <MenuItem key={p.id + p.name} value={p}>
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
