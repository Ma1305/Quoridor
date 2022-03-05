from networking.web_setup import *


@app.route("/")
@app.route("/main")
@app.route("/home")
def home():
    return render_template("game.html")
