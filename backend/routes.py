import os
from flask import request, jsonify, send_from_directory, abort
from werkzeug.utils import secure_filename
from app import app, db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    identity = get_jwt_identity()
    user = User.query.filter_by(email=identity['email']).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user_data = {
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "organizationName": user.organization,
        "address": user.address,
        "profilePictureUrl": user.profile_picture
    }
    return jsonify(user_data), 200

@app.route('/update-profile', methods=['POST'])
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    user = User.query.filter_by(email=identity['email']).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if 'profilePicture' in request.files:
        file = request.files['profilePicture']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            user.profile_picture = filename  # Save the filename to the database

    user.first_name = request.form.get('firstName', user.first_name)
    user.last_name = request.form.get('lastName', user.last_name)
    user.organization = request.form.get('organization', user.organization)
    user.address = request.form.get('address', user.address)

    db.session.commit()
    return jsonify({"msg": "Profile updated successfully", "profilePictureUrl": user.profile_picture}), 200

@app.route('/uploads/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        abort(404)

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
