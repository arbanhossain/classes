from turtle import title
from flask import Flask, render_template, request, Response, jsonify

app = Flask(__name__)

@app.route('/')
def index():
	print(request.args.get('pass'))
	return render_template('home.html', title="Home")

if __name__ == "__main__":
    app.run()