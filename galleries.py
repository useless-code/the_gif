import gzip
import json
from collections import namedtuple

import requests

url_template = "https://picasaweb.google.com/data/feed/api/user/{user}/albumid/{id}/?alt=json"

Register = namedtuple('Register', "gallery, gif_id, url")

galleries = {
    "a": {"id": "5898807933959509569", "user": "113288886837539699792",},
    "b": {"id": "5911386033286256529", "user": "114337695162527210679",},
    "c": {"id": "5932806704917310497", "user": "114337695162527210679",},
    "d": {"id": "5994764155968303073", "user": "114337695162527210679",},
    "e": {"id": "6068692168380258801", "user": "114337695162527210679",},
}

simbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

def encode(number):
    total_simbols = len(simbols)
    out = ''
    while number:
        number, mod = divmod(number, total_simbols)
        out += simbols[mod]

    return out



all_gifs = []
url_tree = {}

for id, gallery in galleries.items():
    url = url_template.format(**gallery)
    r = requests.get(url)
    for entry in r.json()['feed']['entry']:
        url = entry['media$group']['media$content'][0]['url']
        gif_id = encode(int(entry['gphoto$id']['$t']))

        gallery_fold = url_tree.setdefault(id, {})
        gallery_fold[gif_id] = url

        all_gifs.append(Register(id, gif_id, url))


with gzip.open('static/data.json.gz', 'w') as fh:
    json.dump(all_gifs, fh)
