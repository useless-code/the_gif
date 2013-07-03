#! -*- coding: utf8 -*-

import json
import glob
import os

GIF_DIR = 'gifs'

names = glob.glob(os.path.join(GIF_DIR, '*'))

with open("gifs.js", 'w') as file:
    file.write('window.gif_list = %s;' % json.dumps(names))
