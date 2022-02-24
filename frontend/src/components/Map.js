import { Alert, CircularProgress, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { FETCH_STATUS_FAILED, FETCH_STATUS_LOADING } from "../store/helpers";
import {
  fetchSamplesError,
  fetchSamplesStatus,
  selectAllSamples,
} from "../store/samplesSlice";

const Map = () => {
  const samples = useSelector(selectAllSamples);
  const status = useSelector(fetchSamplesStatus);
  const error = useSelector(fetchSamplesError);

  return (
    <>
      {samples.length > 0 && (
        <Container
          sx={{
            marginTop: "20px",
            marginLeft: "10px",
            height: "30px",
          }}
        >
          Fetched {samples.length} samples from selected projects{"  "}
          {status === FETCH_STATUS_LOADING && <CircularProgress size={20} />}
        </Container>
      )}
      {status === FETCH_STATUS_FAILED && (
        <Alert severity="error">{error}</Alert>
      )}
    </>
  );
};

export default Map;
