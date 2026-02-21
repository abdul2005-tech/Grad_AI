from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from datetime import datetime, timezone
import os
import pickle
import pandas as pd

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    __tablename__ = "placement_users"   # 👈 ADD THIS

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Prediction(db.Model):
    __tablename__ = "placement_predictions"   # 👈 ADD THIS

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('placement_users.id'))
    input_data = db.Column(db.JSON)
    result = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

# Load ML Model
model_path = os.path.join(os.path.dirname(__file__), "placement_model.pkl")
model = pickle.load(open(model_path, "rb"))

with app.app_context():
    db.create_all() # Creates tables in Render Postgres

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"msg": "User already exists"}), 400
    hashed_pw = generate_password_hash(data["password"])
    new_user = User(username=data["username"], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()
    if user and check_password_hash(user.password, data["password"]):
        token = create_access_token(identity=str(user.id))
        return jsonify(access_token=token)
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    data = request.json
    df = pd.DataFrame([data])
    pred = model.predict(df)[0]
    result = "Placed" if pred == 1 else "Not Placed"
    
    user_id = int(get_jwt_identity())
    record = Prediction(user_id=user_id, input_data=data, result=result)
    db.session.add(record)
    db.session.commit()
    return jsonify({"prediction": result})

@app.route("/history", methods=["GET"])
@jwt_required()
def history():
    user_id = int(get_jwt_identity())
    records = Prediction.query.filter_by(user_id=user_id).all()
    return jsonify([{"result": r.result, "date": r.created_at.isoformat()} for r in records])

if __name__ == "__main__":
    app.run()