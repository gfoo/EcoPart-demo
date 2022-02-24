import { Container } from "@mui/material";
import Map from "./components/Map";
import ProjectsSelector from "./components/ProjectsSelector";

function App() {
  return (
    <Container>
      <h2>EcoPart demo</h2>
      <ProjectsSelector />
      <Map />
    </Container>
  );
}

export default App;
