
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from database import Base


class DBTablenameMixin(object):

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.replace('DB', '').lower()


class DBIdMixin(object):
    id = Column(Integer, primary_key=True)


class DBProjectMixin(DBIdMixin):
    name = Column(String)


class DBEcoPartProject(DBTablenameMixin, DBProjectMixin, Base):
    samples = relationship("DBSample", back_populates="ecopart_project")


class DBEcoTaxaProject(DBTablenameMixin, DBProjectMixin, Base):
    samples = relationship("DBSample", back_populates="ecotaxa_project")


class DBSample(DBTablenameMixin, DBIdMixin, Base):
    lat = Column(Float)
    lng = Column(Float)
    visibility = Column(String)
    datetime = Column(DateTime)
    ecopart_project = relationship(
        "DBEcoPartProject", back_populates="samples")
    ecopart_project_id = Column(Integer, ForeignKey('ecopartproject.id'))
    ecotaxa_project = relationship(
        "DBEcoTaxaProject", back_populates="samples")
    ecotaxa_project_id = Column(Integer, ForeignKey('ecotaxaproject.id'))
    profile = relationship("DBProfile", back_populates="samples")
    profile_name = Column(String, ForeignKey('profile.name'))
    ship = relationship("DBShip", back_populates="samples")
    ship_name = Column(String, ForeignKey('ship.name'))
    cruise = relationship("DBCruise", back_populates="samples")
    cruise_name = Column(String, ForeignKey('cruise.name'))


class DBProfile(DBTablenameMixin, Base):
    name = Column(String, primary_key=True)
    samples = relationship("DBSample", back_populates="profile")


class DBShip(DBTablenameMixin, Base):
    name = Column(String, primary_key=True)
    samples = relationship("DBSample", back_populates="ship")


class DBCruise(DBTablenameMixin, Base):
    name = Column(String, primary_key=True)
    samples = relationship("DBSample", back_populates="cruise")
