import argparse
import json
import logging
import os
import sys
import time
from datetime import datetime
from urllib.error import HTTPError

import requests

DATA_STAMP = datetime.now().strftime("%Y-%m-%d_%H:%M:%S")

logging.getLogger().setLevel(logging.INFO)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)-15s | %(levelname)-8s %(module)s | %(message)s',
    handlers=[
        logging.FileHandler(
            filename=f'{os.path.basename(__file__).replace(".py","")}_{DATA_STAMP}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

ECOPART_API_URL = "https://ecopart.obs-vlfr.fr"
ECOPART_API_URL_SEARCH = f"{ECOPART_API_URL}/searchsample"
ECOPART_GET_SAMPLE_API_URL = f"{ECOPART_API_URL}/getsamplepopover"


def retrieve_samples_list():
    logger.info("Retrieving all samples from " +
                ECOPART_API_URL_SEARCH+" ...")
    try:
        response = requests.get(ECOPART_API_URL_SEARCH)
        response.raise_for_status()
    except HTTPError as http_err:
        logger.error(f'HTTP error occurred: {http_err}')
        sys.exit(1)
    except Exception as err:
        logger.error(f'Other error occurred: {err}')
        sys.exit(1)
    else:
        samples = response.json()
        samples_file = f'samples_{DATA_STAMP}.json'
        with open(samples_file, 'w') as f:
            json.dump(samples, f, indent=2)
        logger.info(f"Created file {samples_file}")
        return samples


def retrieve_sample_data(sample_id: int, log_prefix=""):
    url = f"{ECOPART_GET_SAMPLE_API_URL}/{sample_id}"
    logger.info(
        f"{log_prefix} Retrieving sample data id={sample_id} from {url} ...")
    try:
        response = requests.get(url)
        response.raise_for_status()
    except HTTPError as http_err:
        logger.error(f'HTTP error occurred: {http_err}')
        sys.exit(1)
    except Exception as err:
        logger.error(f'Other error occurred: {err}')
        sys.exit(1)
    else:
        sample = {}
        for v in response.text.replace('\n', '').split('<br>'):
            [k, v] = [x.strip() for x in v.split(':', 1)]
            sample[k] = v
        return sample


def main(samples_file, samples_data_file, limit_load_samples, sleep_time):

    logger.info(f'Samples list file to re-use: {samples_file}')
    logger.info(f'Samples data file to re-use: {samples_data_file}')
    logger.info(f'Limit number of samples to load: {limit_load_samples}')
    logger.info(
        f'Sleep time between sample get data calls: {sleep_time} second(s)')

    samples = None
    if samples_file:
        samples = json.load(open(samples_file))
    else:
        samples = retrieve_samples_list()
    logger.info(f"Found {len(samples)} samples")

    samples_data = {}
    if samples_data_file:
        # load existing data
        samples_data = json.load(open(samples_data_file))
    logger.info(f"Found {len(samples_data)} samples data")

    logger.info(f"Retrieving data of {len(samples)} samples...")
    nb_loaded = 0
    nb_skipped = 0
    samples_data_file = f'samples-data_{DATA_STAMP}.json'
    # cover all samples to update samples_data
    for sample in samples:
        sample_id = int(sample['id'])
        if str(sample['id']) not in samples_data:
            nb_loaded += 1
            sample_data = retrieve_sample_data(
                sample_id, f"({nb_loaded}{f'/{limit_load_samples}' if limit_load_samples else ''})")
            if sleep_time:
                time.sleep(float(sleep_time))
            samples_data[sample_id] = {
                **sample,
                **sample_data
            }
            with open(samples_data_file, 'w') as f:
                json.dump(samples_data, f, indent=2)
            if limit_load_samples is not None and int(limit_load_samples) == nb_loaded:
                break
        else:
            nb_skipped += 1

    logger.info(f"Created file {samples_data_file}")
    logger.info(
        f"Retrieved samples data (nb_loaded={nb_loaded}/nb_skipped={nb_skipped}) done.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="""
        Tool to retrieve all data from EcoPart project 
        Picheral M, Colin S, Irisson J-O (2017). EcoTaxa, a tool for the taxonomic classification of images. http://ecotaxa.obs-vlfr.fr
        
        /!\ Pay attention to not overload the server when using this tool, ask for permission :) /!\ 

        -1- Retrieve list of samples or provide existing one with --samples-file
        -2- Retrieve/update sample data from list of samples or provide existing one with --samples-data-file to update

        On 2022 Feb, 18351 samples are available, retrieve this list take few seconds, but then get the data
        of each sample requires each time a call to the API :/ 
        About 1 sec per sample => ~18000 secs = ~5 hours ! 

        """, formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("-l", "--limit-load-samples",
                        help="Limit number of samples to load")
    parser.add_argument("-t", "--sleep-time",
                        help="Seconds to sleep between each sample data call")
    parser.add_argument("-s", "--samples-file", help="Samples list file")
    parser.add_argument("-d", "--samples-data-file",
                        help="Samples full data file")
    args = parser.parse_args()
    main(args.samples_file, args.samples_data_file,
         args.limit_load_samples, args.sleep_time)
