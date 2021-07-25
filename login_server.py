import os
from string import Template
from flask import Flask, request, send_file, jsonify

import requests
import json


app = Flask(__name__)
pwd = os.path.dirname(__file__)

HOST = "127.0.0.1"
PORT = 5000

TOKEN = "1234567890"


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/user/login', methods=['POST'])
def user_login():
    "User login and return access token"
    username = request.json.get('username')
    if username == 'admin':
        return jsonify({'token': TOKEN}), 200
    else:
        print(username)
        return jsonify({'code': 204, 'msg': 'username or password error', 'token': TOKEN}), 204


@app.route('/user/me', methods=['GET'])
def user_home():
    print(request.headers.get("Authorization"))
    token = request.headers.get("Authorization").split("+")[1]
    if token == TOKEN:
        return jsonify({'code': 200, 'msg': 'login success', 'data': {'username': 'admin'}}), 200
    else:
        return jsonify({'code': 204, 'msg': 'login failed'}), 204

# @app.route('/user/logout', methods=['GET','POST'])


@ app.route('/api/search', methods=['GET'])
def search_by_tag():
    params = {"format": "json", "nojsoncallback": 1}
    params.update(request.args)
    x = requests.get(
        'https://www.flickr.com/services/feeds/photos_public.gne', params=params)

    return jsonify({'code': 200, 'msg': 'search success', 'data': x.text})


if __name__ == '__main__':
    app.run(host=HOST, port=PORT)
