from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
import dashboard

load_dotenv()

# Flash app initialization
flask_app = Flask(__name__)

# Dash app initialization
dash_app = dashboard.create_dash(flask_app)

# Comment this out for production
CORS(flask_app)

# Database configuration and initialization
flask_app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///contacts.db"
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(flask_app)

#Serve static files 
frontend_path = os.path.join(os.getcwd(),"..","frontend","dist")

#API routes
import routes
with flask_app.app_context():
    db.create_all()

if __name__ == "__main__":
    flask_app.run(debug=True)
