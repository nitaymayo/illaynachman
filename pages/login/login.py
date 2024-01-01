from flask import Blueprint, render_template, request, redirect, flash, session
from utilities.db.db_manager import dbManager
# about blueprint definition
login = Blueprint('login', __name__, static_folder='static', static_url_path='/login', template_folder='templates')


# Routes
@login.route('/login')
def index():
    return render_template('login.html')

@login.route('/login/checkuser', methods=['POST'])
def check_user():

    uname = request.form['uname']
    password = request.form['password']

    query = f"SELECT * FROM user WHERE name = '{uname}' AND password = '{password}'"

    res = dbManager.fetch(query)

    if not res:
        msg = 'One of the credentials is wrong :('
        return render_template('login.html', msg=msg)
    else:
        flash('Login Successful')
        session['user_id'] = res[0].user_ID
        session['name'] = uname
        session['email'] = res[0].email
        session['access_type'] = res[0].access_type
        session['is_admin'] = res[0].is_admin
        return redirect('/')



@login.route('/login/register', methods=['GET', 'POST'])
def register_user():
    uname = request.form['uname']
    passwd = request.form['psw']
    email = request.form['email']
    approximation = request.form['approximation']
    approximation_more_info = request.form['approximation_more_info']

    # If the user provided more information about his proximity to Ilay, then include it in the approximation variable
    if approximation_more_info:
        approximation = approximation + ': ' + approximation_more_info


    query = (f"INSERT INTO user(name, password, email, approximation, access_type) "
             f"VALUES('{uname}','{passwd}','{email}','{approximation}', 0)")

    res = dbManager.commit(query)

    if res == -1:
        flash('Failed to register user')
        return redirect('/login')
    else:
        return redirect('/')
