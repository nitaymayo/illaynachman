import os
import shutil
from datetime import datetime
from multiprocessing import AuthenticationError

from flask import Blueprint, render_template, redirect, url_for, flash, request, session, json
from utilities.db.db_manager import dbManager
from app import post as post_app
from werkzeug.datastructures import ImmutableMultiDict

# postpage blueprint definition
postpage = Blueprint('postpage', __name__, static_folder='static', static_url_path='/postpage',
                     template_folder='templates')


# Routes
@postpage.route('/postpage/<int:post_id>')
def index(post_id):
    try:
        # pull post data
        query = f"SELECT *, ABS(DATEDIFF(upload_timestamp, CURRENT_TIMESTAMP)) as uploaded FROM post WHERE post_id = {post_id}"
        res = dbManager.fetch(query)
        if res == False:
            raise Exception("Problem with the DB", 303)
        else:
            post_data = res[0]

        # Get the name of the uploader
        query = f"SELECT name, user_id FROM user WHERE user_id = {post_data.user_id}"
        user_uploeded = dbManager.fetch(query)
        if not user_uploeded:
            user_uploeded = 'Unknown User'

        ## Check if user is allowed to see the post
        # logic exlenation: IF (post is not public) and ((user is logged in) AND (doesn't have right access_type OR is not the uploader of the post))
        # if logic is true -> redirect to index page and say access denied
        if (not post_data.access == 0) and session and (session['access_type'] < post_data.access):
            if post_data.user_id != session['user_id']:
                flash('Access denied')
                return redirect('/')

        # Pull images
        query = f"SELECT * FROM image WHERE post_id = {post_id}"
        image = dbManager.fetch(query)
        if image == False:
            raise Exception("Problem with the DB", errno=3.2)
        image = [img.location.replace(post_app.config.destination, url_for('static', filename='media/posts')) for img in
                 image]

        # Pull tags
        query = f"SELECT tag.name FROM tag join tag_lookup as tl ON tag.name = tl.name WHERE post_id = {post_id} ORDER BY tl.tag_index ASC "
        tag = dbManager.fetch(query)
        if tag == False:
            raise SyntaxError("Problem with the DB", errno=3.3)

        # Pull likes
        query = f"SELECT count(*) as total_likes FROM post_likes WHERE post_id = {post_id}"
        likes = dbManager.fetch(query)
        if likes == False:
            likes = 0
        else:
            likes = int(likes[0].total_likes)

        # Check if user liked the post
        user_liked = False
        if session:
            query = (f"SELECT * "
                     f"FROM post_likes "
                     f"WHERE post_id = {post_id} and user_id = {session['user_id']}")
            res = dbManager.fetch(query)
            if res:
                user_liked = True

        post = {
            'user': user_uploeded[0],
            'data': post_data,
            'likes': likes,
            'images': image,
            'tags': tag,
            'user_liked': user_liked
        }
    except Exception as e:
        pass
    return render_template('postpage.html', post=post)


@postpage.route('/postpage/addremovelike', methods=['GET', 'POST'])
def togglelike():
    if not session:
        return "Signin in order to like a post", 400
    post_id = json.loads(request.form.to_dict()['data'])['post_id']
    user_id = session['user_id']

    # Check if the user already liked the post
    query = f"SELECT * FROM post_likes WHERE post_id = {post_id} AND user_id = {user_id}"
    res = dbManager.fetch(query)
    try:
        # IF user did not like, THEN add like to post_likes table
        if not res:
            query = f"INSERT INTO post_likes (post_id, user_id) VALUES ({post_id}, {user_id})"
            res = dbManager.commit(query)
            if res == -1:
                raise Exception("Problem with the DB, like did not succeed")
            return "like added", 201
        # ELSE delete like from post_likes table
        else:
            query = f"DELETE FROM post_likes WHERE post_id = {post_id} and user_id = {user_id}"
            res = dbManager.commit(query)
            if res == -1:
                raise Exception("Problem with the DB")
            return "like deleted", 202
    except Exception as e:
        return str(e), 500


@postpage.route('/postpage/deletepost', methods=['POST'])
def deletepost():
    post_id = request.form.to_dict()['post_id']

    if not session:
        return "Please signin in", 301

    query = f"SELECT * FROM post WHERE post_id = {post_id}"
    post = dbManager.fetch(query)
    if not post:
        return "No such post", 404

    # make sure the user himself want to delete the post
    if session["user_id"] != post[0].user_id:
        return "You cant delete this post", 301

    # delete the post
    query = f"DELETE FROM post WHERE post_id = {post_id}"
    res = dbManager.commit(query)
    if res == -1:
        return "Problem with DB, post not deleted", 404

    # move the images(if exists) to deleted images directory
    from_dir = post_app.config.destination + '/post_id' + str(post_id)
    if (os.path.exists(from_dir)):
        now = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        to_dir = post_app.config.destination + '/../deleted_posts/post_id' + str(post_id) + "_" + now
        os.mkdir(to_dir)
        if os.path.exists(to_dir):
            for file in os.listdir(from_dir):
                shutil.move(os.path.join(from_dir, file), to_dir)
            shutil.rmtree(from_dir)

    return "Deleted", 201


@postpage.route('/postpage/updatepost/<int:post_id>', methods=['GET', 'POST'])
def update_post(post_id):
    if not session:
        return "Please signin", 401

    # Pull post data
    query = f"SELECT * FROM post WHERE post_id = {post_id}"
    post = dbManager.fetch(query)

    if post == -1:
        return "Problem with DB, post not found", 404

    if session["user_id"] != post[0].user_id and not session['is_admin']:
        return "You can't update this post", 301

    # pull request data
    data = json.loads(request.form.to_dict()['data'])
    new_name = data['name']
    new_description = data['description']
    new_access = data['access']
    new_tags = data['tags']
    # imgs to delete
    images = data['images']

    # post update query
    query = (f"UPDATE post SET "
             f"name = '{new_name}', "
             f"description = '{new_description}', "
             f"access= {new_access} "
             f"WHERE post_id = {post_id}")
    res = dbManager.commit(query)

    if res == -1:
        return "Problem with the DB, post not updated", 301

    ## update post tags
    if new_tags:
        # delete current tags
        query = f"DELETE FROM tag WHERE post_id = {post_id}"
        res = dbManager.commit(query)
        query = f"INSERT INTO tag (post_id, name) VALUES "
        for tag in new_tags:
            query = query + f"({post_id}, '{tag}'),"
        res = dbManager.commit(query[:-1])
    # Delete selected images
    query_delete = f"DELETE FROM image WHERE location = "
    images_not_deleted = []
    if images:
        for img in images:
            img_name = img.split(f"post_id{post_id}/")[-1]
            img_location = f"{post_app.config.destination}/post_id{post_id}/{img_name}"
            delete_to_location = img_location.split("/posts/")[0] + "/deleted_posts/images_deleted_from_posts"
            res = dbManager.commit(query_delete + f"'{img_location}'")
            if res:
                if not os.path.exists(delete_to_location):
                    os.mkdir(delete_to_location)
                shutil.move(img_location, delete_to_location)
            else:
                images_not_deleted.append(img_name)

    return "update success", 200



@postpage.route('/postpage/addimagestopost/<int:post_id>', methods=['GET', 'POST'])
def add_images_to_post(post_id):
    if not session:
        return "Please signin", 401

    ## Get post from post table to check if this user is the owner of the post
    query = f"SELECT * FROM post WHERE post_id = {post_id}"
    post = dbManager.fetch(query)
    if not post:
        raise Exception("post not found", 404)

    if session["user_id"] != post[0].user_id and not session['is_admin']:
        raise Exception("you are not authorized to add photos to this post", 301)

    if request.method == 'POST':

        post_dir = f"post_id{post_id}"
        to_dir = post_app.config.destination + '/' + post_dir
        if not os.path.exists(to_dir):
            os.mkdir(to_dir)
        file_obj = request.files
        bad_files = []
        for f in file_obj:

            file = request.files.get(f)
            # try to insert img to db
            query = f"INSERT INTO image (post_id, location) VALUES ({post_id}, '{os.path.join(to_dir, file.filename)}')"
            res = dbManager.commit(query)
            try:
                # if successful save it to folder, else raise exception
                if res == 1:
                    # save the file to our photos folder
                    file_name = post_app.save(
                        file,
                        name=os.path.join(post_dir, file.filename)
                    )
                else:
                    bad_files.append(file.filename)
            except Exception as e:
                query = f"DELETE FROM image WHERE post_id={post_id} AND location='{os.path.join(to_dir, file.filename)}'"
                res = dbManager.commit(query)
                bad_files.append(file.filename)
        if bad_files:
            bad_file_string = "some images could not be uploaded:\n"
            for i, file in enumerate(bad_files):
                bad_file_string = bad_file_string + f"{i+1}) {file}\n"
            flash(bad_file_string + "Please try changing their name and make sure they are valid content")
        return "uploading..."
    else:
        return "Method not allowed", 401
