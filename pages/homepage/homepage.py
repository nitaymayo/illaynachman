import json
import os, shutil
from time import sleep
from PIL import Image
from flask import Blueprint, render_template, redirect, url_for, session, flash, request
from utilities.db.db_manager import dbManager, DBManager
from app import post
import pandas as pd

# homepage blueprint definition
homepage = Blueprint('homepage', __name__, static_folder='static', static_url_path='/homepage',
                     template_folder='templates')



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
    posts_query = (f"SELECT post.*, ABS(DATEDIFF(post.upload_timestamp, CURRENT_TIMESTAMP)) as uploaded, user.name as username, "
                   f"(SELECT name FROM period_lookup as pl WHERE post.year <= pl.end_year AND post.year >= pl.start_year) as period, "
                   f"(SELECT count(image.location) FROM image WHERE image.post_id = post.post_id GROUP BY image.post_id) as images_count,"
                   f"(SELECT true FROM post_likes WHERE post_likes.user_id = {user_id} AND post_likes.post_id = post.post_id) as user_liked "
                   f"FROM post "
                   f"INNER JOIN user ON post.user_id = user.user_id "
                   f"WHERE post.access <= {access_type} OR post.user_id = {user_id} "
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
             f"WHERE post_id in ({allowed_posts_query}) AND cover = b'1'")

    all_images = dbManager.fetch(query)
    all_images = pd.DataFrame(all_images)
    all_images['location'] = all_images.location.str.replace(post.config.destination, url_for('static', filename='media/posts'))

    # Pull all data from 'tag' table
    query = (f"SELECT tag.name, tag.post_id "
             f"FROM tag join tag_lookup as tl ON tag.name = tl.name "
             f"WHERE post_id in ({allowed_posts_query}) "
             f"ORDER BY tl.tag_index ASC ")

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

@homepage.route('/home/newpost', methods=['GET', 'POST'])
def new_post():
    if not session:
        flash('Login is required to upload a post')
        return redirect(url_for('login.index'))

    data = json.loads(request.form['data'])
    post_name = data['post_name']
    post_year = data['post_year']
    post_description = data['post_description']
    access_type = data['post_access']
    post_tags = data['post_tags']

    # Insert post to db
    query = (f"INSERT INTO post (name, user_id, year, description, access) "
             f"VALUES ('{post_name}', '{session['user_id']}', '{post_year}', '{post_description}', '{access_type}')")

    res = dbManager.commit(query)

    if res == -1:
        return 'Something went wrong, your post did not uploaded'

    # Get post ID
    query = f"SELECT MAX(post_id) as current_post FROM post WHERE user_id = {session['user_id']} and name = '{post_name}' and description = '{post_description}' and year = '{post_year}' and access = '{access_type}'"
    res = dbManager.fetch(query)
    post_id = res[0].current_post



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
        query = f"DELETE FROM post WHERE post_id = {post_id}"
        dbManager.commit(query)
        return e.args[0], 301

    flash('Post uploaded!')

    # check if post doesnt have photos
    files = request.files
    if files.get('file[0]').filename == 'blob':
        return 'uploaded', 201

    post_dir = 'post_id' + str(post_id)  # Directory to save the content to
    os.makedirs(post.config.destination + '/' + post_dir) #Create post dir

    # Insert Content to dir and to DB
    query = "INSERT INTO image (location, post_id, type) VALUES "
    delete_query = f"DELETE FROM image WHERE location = "
    bad_files = []
    good_files = []
    for f in files:
        file = request.files.get(f)
        new_file_name = file.filename.replace(" ", "+")
        # save the file to our photos folder
        content_type = ""
        if ("video" in file.content_type):
            content_type = "video"
        elif ("image" in file.content_type):
            content_type = "image"
        try:
            res = dbManager.commit(query + f"('/{post_dir + '/' + new_file_name}', {post_id}, '{content_type}')")
            if res == 1:
                file_name = post.save(
                    file,
                    name=(post_dir + '/' + new_file_name)
                )
                good_files.append(file_name)
            else:
                raise Exception()
        except Exception as e:
            bad_files.append(file.filename)
            dbManager.commit(delete_query + f"'/{post_dir + '/' + new_file_name}'")

    # choose randomly 3 photos as cover photos
    query = (f"UPDATE image "
             f"SET cover = b'1' "
             f"WHERE post_id = {post_id} AND type = 'image'"
             f"ORDER BY post_id LIMIT 3")
    res = dbManager.commit(query)


    if bad_files:
        bad_file_string = "some images could not be uploaded:\n"

        for i, file in enumerate(bad_files):
            bad_file_string = bad_file_string + f"{i + 1}) {file}\n"
        flash(bad_file_string + "Please try changing their name and make sure they are valid content\n You can upload them by editing your post")
    
    return "uploaded", 201


# @homepage.route('/homepage/uploadpostphotos', methods=['POST'])
# def upload_post_photos_to_temp():
#     if not session:
#         return "You need to login", 301
#     if request.method == 'POST':
#         temp_dir = f"temp_post_u{session['user_id']}"
#         to_dir = post.config.destination + '/' + temp_dir
#         # Delete temp dir if exists
#         if os.path.exists(to_dir):
#             shutil.rmtree(to_dir)
#
#         os.makedirs(to_dir, exist_ok=True)
#         file_obj = request.files
#         bad_files = []
#         good_files = []
#         for f in file_obj:
#             file = request.files.get(f)
#
#             # save the file to our photos folder
#             try:
#                 file_name = post.save(
#                     file,
#                     name=os.path.join(temp_dir, file.filename.replace(" ", "+"))
#                 )
#                 good_files.append(file_name)
#             except Exception as e:
#                 bad_files.append(file.filename)
#
#         if bad_files:
#             bad_file_string = "some images could not be uploaded:\n"
#             for i, file in enumerate(bad_files):
#                 bad_file_string = bad_file_string + f"{i+1}) {file}\n"
#             flash(bad_file_string + "Please try changing their name and make sure they are valid content\n You can upload them by editing your post")
#
#         # if good_files:
#         #     while len(os.listdir(to_dir)) < len(good_files):
#         #         pass
#         return "uploading...", 200
#
#     else:
#         return "Method not allowed", 401


@homepage.route('/homepage/gettags')
def gettags():
    # pull tags form tag_lookup
    query = "SELECT name from tag_lookup ORDER BY tag_index "
    localDBmanager = DBManager()
    tags = localDBmanager.fetch(query)
    if not tags:
        return 'No tags found', 404
    tags = json.dumps(tags)
    return tags, 201

@homepage.route('/homepage/getperiods')
def getperiods():
    # pull tags form tag_lookup
    query = "SELECT name from period_lookup ORDER BY start_year "
    localDBmanager = DBManager()
    periods = localDBmanager.fetch(query)
    if not periods:
        return 'No periods found', 404
    periods = json.dumps(periods)
    return periods, 201

@homepage.route('/homepage/getpostsforsearch')
def getpostsforsearch():

    if session:
        access_type = session['access_type']
        user_id = session['user_id']
    else:
        access_type = 0
        user_id = 0

    query = (f"SELECT post.post_id, "
             f"post.name, "
             f"ABS(DATEDIFF(post.upload_timestamp, CURRENT_TIMESTAMP)) as uploaded, "
             f"user.name as username, "
             f"(SELECT name FROM period_lookup as pl WHERE post.year <= pl.end_year AND post.year >= pl.start_year) as period, "
             f"COUNT(likes.user_id) as likes "
             f"from post join user on post.user_id = user.user_id join post_likes as likes on post.post_id = likes.post_id "
             f"WHERE post.access <= {access_type} OR post.user_id = {user_id} "
             f"GROUP BY likes.post_id "
             f"ORDER BY uploaded ASC")
    localdb = DBManager()

    data = localdb.fetch(query)

    # data = [{
    #     'name': post.name,
    #     'uploaded': post.uploaded,
    #     'username': post.username
    # } for post in data]

    data = pd.DataFrame(data).T.to_json()
    return data, 201

@homepage.route('/homepage/fetchadmindata')
def fetchadmindata():
    if not session and not session['is_admin']:
        flash('You are not authorized to do that')
        return "You are not authorized to do that", 303

    query = f"SELECT * FROM user"
    users = DBManager().fetch(query)
    if not users:
        return "Server problem or no users in DB", 301

    return json.dumps(pd.DataFrame(users).T.to_dict()), 200


@homepage.route('/homepage/updateuserdata', methods=['POST'])
def updateuserdata():
    if not session and not session['is_admin']:
        return "You are not authorized to do that", 303

    data = json.loads(request.data)
    if (not data):
        return "Server problem", 301


    query = (f"UPDATE user SET "
             f"email = '{data['email']}', "
             f"password = '{data['password']}', "
             f"access_type = '{data['access_type']}', "
             f"approximation = '{data['approximation']}', "
             f"is_admin = b'{1 if data['is_admin'] else 0}' "
             f"WHERE user_ID = {data['user_ID']}")
    res = dbManager.commit(query)

    if res == 1:
        return json.dumps({'text': "user data updated", 'user_ID': data['user_ID'], 'success': True}), 201
    elif res == 0:
        return json.dumps({'text': "No new data introduced", 'user_ID': data['user_ID'], 'success': True}), 201
    else:
        return json.dumps({'text': "problem with data, user data not updated", 'user_ID': data['user_ID'], 'success': False}), 301
