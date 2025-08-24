from datetime import datetime
from functools import wraps
from flask import redirect, url_for, flash
from flask_login import current_user
import pytz

def subscription_required(f):
    """Decorator to check if user has active subscription"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for('auth.login'))
        
        if not current_user.is_subscription_active():
            flash('Esta funcionalidade requer uma assinatura ativa.', 'warning')
            return redirect(url_for('subscription.plans'))
        
        return f(*args, **kwargs)
    return decorated_function

def format_currency(value):
    """Format value as Brazilian currency"""
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

def calculate_days_remaining(end_date):
    """Calculate days remaining until end_date"""
    if not end_date:
        return 0
    delta = end_date - datetime.utcnow()
    return max(0, delta.days)

def get_trial_days_remaining(user):
    """Get remaining trial days for user"""
    return calculate_days_remaining(user.trial_end_date)

def get_brasilia_timezone():
    """Get Brasilia timezone"""
    return pytz.timezone('America/Sao_Paulo')

def now_brasilia():
    """Get current datetime in Brasilia timezone"""
    brasilia_tz = get_brasilia_timezone()
    return datetime.now(brasilia_tz)

def utc_to_brasilia(utc_dt):
    """Convert UTC datetime to Brasilia timezone"""
    if utc_dt is None:
        return None
    if utc_dt.tzinfo is None:
        utc_dt = pytz.utc.localize(utc_dt)
    brasilia_tz = get_brasilia_timezone()
    return utc_dt.astimezone(brasilia_tz)

def brasilia_to_utc(brasilia_dt):
    """Convert Brasilia datetime to UTC"""
    if brasilia_dt is None:
        return None
    brasilia_tz = get_brasilia_timezone()
    if brasilia_dt.tzinfo is None:
        brasilia_dt = brasilia_tz.localize(brasilia_dt)
    return brasilia_dt.astimezone(pytz.utc).replace(tzinfo=None)
