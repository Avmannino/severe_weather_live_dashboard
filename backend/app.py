from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

# Initialize Flask application
app = Flask(__name__)

# Enable CORS
CORS(app)

# Configure database
app.config.from_object('config.Config')

# Print configuration for debugging
print("Database URI:", app.config.get('SQLALCHEMY_DATABASE_URI'))

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Import all routes
from routes import *

# List all routes
with app.app_context():
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}, Route: {rule}")

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
