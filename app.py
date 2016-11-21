import os
from flask import Flask
from flask import jsonify
from flask import render_template
import requests

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather')
def weather_api():

    r = requests.get('http://api.openweathermap.org/data/2.5/weather?id=6458924&APPID=acfc33c824b851fa7cbeafbbb0514942')
    return r.text

if __name__ == '__main__':
    app.run()
