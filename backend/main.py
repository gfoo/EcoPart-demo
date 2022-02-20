

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from config import settings
from database import get_db
from schemas import EcoPartProject, Sample, SampleDetails

app = FastAPI(title=settings.PROJECT_NAME)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin)
                       for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/ecopart_projects/", response_model=list[EcoPartProject])
def get_ecopart_projects(pattern: str = None, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    if pattern:
        return crud.get_ecopart_projects_name_contains(db, pattern, skip=skip, limit=limit)
    return crud.get_ecopart_projects(db, skip=skip, limit=limit)


@app.get("/ecopart_projects/{project_id}", response_model=EcoPartProject)
def get_ecopart_project(project_id: int, db: Session = Depends(get_db)):
    return crud.get_ecopart_project(db, project_id)


@app.get("/ecopart_projects/{project_id}/samples", response_model=list[Sample])
def get_ecopart_project_samples(project_id: int, db: Session = Depends(get_db)):
    return crud.get_ecopart_project(db, project_id).samples


@app.get("/samples/{sample_id}", response_model=SampleDetails)
def get_sample(sample_id: int, db: Session = Depends(get_db)):
    return crud.get_sample(db, sample_id)


@app.get("/samples/{north_east_lat}/{north_east_lng}/{south_west_lat}/{south_west_lng}", response_model=list[Sample])
def get_samples_from_box(north_east_lat: float, north_east_lng: float, south_west_lat: float, south_west_lng: float, db: Session = Depends(get_db)):
    return crud.get_samples_from_box(db, north_east_lat, north_east_lng, south_west_lat, south_west_lng)
