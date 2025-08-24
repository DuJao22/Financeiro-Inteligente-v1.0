from datetime import datetime, timedelta
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean, default=True)
    
    # Trial and subscription fields
    trial_start_date = db.Column(db.DateTime, default=datetime.utcnow)
    trial_end_date = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(days=7))
    subscription_plan = db.Column(db.String(20), default='trial')  # trial, mei, professional, enterprise
    subscription_status = db.Column(db.String(20), default='trial')  # trial, active, expired, cancelled
    subscription_end_date = db.Column(db.DateTime)
    
    # Relationships
    transactions = db.relationship('Transaction', backref='user', lazy=True, cascade='all, delete-orphan')
    accounts = db.relationship('Account', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_trial_expired(self):
        return datetime.utcnow() > self.trial_end_date
    
    def is_subscription_active(self):
        if self.subscription_status == 'trial':
            return not self.is_trial_expired()
        return (self.subscription_status == 'active' and 
                self.subscription_end_date and 
                datetime.utcnow() <= self.subscription_end_date)
    
    def get_plan_features(self):
        features = {
            'trial': {
                'name': 'Teste Grátis',
                'transactions_limit': 10,
                'reports': False,
                'automation': False,
                'multi_user': False
            },
            'mei': {
                'name': 'Plano MEI',
                'transactions_limit': 100,
                'reports': True,
                'automation': False,
                'multi_user': False
            },
            'professional': {
                'name': 'Plano Profissional',
                'transactions_limit': 500,
                'reports': True,
                'automation': True,
                'multi_user': False
            },
            'enterprise': {
                'name': 'Plano Empresarial',
                'transactions_limit': -1,  # unlimited
                'reports': True,
                'automation': True,
                'multi_user': True
            }
        }
        return features.get(self.subscription_plan, features['trial'])

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)  # income, expense
    category = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_recurring = db.Column(db.Boolean, default=False)
    recurrence_type = db.Column(db.String(20))  # monthly, weekly, yearly
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(50), nullable=False)  # payable, receivable, bank
    amount = db.Column(db.Numeric(15, 2), default=0)
    due_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')  # pending, paid, overdue
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    transactions = db.relationship('Transaction', backref='account', lazy=True)

class FinancialGoal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    target_amount = db.Column(db.Numeric(15, 2), nullable=False)
    current_amount = db.Column(db.Numeric(15, 2), default=0)
    target_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_completed = db.Column(db.Boolean, default=False)
    
    def get_progress_percentage(self):
        if self.target_amount == 0:
            return 0
        return min(100, (float(self.current_amount) / float(self.target_amount)) * 100)
