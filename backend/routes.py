from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from models import User

print("routes.py has been imported")

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    organization = data.get('organization')
    password = generate_password_hash(data.get('password'), method='pbkdf2:sha256')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 400

    new_user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        organization=organization,
        password=password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401

    return jsonify({'message': 'Login successful'}), 200

@app.route('/update_user', methods=['PUT'])
def update_user():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.first_name = data.get('firstName', user.first_name)
    user.last_name = data.get('lastName', user.last_name)
    user.organization = data.get('organizationName', user.organization)
    user.address = data.get('address', user.address)
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})
