import os
import logging
from datetime import datetime, timedelta
from utils import utc_to_brasilia

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()
migrate = Migrate()

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "financeiro-inteligente-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Make datetime and timezone functions available in templates
@app.context_processor
def inject_datetime():
    return {
        'datetime': datetime,
        'utc_to_brasilia': utc_to_brasilia
    }

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "postgresql://user:pass@localhost/financeiro_db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Configure Flask-Login
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Por favor, faça login para acessar esta página.'
login_manager.login_message_category = 'info'

# Initialize extensions
db.init_app(app)
login_manager.init_app(app)
migrate.init_app(app, db)

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))

# Register blueprints
from auth import auth_bp
from dashboard import dashboard_bp
from financial import financial_bp
from reports import reports_bp
from subscription import subscription_bp

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
app.register_blueprint(financial_bp, url_prefix='/financial')
app.register_blueprint(reports_bp, url_prefix='/reports')
app.register_blueprint(subscription_bp, url_prefix='/subscription')

@app.route('/')
def index():
    from flask import render_template
    return render_template('index.html')

@app.route('/settings')
def settings():
    from flask import render_template
    from flask_login import login_required
    return render_template('settings/settings.html')

with app.app_context():
    # Import models to ensure tables are created
    import models
    db.create_all()
