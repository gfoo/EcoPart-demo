import GitHubIcon from "@mui/icons-material/GitHub";
import { Container, Grid } from "@mui/material";
import Map from "./components/Map";
import MapHeader from "./components/MapHeader";
import ProjectsSelector from "./components/ProjectsSelector";
function App() {
  return (
    <Container>
      <Grid container space={2}>
        <Grid item xs={2}>
          <h2>EcoPart demo </h2>
        </Grid>
        <Grid item xs={2}>
          <p>
            [ more details on{" "}
            <a
              href="https://github.com/gfoo/EcoPart-demo"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon />
            </a>{" "}
            ]
          </p>
        </Grid>
      </Grid>

      <ProjectsSelector />
      <MapHeader />
      <Map />
    </Container>
  );
}

export default App;
