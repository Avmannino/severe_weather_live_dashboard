from flask import request, jsonify
from werkzeug.security import generate_password_hash
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

