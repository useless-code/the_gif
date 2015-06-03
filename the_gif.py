from flask import Flask, render_template
from galleries import url_tree

app = Flask(__name__)
DEBUG = True
app.config.from_object(__name__)


@app.route("/")
def index():
    return render_template('index.html')

#@app.route('/about/')
#def about():
#    pass

@app.route('/g/<string:gallery>/<string:gif_id>/')
def gif_detail(gallery, gif_id):
    url = url_tree[gallery][gif_id]
    return render_template('gif.html', gallery=gallery, gif_id=gif_id, url=url)

if __name__ == "__main__":
    app.run()
