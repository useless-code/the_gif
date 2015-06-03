from flask import Flask, render_template, url_for
app = Flask(__name__)
DEBUG = True
app.config.from_object(__name__)


@app.route("/")
def index():
    return render_template('index.html')

@app.route('/g/<string:user>/<string:gallery>/<string:image_id>/')
def gif_detail(user, gallery, image_id):
    return render_template('gif.html', user=user, gallery=gallery, image_id=image_id)

if __name__ == "__main__":
    app.run()
