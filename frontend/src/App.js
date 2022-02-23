import { Autocomplete, Container, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export const BACKEND_API_CLIENT = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API_URL}`,
});

function App() {
  const [projects, setProjects] = useState([]);
  const [samples, setSamples] = useState([]);

  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    async function getProjects() {
      const response_projects = await BACKEND_API_CLIENT.get(
        "/ecopart_projects/?limit=1000"
      );
      setProjects(response_projects.data);
    }
    getProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      if (selectedProjects && selectedProjects.length > 0) {
        const asyncSamples = selectedProjects.map(async (project) => {
          const response = await BACKEND_API_CLIENT.get(
            `/ecopart_projects/${project.id}/samples`
          );
          return response.data;
        });
        Promise.all(asyncSamples).then((responses) =>
          setSamples(responses.flat())
        );
      } else {
        // TODO: get samples of map viewing zone
        setSamples([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProjects]
  );

  const defaultProps = {
    options: projects,
    getOptionLabel: (p) => `${p.name} (${p.id})`,
  };

  return (
    <Container>
      <h2>EcoPart demo</h2>
      <Autocomplete
        multiple
        {...defaultProps}
        sx={{
          width: 700,
        }}
        disablePortal
        id="combo-box-demo"
        renderInput={(params) => (
          <TextField {...params} label="EcoPart project name" />
        )}
        onChange={(event, newValue) => {
          setSelectedProjects(newValue);
        }}
      />
      {selectedProjects && selectedProjects.length > 0 && (
        <>
          <p>{samples.length} Samples of selected projects</p>
          {samples.map((s) => (
            <p key={s.id}>{JSON.stringify(s)}</p>
          ))}
        </>
      )}
    </Container>
  );
}

export default App;
