import os
from dotenv import load_dotenv
from datetime import timedelta
load_dotenv()


''' Application '''
# Set application root, default value is '/'
APPLICATION_ROOT = '/'

''' Session '''
# Secret key setting from .env for Flask sessions
SECRET_KEY = os.environ.get('SECRET_KEY')
# Set session lifetime, default value is timedelta(days=31)
#   see: https://docs.python.org/3/library/datetime.html#datetime.timedelta
PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)

''' Database '''
# DB base configuration from .env for modularity and security reasons
DB = {
    'host': os.environ.get('DB_HOST'),
    'port':  os.environ.get('DB_PORT'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'database': os.environ.get('DB_NAME')
}
