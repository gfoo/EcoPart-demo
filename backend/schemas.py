

from datetime import datetime

from pydantic import BaseModel


class BaseObject(BaseModel):
    class Config:
        orm_mode = True


class Profile(BaseObject):
    name: str


class Ship(BaseObject):
    name: str


class Cruise(BaseObject):
    name: str


class IdentifiedObject(BaseObject):
    id: int


class Project(IdentifiedObject):
    name: str


class EcoPartProject(Project):
    ...


class EcoTaxaProject(Project):
    ...


class Sample(IdentifiedObject):
    lat: float
    lng: float
    datetime: datetime


class SampleDetails(Sample):
    visibility: str
    ecopart_project: EcoPartProject
    ecotaxa_project: EcoTaxaProject
    profile: Profile
    ship: Ship
    cruise: Cruise
