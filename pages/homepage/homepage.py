import json
import os, shutil
from time import sleep
from PIL import Image
from flask import Blueprint, render_template, redirect, url_for, session, flash, request
from utilities.db.db_manager import dbManager
from app import post
import pandas as pd

# homepage blueprint definition
homepage = Blueprint('homepage', __name__, static_folder='static', static_url_path='/homepage',
                     template_folder='templates')

post_uploaded = 0
images_uploaded = ""


# Routes
@homepage.route('/')
def index():

    ### Pull Posts Data
    if session:
        name = session['name']
        access_type = session['access_type']
        user_id = session['user_id']
    else:
        access_type = 0
        name = None
        user_id = 0

    # Pull all relavant data from 'post' table (the relevant access_type)
    posts_query = (f"SELECT post.*, ABS(DATEDIFF(post.upload_timestamp, CURRENT_TIMESTAMP)) as uploaded, user.name as username "
                   f"FROM post "
                   f"INNER JOIN user ON post.user_id = user.user_id "
                   f"WHERE post.access = {access_type} OR post.user_id = {user_id} "
                   f"ORDER BY upload_timestamp DESC LIMIT 15 ")
    all_posts = dbManager.fetch(posts_query)
    if not all_posts:
        return render_template('homepage.html', username=name)
    all_posts = pd.DataFrame(all_posts)
    distinct_posts_id = all_posts.post_id.unique()

    allowed_posts_query = (f"SELECT post_id "
                   f"FROM post "
                   f"WHERE access <= {access_type} OR user_id = {user_id}")

    # Pull all data from 'image' table
    query = (f"SELECT * "
             f"FROM image "
             f"WHERE post_id in ({allowed_posts_query})")

    all_images = dbManager.fetch(query)
    all_images = pd.DataFrame(all_images)
    all_images['location'] = all_images.location.str.replace(post.config.destination, url_for('static', filename='media/posts'))

    # Pull all data from 'tag' table
    query = (f"SELECT * "
             f"FROM tag "
             f"WHERE post_id in ({allowed_posts_query})")

    all_tags = dbManager.fetch(query)
    all_tags = pd.DataFrame(all_tags)

    # Pull all data from post_likes table
    query = (f"SELECT post_id, count(*) as total_likes "
             f"FROM post_likes "
             f"WHERE post_id IN ({allowed_posts_query}) "
             f"GROUP BY post_id ")

    likes = dbManager.fetch(query)
    likes = pd.DataFrame(likes)


    # Divide all variables to separate posts
    separate_posts = {}
    for post_id in distinct_posts_id:
        separate_posts[post_id] = {
            'data': all_posts[all_posts['post_id'] == post_id],
            'tags': all_tags[all_tags['post_id'] == post_id],
            'images': all_images[all_images['post_id'] == post_id]
        }
        if not likes.empty and (post_id in list(likes.post_id)):
            separate_posts[post_id]['likes'] = likes[likes['post_id'] == post_id].values[0][1]
        else:
            separate_posts[post_id]['likes'] = 0



    return render_template('homepage.html', posts=list(separate_posts.values()), username=name)


@homepage.route('/homepage')
@homepage.route('/home')
def redirect_homepage():
    return redirect(url_for('homepage.index'))


@homepage.route('/home/signout')
def signout():
    session.clear()
    return redirect('/')

@homepage.route('/homepage/loadmoreposts')
def load_more_posts():

    ### Pull Posts Data
    if session:
        name = session['name']
        access_type = session['access_type']
        user_id = session['user_id']
    else:
        access_type = 0
        name = None
        user_id = 0

    # Get how many posts are already shown
    shown_posts = int(request.args.get('posts'))

    # Pull all relavant data from 'post' table (the relevant access_type)
    posts_query = (f"SELECT post.*, ABS(DATEDIFF(post.upload_timestamp, CURRENT_TIMESTAMP)) as uploaded, user.name as username "
                   f"FROM post "
                   f"INNER JOIN user ON post.user_id = user.user_id "
                   f"WHERE post.access = {access_type} OR post.user_id = {user_id} "
                   f"ORDER BY post.upload_timestamp DESC LIMIT {shown_posts},7 ")
    all_posts = dbManager.fetch(posts_query)
    if not all_posts:
        return "No more posts to show", 204

    all_posts = pd.DataFrame(all_posts)
    distinct_posts_id = all_posts.post_id.unique()

    allowed_posts_query = (f"SELECT post_id "
                           f"FROM post "
                           f"WHERE access <= {access_type} OR user_id = {user_id}")

    # Pull all data from 'image' table
    query = (f"SELECT * "
             f"FROM image "
             f"WHERE post_id in ({allowed_posts_query})")

    all_images = dbManager.fetch(query)
    all_images = pd.DataFrame(all_images)
    all_images['location'] = all_images.location.str.replace(post.config.destination,
                                                             url_for('static', filename='media/posts'))

    # Pull all data from 'tag' table
    query = (f"SELECT * "
             f"FROM tag "
             f"WHERE post_id in ({allowed_posts_query})")

    all_tags = dbManager.fetch(query)
    all_tags = pd.DataFrame(all_tags)

    # Pull all data from post_likes table
    query = (f"SELECT post_id, count(*) as total_likes "
             f"FROM post_likes "
             f"WHERE post_id IN ({allowed_posts_query}) "
             f"GROUP BY post_id ")

    likes = dbManager.fetch(query)
    likes = pd.DataFrame(likes)

    # Divide all variables to separate posts
    separate_posts = {}
    for post_id in distinct_posts_id:
        separate_posts[post_id] = {
            'data': all_posts[all_posts['post_id'] == post_id],
            'tags': all_tags[all_tags['post_id'] == post_id],
            'images': all_images[all_images['post_id'] == post_id]
        }
        if not likes.empty and (post_id in list(likes.post_id)):
            separate_posts[post_id]['likes'] = likes[likes['post_id'] == post_id].values[0][1]
        else:
            separate_posts[post_id]['likes'] = 0

    return pd.DataFrame(separate_posts).to_json(), 201


    return redirect('/')

@homepage.route('/home/newpost', methods=['POST'])
def new_post():
    if not session:
        flash('Login is required to upload a post')
        return redirect(url_for('login.index'))

    from_dir = post.config.destination + '/temp_post_u' + str(session['user_id']) # The path to the directory where the content from upload_post_photos_to_temp() is wating
    data = json.loads(request.form['data'])
    post_name = data['post_name']
    post_year = data['post_year']
    post_description = data['post_description']
    access_type = data['post_access']
    post_tags = data['post_tags']
    with_images = data['with_images']

    # Insert post to db
    query = (f"INSERT INTO post (name, user_id, year, description, access) "
             f"VALUES ('{post_name}', '{session['user_id']}', '{post_year}', '{post_description}', '{access_type}')")

    res = dbManager.commit(query)

    if res == -1:
        shutil.rmtree(from_dir)
        return 'Something went wrong, your post did not uploaded'

    # Get post ID
    query = f"SELECT MAX(post_id) as current_post FROM post WHERE user_id = {session['user_id']} and name = '{post_name}' and description = '{post_description}' and year = '{post_year}' and access = '{access_type}'"
    res = dbManager.fetch(query)
    post_id = res[0].current_post

    to_dir = post.config.destination + '/post_id' + str(post_id) # Directory to save the content to

    ### Insert Tags
    try:
        if post_tags:
            query = (f"INSERT INTO tag (name, post_id) "
                     f"VALUES ")
            for tag in post_tags:
                query += f"('{tag}', {res[0].current_post}),"
            res = dbManager.commit(query[:-1])
            if res == -1:
                raise Exception('Something went wrong with tags insert query')
    except Exception as e:
        if os.path.exists(from_dir):
            shutil.rmtree(from_dir)
        query = f"DELETE FROM post WHERE post_id = {post_id}"
        dbManager.commit(query)
        return e, 301

    # check if post doesnt have photos
    if (not with_images):
        return 'Post uploaded!', 201

    os.mkdir(to_dir) #Create post dir

    # Insert Content to dir and to DB
    query = "INSERT INTO image (location, post_id) VALUES "
    try:
        for file in os.listdir(from_dir):
            shutil.move(os.path.join(from_dir, file), to_dir)
            query += f"('{to_dir + '/' + file}', {post_id}),"
        shutil.rmtree(from_dir)
        query = query[:-1]

        res = dbManager.commit(query)
        if res == -1:
            raise Exception('Something went wrong with the db upload, if error repeats please let us know')
    except Exception as e:
        query = f"DELETE FROM post WHERE post_id = {post_id}"
        dbManager.commit(query)
        shutil.rmtree(to_dir)
        return e, 301


    return 'Post uploaded!', 201


@homepage.route('/homepage/uploadpostphotos', methods=['POST'])
def upload_post_photos_to_temp():
    if not session:
        return "You need to login", 301
    if request.method == 'POST':
        temp_dir = f"temp_post_u{session['user_id']}"
        to_dir = post.config.destination + '/' + temp_dir
        # Delete temp dir if exists
        if os.path.exists(to_dir):
            shutil.rmtree(to_dir)

        os.makedirs(to_dir, exist_ok=True)
        file_obj = request.files
        bad_files = []
        for f in file_obj:
            file = request.files.get(f)

            # save the file to our photos folder
            try:
                file_name = post.save(
                    file,
                    name=os.path.join(temp_dir, file.filename)
                )
            except Exception as e:
                bad_files.append(file.filename)

        if bad_files:
            bad_file_string = "some images could not be uploaded:\n"
            for i, file in enumerate(bad_files):
                bad_file_string = bad_file_string + f"{i+1}) {file}\n"
            flash(bad_file_string + "Please try changing their name and make sure they are valid content\n You can upload them by editing your post")
        return "uploading...", 200

    else:
        return "Method not allowed", 401


@homepage.route('/homepage/gettags')
def gettags():

    if not session:
        return 'User not logged in', 401

    # pull tags form tag_lookup
    query = "SELECT name from tag_lookup ORDER BY tag_index "
    tags = dbManager.fetch(query)
    if not tags:
        return 'No tags found', 404
    tags = json.dumps(tags)
    return tags, 201
