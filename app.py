import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///db/collision.sqlite")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/collision.sqlite"
db = SQLAlchemy(app)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/area_name")
def names():
     areas = engine.execute(f'select distinct AreaName from traffic_collision')
     result = {'available_areas': [dict(row) for row in areas]}
     return jsonify(result)

@app.route('/get_city_by_name/<name>')
def get_city_by_name(name):
     data = engine.execute(f'select * from traffic_collision where "AreaName" = "{name}";')
     result = {'city': [dict(row) for row in data]}
     return jsonify(result)

@app.route('/get_city_by_zip/<zip>')
def get_city_by_zip(zip):
     data = engine.execute(f'select * from traffic_collision where "ZipCodes" = "{zip}";')
     result = {'zip': [dict(row) for row in data]}
     return jsonify(result)

if __name__=="__main__":
     app.run()