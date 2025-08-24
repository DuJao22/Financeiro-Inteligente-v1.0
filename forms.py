from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField, TextAreaField, DecimalField, DateTimeField, DateField
from wtforms.validators import DataRequired, Email, EqualTo, Length, NumberRange
from wtforms.widgets import NumberInput

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Senha', validators=[DataRequired()])
    remember_me = BooleanField('Lembrar-me')
    submit = SubmitField('Entrar')

class RegistrationForm(FlaskForm):
    full_name = StringField('Nome Completo', validators=[DataRequired(), Length(min=2, max=120)])
    username = StringField('Nome de Usuário', validators=[DataRequired(), Length(min=4, max=64)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    phone = StringField('Telefone', validators=[Length(max=20)])
    password = PasswordField('Senha', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField('Confirmar Senha', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Cadastrar')

class ForgotPasswordForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Enviar Link de Recuperação')

class TransactionForm(FlaskForm):
    description = StringField('Descrição', validators=[DataRequired(), Length(max=200)])
    amount = DecimalField('Valor', validators=[DataRequired(), NumberRange(min=0.01)], widget=NumberInput(step=0.01))
    transaction_type = SelectField('Tipo', choices=[('income', 'Receita'), ('expense', 'Despesa')], validators=[DataRequired()])
    category = SelectField('Categoria', choices=[
        ('vendas', 'Vendas'),
        ('servicos', 'Serviços'),
        ('marketing', 'Marketing'),
        ('fornecedores', 'Fornecedores'),
        ('impostos', 'Impostos'),
        ('despesas_gerais', 'Despesas Gerais'),
        ('outros', 'Outros')
    ])
    date = DateField('Data', validators=[DataRequired()])
    submit = SubmitField('Salvar')

class AccountForm(FlaskForm):
    name = StringField('Nome/Descrição', validators=[DataRequired(), Length(max=100)])
    account_type = SelectField('Tipo', choices=[
        ('receivable', 'Conta a Receber'),
        ('payable', 'Conta a Pagar')
    ], validators=[DataRequired()])
    amount = DecimalField('Valor', validators=[DataRequired(), NumberRange(min=0.01)], widget=NumberInput(step=0.01))
    due_date = DateField('Data de Vencimento', validators=[DataRequired()])
    submit = SubmitField('Salvar')
