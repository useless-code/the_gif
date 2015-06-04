from flask.ext.frozen import Freezer
from galleries import all_gifs
from the_gif import app

freezer = Freezer(app)

@freezer.register_generator
def gif_detail():
    for register in all_gifs:
        yield register.__dict__

if __name__ == '__main__':
    freezer.freeze()
