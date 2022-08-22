from flask import Flask, render_template, request, Response, jsonify

app = Flask(__name__)

@app.route('/')
def index():
	admin = 1 if request.args.get('pass') == 'arban' else 0
	return render_template('home.html', title="Home", admin=admin)

if __name__ == "__main__":
    app.run()