from flask import Flask
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
import os
from flask_dropzone import Dropzone



###### App setup
app = Flask(__name__)
app.config.from_pyfile('settings.py')

dropzone = Dropzone(app)

# Dropzone settings
app.config['DROPZONE_UPLOAD_MULTIPLE'] = True
app.config['DROPZONE_ALLOWED_FILE_CUSTOM'] = True
app.config['DROPZONE_ALLOWED_FILE_TYPE'] = 'image/*'
app.config['DROPZONE_MAX_FILE_SIZE'] = 10

# New post uploads settings
app.config['UPLOADED_POST_DEST'] = os.getcwd() + "/static/media/posts"
post = UploadSet('post', IMAGES)
configure_uploads(app, post)
patch_request_class(app)  # set maximum file size, default is 16MB


###### Pages
## Homepage
from pages.homepage.homepage import homepage
app.register_blueprint(homepage)

## About
from pages.about.about import about
app.register_blueprint(about)

## postpage
from pages.postpage.postpage import postpage
app.register_blueprint(postpage)

## contact
from pages.contact.contact import contact
app.register_blueprint(contact)

## login
from pages.login.login import login
app.register_blueprint(login)

## Page error handlers
from pages.page_error_handlers.page_error_handlers import page_error_handlers
app.register_blueprint(page_error_handlers)


###### Components
## header
from components.header.header import header
app.register_blueprint(header)


