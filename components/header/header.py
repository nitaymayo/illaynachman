from flask import Blueprint, render_template

# header blueprint definition
header = Blueprint('header', __name__, static_folder='static', static_url_path='/header', template_folder='templates')
