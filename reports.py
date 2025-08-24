from flask import Blueprint, render_template, jsonify, flash, redirect, url_for, make_response
from flask_login import login_required, current_user
from models import Transaction, Account
from app import db
from sqlalchemy import func, extract
from datetime import datetime, timedelta
import calendar
import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from utils import utc_to_brasilia, format_currency

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/')
@login_required
def reports():
    # Check if user has access to reports
    features = current_user.get_plan_features()
    if not features['reports']:
        return render_template('reports/reports.html', 
                             access_denied=True,
                             message='Relatórios estão disponíveis apenas para planos pagos.')
    
    # Generate reports data
    today = datetime.utcnow()
    current_month = today.month
    current_year = today.year
    
    # Monthly performance
    monthly_data = []
    for i in range(12):
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
        
        monthly_data.append({
            'month': calendar.month_name[month],
            'income': float(income),
            'expenses': float(expenses),
            'profit': float(income) - float(expenses)
        })
    
    monthly_data.reverse()
    
    # Category analysis
    category_data = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == 'expense'
    ).group_by(Transaction.category).all()
    
    # Calculate KPIs
    total_income = sum(m['income'] for m in monthly_data)
    total_expenses = sum(m['expenses'] for m in monthly_data)
    net_profit = total_income - total_expenses
    
    transaction_count = Transaction.query.filter_by(user_id=current_user.id).count()
    avg_ticket = total_income / max(1, transaction_count)
    
    # Overdue accounts
    overdue_accounts = Account.query.filter(
        Account.user_id == current_user.id,
        Account.status == 'pending',
        Account.due_date < today
    ).count()
    
    return render_template('reports/reports.html',
                         monthly_data=monthly_data,
                         category_data=category_data,
                         total_income=total_income,
                         total_expenses=total_expenses,
                         net_profit=net_profit,
                         avg_ticket=avg_ticket,
                         overdue_accounts=overdue_accounts,
                         features=features)

@reports_bp.route('/export-pdf')
@login_required
def export_pdf():
    # Check if user has access to reports
    features = current_user.get_plan_features()
    if not features['reports']:
        flash('Exportação PDF está disponível apenas para planos pagos.', 'warning')
        return redirect(url_for('reports.reports'))
    
    try:
        # Generate PDF content
        pdf_buffer = io.BytesIO()
        
        # Create PDF document
        doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Build PDF content
        content = build_pdf_content()
        doc.build(content)
        
        # Prepare response
        pdf_buffer.seek(0)
        response = make_response(pdf_buffer.read())
        response.headers['Content-Type'] = 'application/pdf'
        
        # Generate filename with current date
        now = utc_to_brasilia(datetime.utcnow())
        filename = f"relatorio_financeiro_{now.strftime('%Y%m%d_%H%M')}.pdf"
        response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        flash('Relatório PDF exportado com sucesso!', 'success')
        return response
        
    except Exception as e:
        flash(f'Erro ao gerar relatório PDF: {str(e)}', 'error')
        return redirect(url_for('reports.reports'))

def build_pdf_content():
    """Build PDF content with financial data"""
    content = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1E40AF'),
        alignment=TA_CENTER,
        spaceAfter=30
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#374151'),
        spaceAfter=20
    )
    
    # Title
    content.append(Paragraph("Relatório Financeiro", title_style))
    content.append(Paragraph("Financeiro Inteligente", styles['Normal']))
    content.append(Spacer(1, 20))
    
    # User info and period
    now = utc_to_brasilia(datetime.utcnow())
    content.append(Paragraph(f"<b>Usuário:</b> {current_user.full_name}", styles['Normal']))
    content.append(Paragraph(f"<b>Plano:</b> {current_user.get_plan_features()['name']}", styles['Normal']))
    content.append(Paragraph(f"<b>Data:</b> {now.strftime('%d/%m/%Y às %H:%M')}", styles['Normal']))
    content.append(Spacer(1, 20))
    
    # Financial summary
    content.append(Paragraph("Resumo Financeiro", subtitle_style))
    
    # Get financial data
    today = datetime.utcnow()
    current_month = today.month
    current_year = today.year
    
    # Calculate monthly totals
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
    
    monthly_balance = monthly_income - monthly_expenses
    
    # Summary table
    summary_data = [
        ['Item', 'Valor'],
        ['Receitas do Mês', f'R$ {monthly_income:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')],
        ['Despesas do Mês', f'R$ {monthly_expenses:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')],
        ['Saldo do Mês', f'R$ {monthly_balance:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')]
    ]
    
    summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    content.append(summary_table)
    content.append(Spacer(1, 30))
    
    # Recent transactions
    content.append(Paragraph("Transações Recentes", subtitle_style))
    
    # Get recent transactions
    recent_transactions = Transaction.query.filter_by(user_id=current_user.id)\
        .order_by(Transaction.date.desc()).limit(10).all()
    
    if recent_transactions:
        # Transactions table
        trans_data = [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']]
        
        for transaction in recent_transactions:
            date_str = utc_to_brasilia(transaction.date).strftime('%d/%m/%Y') if transaction.date else '-'
            type_str = 'Receita' if transaction.transaction_type == 'income' else 'Despesa'
            amount_str = f'R$ {float(transaction.amount):,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
            if transaction.transaction_type == 'expense':
                amount_str = f'-{amount_str}'
            else:
                amount_str = f'+{amount_str}'
                
            trans_data.append([
                date_str,
                transaction.description[:25] + '...' if len(transaction.description) > 25 else transaction.description,
                transaction.category or 'Sem categoria',
                type_str,
                amount_str
            ])
        
        trans_table = Table(trans_data, colWidths=[1*inch, 2.5*inch, 1.5*inch, 1*inch, 1.5*inch])
        trans_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        content.append(trans_table)
    else:
        content.append(Paragraph("Nenhuma transação encontrada.", styles['Normal']))
    
    content.append(Spacer(1, 30))
    
    # Category analysis
    content.append(Paragraph("Análise por Categorias", subtitle_style))
    
    category_data = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == 'expense'
    ).group_by(Transaction.category).all()
    
    if category_data:
        cat_data = [['Categoria', 'Total Gasto']]
        for category, total in category_data:
            cat_name = category or 'Sem categoria'
            total_str = f'R$ {float(total):,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
            cat_data.append([cat_name, total_str])
        
        cat_table = Table(cat_data, colWidths=[3*inch, 2*inch])
        cat_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        content.append(cat_table)
    else:
        content.append(Paragraph("Nenhuma despesa por categoria encontrada.", styles['Normal']))
    
    content.append(Spacer(1, 30))
    
    # Footer
    content.append(Paragraph(
        f"Relatório gerado automaticamente pelo Financeiro Inteligente em {now.strftime('%d/%m/%Y às %H:%M')}",
        ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
    ))
    
    return content

@reports_bp.route('/export-excel')
@login_required
def export_excel():
    # Mock Excel export functionality
    flash('Funcionalidade de exportação Excel será implementada em breve.', 'info')
    return redirect(url_for('reports.reports'))
