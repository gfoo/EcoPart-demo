import argparse
import json
import logging
import profile
import sys
from datetime import datetime

from database import get_db
from models import (DBCruise, DBEcoPartProject, DBEcoTaxaProject, DBProfile,
                    DBSample, DBShip)

DATA_STAMP = datetime.now().strftime("%Y-%m-%d_%H:%M:%S")

logging.getLogger().setLevel(logging.INFO)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)-15s | %(levelname)-8s %(module)s | %(message)s',
    handlers=[
        # logging.FileHandler(
        #     filename=f'{os.path.basename(__file__).replace(".py","")}_{DATA_STAMP}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


def extract_ecopart_project(sample):
    project = [v.strip() for v in sample["Project"].rsplit('(', 1)]
    id = project[1].split(')')[0].strip()
    name = project[0]
    return DBEcoPartProject(id=id, name=name)


def extract_ecotaxa_project(sample):
    project = [v.strip() for v in sample["Ecotaxa Project"].rsplit('(', 1)]
    id = project[1].split(')')[0].strip()
    if id == "None":
        id = 0
    name = project[0]
    return DBEcoTaxaProject(id=id, name=name)


def extract_field_as_object(sample, key, class_):
    return class_(name=sample[key])


def extract_sample(sample, ecopart_project_id, ecotaxa_project_id,
                   profile_name, ship_name, cruise_name):
    return DBSample(
        id=sample["id"],
        ecopart_project_id=ecopart_project_id,
        ecotaxa_project_id=ecotaxa_project_id,
        lat=sample['lat'],
        lng=sample['long'],
        visibility=sample['visibility'],
        datetime=datetime.strptime(
            sample['Date/Time'], "%Y-%m-%d %H:%M") if sample['Date/Time'] != "None" else None,
        profile_name=profile_name,
        ship_name=ship_name,
        cruise_name=cruise_name
    )


def main(samples_data_file) -> None:
    logger.info(f"Extracting initial data from {samples_data_file}")
    with open(samples_data_file) as f:
        data = json.load(f)
        ecopart_projects = {}
        ecotaxa_projects = {}
        samples = []
        profiles = {}
        ships = {}
        cruises = {}
        for sample_id in data:
            sample_data = data[sample_id]
            # ecopart project
            ecopart_project = extract_ecopart_project(sample_data)
            if ecopart_project.id not in ecopart_projects:
                ecopart_projects[ecopart_project.id] = ecopart_project
            elif ecopart_project.name != ecopart_projects[ecopart_project.id].name:
                raise Exception(
                    f"Found different names ({ecopart_project.name} != {ecopart_projects[ecopart_project.id].name}) for same Project {sample_id}!")
            # ecotaxa project
            ecotaxa_project = extract_ecotaxa_project(sample_data)
            if ecotaxa_project.id not in ecotaxa_projects:
                ecotaxa_projects[ecotaxa_project.id] = ecotaxa_project
            elif ecotaxa_project.name != ecotaxa_projects[ecotaxa_project.id].name:
                raise Exception(
                    f"Found different names ({ecotaxa_project.name} != {ecotaxa_projects[ecotaxa_project.id].name}) for same Project {sample_id}!")
            # profile
            profile = extract_field_as_object(
                sample_data, "Profile ID", DBProfile)
            profiles[profile.name] = profile
            # ship
            ship = extract_field_as_object(sample_data, "Ship", DBShip)
            ships[ship.name] = ship
            # cruise
            cruise = extract_field_as_object(sample_data, "Cruise", DBCruise)
            cruises[cruise.name] = cruise
            # samples
            sample = extract_sample(
                sample_data,
                ecopart_project_id=ecopart_project.id,
                ecotaxa_project_id=ecotaxa_project.id,
                profile_name=profile.name,
                ship_name=ship.name,
                cruise_name=cruise.name
            )
            samples.append(sample)

    db = next(get_db())
    logger.info(f"Inserting {len(ecopart_projects)} EcoPArt projects...")
    db.bulk_save_objects(ecopart_projects.values())
    logger.info(f"Inserting {len(ecotaxa_projects)} EcoPArt projects...")
    db.bulk_save_objects(ecotaxa_projects.values())
    logger.info(f"Inserting {len(profiles)} profiles...")
    db.bulk_save_objects(profiles.values())
    logger.info(f"Inserting {len(ships)} ships...")
    db.bulk_save_objects(ships.values())
    logger.info(f"Inserting {len(cruises)} cruises...")
    db.bulk_save_objects(cruises.values())
    logger.info(f"Inserting {len(samples)} samples...")
    db.bulk_save_objects(samples)
    logger.info(f"Commit...")
    db.commit()
    logger.info("Initial data created")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="""
        Import all EcoPart data into an empty database.
        """, formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("-d", "--samples-data-file",
                        help="Samples full data file",
                        required=True)
    args = parser.parse_args()
    main(args.samples_data_file)
