from flask import request, jsonify
from app import app, db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data:", data)  

    # Extracting data
    email = data.get('email')
    first_name = data.get('firstName')  
    last_name = data.get('lastName')    
    organization = data.get('organization', '')
    password = data.get('password')

    # Check for missing fields
    if not email or not first_name or not last_name or not password:
        print("Missing required fields")  # Debugging log
        return jsonify({"msg": "Missing required fields"}), 400

    # Check if the user already exists
    if User.query.filter_by(email=email).first():
        print("Email already exists")  
        return jsonify({"msg": "Email already exists"}), 400

    # Create a new user
    new_user = User(email=email, first_name=first_name, last_name=last_name, organization=organization, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity={'email': user.email})
    return jsonify(access_token=access_token), 200
