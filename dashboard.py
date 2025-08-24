from flask import Blueprint, render_template, jsonify
from flask_login import login_required, current_user
from models import Transaction, Account, FinancialGoal
from app import db
from sqlalchemy import func, extract
from datetime import datetime, timedelta
import calendar

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@login_required
def dashboard():
    # Check subscription status
    if not current_user.is_subscription_active():
        if current_user.subscription_status == 'trial' and current_user.is_trial_expired():
            return render_template('subscription/plans.html', 
                                 message='Seu período de teste expirou. Escolha um plano para continuar.')
    
    # Get dashboard data
    today = datetime.utcnow()
    current_month = today.month
    current_year = today.year
    
    # Monthly summary
    monthly_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == 'income',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0
    
    monthly_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == 'expense',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0
    
    monthly_balance = float(monthly_income) - float(monthly_expenses)
    
    # Recent transactions
    recent_transactions = Transaction.query.filter_by(user_id=current_user.id)\
        .order_by(Transaction.date.desc()).limit(5).all()
    
    # Accounts summary
    pending_receivables = db.session.query(func.sum(Account.amount)).filter(
        Account.user_id == current_user.id,
        Account.account_type == 'receivable',
        Account.status == 'pending'
    ).scalar() or 0
    
    pending_payables = db.session.query(func.sum(Account.amount)).filter(
        Account.user_id == current_user.id,
        Account.account_type == 'payable',
        Account.status == 'pending'
    ).scalar() or 0
    
    # Financial goals
    goals = FinancialGoal.query.filter_by(user_id=current_user.id, is_completed=False).all()
    
    # Calculate user level and progress (gamification)
    transaction_count = Transaction.query.filter_by(user_id=current_user.id).count()
    user_level = min(10, (transaction_count // 10) + 1)
    level_progress = (transaction_count % 10) * 10
    
    return render_template('dashboard/dashboard.html',
                         monthly_income=monthly_income,
                         monthly_expenses=monthly_expenses,
                         monthly_balance=monthly_balance,
                         recent_transactions=recent_transactions,
                         pending_receivables=pending_receivables,
                         pending_payables=pending_payables,
                         goals=goals,
                         user_level=user_level,
                         level_progress=level_progress,
                         current_month=calendar.month_name[current_month])

@dashboard_bp.route('/chart-data')
@login_required
def chart_data():
    """Provide data for dashboard charts"""
    today = datetime.utcnow()
    
    # Get last 6 months data
    months_data = []
    for i in range(6):
        month_date = today - timedelta(days=30*i)
        month = month_date.month
        year = month_date.year
        
        income = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.transaction_type == 'income',
            extract('month', Transaction.date) == month,
            extract('year', Transaction.date) == year
        ).scalar() or 0
        
        expenses = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.transaction_type == 'expense',
            extract('month', Transaction.date) == month,
            extract('year', Transaction.date) == year
        ).scalar() or 0
        
        months_data.append({
            'month': calendar.month_name[month][:3],
            'income': float(income),
            'expenses': float(expenses)
        })
    
    months_data.reverse()
    
    return jsonify({
        'months': [m['month'] for m in months_data],
        'income': [m['income'] for m in months_data],
        'expenses': [m['expenses'] for m in months_data]
    })
