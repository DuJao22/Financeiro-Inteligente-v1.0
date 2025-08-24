from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from models import User
from app import db
from datetime import datetime, timedelta

subscription_bp = Blueprint('subscription', __name__)

@subscription_bp.route('/plans')
@login_required
def plans():
    plans = [
        {
            'id': 'mei',
            'name': 'Plano MEI',
            'price': 49,
            'description': 'Perfeito para Microempreendedores Individuais',
            'features': [
                'Até 100 transações/mês',
                'Relatórios básicos',
                'Controle de caixa',
                'Contas a pagar/receber',
                'Suporte por email'
            ],
            'popular': False
        },
        {
            'id': 'professional',
            'name': 'Plano Profissional',
            'price': 99,
            'description': 'Para pequenos negócios em crescimento',
            'features': [
                'Até 500 transações/mês',
                'Relatórios avançados',
                'Automações inteligentes',
                'Integração Mercado Pago',
                'Análise de impostos',
                'Suporte prioritário'
            ],
            'popular': True
        },
        {
            'id': 'enterprise',
            'name': 'Plano Empresarial',
            'price': 199,
            'description': 'Para empresas que precisam de mais',
            'features': [
                'Transações ilimitadas',
                'Multiusuário',
                'Acesso para contador',
                'Relatórios personalizados',
                'API completa',
                'Suporte 24/7'
            ],
            'popular': False
        }
    ]
    
    return render_template('subscription/plans.html', plans=plans)

@subscription_bp.route('/checkout/<plan_id>')
@login_required
def checkout(plan_id):
    if plan_id not in ['mei', 'professional', 'enterprise']:
        flash('Plano inválido.', 'error')
        return redirect(url_for('subscription.plans'))
    
    plan_prices = {
        'mei': 49,
        'professional': 99,
        'enterprise': 199
    }
    
    plan_names = {
        'mei': 'Plano MEI',
        'professional': 'Plano Profissional',
        'enterprise': 'Plano Empresarial'
    }
    
    return render_template('subscription/checkout.html',
                         plan_id=plan_id,
                         plan_name=plan_names[plan_id],
                         plan_price=plan_prices[plan_id])

@subscription_bp.route('/process-payment', methods=['POST'])
@login_required
def process_payment():
    plan_id = request.form.get('plan_id')
    
    if plan_id not in ['mei', 'professional', 'enterprise']:
        flash('Plano inválido.', 'error')
        return redirect(url_for('subscription.plans'))
    
    # Mock payment processing - In real implementation, integrate with Mercado Pago
    # For now, just activate the subscription
    current_user.subscription_plan = plan_id
    current_user.subscription_status = 'active'
    current_user.subscription_end_date = datetime.utcnow() + timedelta(days=30)
    
    db.session.commit()
    
    flash(f'Parabéns! Sua assinatura do {plan_id.title()} foi ativada com sucesso!', 'success')
    return redirect(url_for('dashboard.dashboard'))

@subscription_bp.route('/cancel')
@login_required
def cancel_subscription():
    if current_user.subscription_status == 'active':
        current_user.subscription_status = 'cancelled'
        db.session.commit()
        flash('Sua assinatura foi cancelada. Você pode continuar usando até o fim do período pago.', 'info')
    
    return redirect(url_for('subscription.plans'))
