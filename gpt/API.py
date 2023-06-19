from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt import GPT
import os

API = Flask(__name__)
CORS(API)
gpt = GPT()

@API.route("/getPDF", methods=["POST"])
def getPDF():
    data = request.get_json()
    print(data)

    response = gpt.query(data)

    try:
        return jsonify(response)
    except Exception as e:
        print(f"getPDF ERROR : {e}")

if __name__ == "__main__":
    API.run(host='0.0.0.0',port='5000',debug=False)