from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
import random

import instaloader
from instaloader import Profile
from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

app = Flask(__name__)
cla_app = ClarifaiApp(api_key='f9c954e11695463180ee7969993497af')
model = cla_app.models.get('general-v1.3')

@app.route('/analyze/<username>')
def analyze(username):
    L = instaloader.Instaloader()
    profile = Profile.from_username(L.context, username)
    ml_input_data = {"image_analysis": {}}
    temp_trend = ["nature", 
      "water", 
      "bird", 
      "wildlife", 
      "pool", 
      "outdoors", 
      "lake", 
      "leaf", 
      "no person"]
    ml_input_data['trending_hashtag'] = temp_trend
	
    posts = []
    i = 0

    for post in profile.get_posts():
        posts.append(post)
        print(i)
        i = i + 1

    i = 0
    for post in posts:
        post_data = {}
        img = ClImage(url=post.url)
        #post_data['clarifai_result'] = [x['name'] for x in model.predict([img])['outputs'][0]['data']['concepts']]
        post_data['image_keywords'] = [x['name'] for x in model.predict([img])['outputs'][0]['data']['concepts']]
        post_data["text_keywords"] = post.caption_hashtags
        post_data['likes'] = post.likes
        post_data['text'] = post.caption
        post_data['comments'] = post.comments
        post_data['image_url'] = post.url
        post_data['score'] = int((-10) + (20 * random.random()))
        post_data['success'] = random.random() >= 0.5
        post_data['misalignment'] = random.random() >= 0.5
        ml_input_data['image_analysis'][str(post.mediaid)] = post_data
        print(i)
        i = i + 1

    # Send ml_input_data to Jason's engine
    
    # Result from Jason's engine
    
    return jsonify(ml_input_data)

CORS(app=app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
