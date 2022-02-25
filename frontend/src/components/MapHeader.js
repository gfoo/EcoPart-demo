import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_STATUS_FAILED,
  FETCH_STATUS_IDLE,
  FETCH_STATUS_LOADING,
  FETCH_STATUS_SUCCESSED,
} from "../store/helpers";
import {
  autofitBoundsEnable,
  selectAutofitBounds,
  selectViewTrack,
  viewTrackEnable,
} from "../store/mapFilteringSlice";
import {
  selectFetchSamplesError,
  selectFetchSamplesStatus,
  selectSamples,
} from "../store/samplesSlice";

const MapHeader = () => {
  const samples = useSelector(selectSamples);
  const status = useSelector(selectFetchSamplesStatus);
  const error = useSelector(selectFetchSamplesError);
  const dispatch = useDispatch();
  const autofitBounds = useSelector(selectAutofitBounds);
  const viewTrack = useSelector(selectViewTrack);

  return (
    <Grid container>
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
      <Grid item xs={12}>
        {status === FETCH_STATUS_FAILED && (
          <Alert severity="error">{error}</Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default MapHeader;
