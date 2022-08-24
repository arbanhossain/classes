from flask import Flask, render_template, request, Response, jsonify, redirect, url_for

import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import os
import requests

app = Flask(__name__)

cred = credentials.Certificate(requests.get(os.environ['GOOGLE_APPLICATION_CREDENTIALS']).json())
firebase_admin.initialize_app(cred)

db = firestore.client()


routine_ref = db.collection('classes').document(u'static')
noti_ref = db.collection('notifications')

@app.route('/')
def index():
	routine = routine_ref.get()
  # print(routine_ref.to_dict())
  # print([doc.to_dict() for doc in routine])
	noti = [doc.to_dict() for doc in noti_ref.stream()]
	admin = 1 if request.args.get('pass') == os.environ['PASS'] else 0
	return render_template('home.html', title="Home", admin=admin, routine=json.dumps(routine.to_dict()), noti=json.dumps(noti))

@app.route('/update', methods=['POST'])
def update():
	routine = request.get_json()
	print(routine)
	routine_ref.set(routine)
	return jsonify({"redirect": "/"})

@app.route('/update_noti', methods=['POST'])
def update_noti():
	noti = request.get_json()
	doc_ref = noti_ref.document(noti.get('_id'))
	doc_ref.set(noti)
	return jsonify({"redirect": "/"})

@app.route('/delete_noti', methods=['POST'])
def delete_noti():
	noti = request.get_json()
	doc_ref = noti_ref.document(noti.get('_id'))
	doc_ref.delete()
	return jsonify({"redirect": "/"})

if __name__ == "__main__":
    app.run()