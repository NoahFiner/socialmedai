from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
import pickle
import random

import instaloader
from instaloader import Profile
from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

import machine_learning.keyword_analysis as ml

# Testing machine_learning
#open_file = open('./machine_learning/userdata.pickle', 'rb')
#userdata = pickle.load(open_file)
#open_file.close()
#user = ml.Profile(posts=userdata)
#print(user.get_hRank()[:10])
#print(user.get_iRank()[:10])
#exit(1)

app = Flask(__name__)
cla_app = ClarifaiApp(api_key='f9c954e11695463180ee7969993497af')
model = cla_app.models.get('general-v1.3')

@app.route('/analyze/<username>')
def analyze(username):
    L = instaloader.Instaloader()
    profile = Profile.from_username(L.context, username)
    ml_input_data = {}
    posts = []

    # Data prep for ML
    i = 0
    for post in profile.get_posts():
        posts.append(post)
        print(i)
        i = i + 1

    i = 0
    for post in posts:
        post_data = {}
        img = ClImage(url=post.url)
        post_data['clarifai_result'] = [x['name'] for x in model.predict([img])['outputs'][0]['data']['concepts']]
        post_data['image_url'] = post.url
        post_data['likes'] = post.likes
        post_data['text'] = post.caption
        post_data['comments'] = post.comments

    # Get user data from ML module
    user = ml.Profile(posts=post_data)

    result = {"image_analysis": user.evaluate_posts(),
              "trending_hashtag": user.get_hRank(),
              "trending_hashtag_image": user.get_iRank()}

    return jsonify(result)

CORS(app=app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
