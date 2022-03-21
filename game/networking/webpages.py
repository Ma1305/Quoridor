from networking.web_setup import *


@app.route("/", methods=["POST", "GET"])
@app.route("/main", methods=["POST", "GET"])
@app.route("/home", methods=["POST", "GET"])
def home():
    if request.method == "POST":
        return redirect(url_for("game"))
    else:
        return render_template("home.html")


@app.route("/game", methods=["POST", "GET"])
def game():
    if request.method == "POST":
        nickname = request.form["nickname"]
        return render_template("game.html", nickname=nickname)
    else:
        return render_template("open_game.html")
