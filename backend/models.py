from app import db, bcrypt

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    organization = db.Column(db.String(120))
    password_hash = db.Column(db.String(128), nullable=False)

    def __init__(self, email, first_name, last_name, organization, password):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.organization = organization
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
