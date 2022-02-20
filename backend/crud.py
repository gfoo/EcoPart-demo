
from operator import and_

from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from models import DBEcoPartProject, DBSample


def get_sample(db: Session, sample_id: int):
    return db.query(DBSample).filter(DBSample.id == sample_id).first()


def get_samples_from_box(db: Session, north_east_lat: float, north_east_lng: float, south_west_lat: float, south_west_lng: float):
    return db.query(DBSample).filter(
        and_(
            DBSample.lat >= south_west_lat,
            DBSample.lng >= south_west_lng,
            DBSample.lat <= north_east_lat,
            DBSample.lng <= north_east_lng,
        )
    ).all()


def get_ecopart_project(db: Session, project_id: int):
    return (
        db.query(DBEcoPartProject)
        .filter(
            DBEcoPartProject.id == project_id
        )
        .first())


def get_ecopart_projects(db: Session, skip: int = 0, limit: int = 10):
    return db.query(DBEcoPartProject).offset(skip).limit(limit).all()


def get_ecopart_projects_name_contains(db: Session, pattern: str, skip: int = 0, limit: int = 100):
    return (
        db.query(DBEcoPartProject)
        .filter(
            func.lower(DBEcoPartProject.name).contains(pattern.lower())
        )
        .offset(skip)
        .limit(limit)
        .all())
