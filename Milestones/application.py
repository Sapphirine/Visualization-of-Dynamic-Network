from flask import Flask, request
from flask import render_template
from langdetect import detect
from driver_3 import init, giveSign
import json

clf1, clf2, voc1, voc2 = init();

application = Flask(__name__)
@application.route('/')
def home_page():
	return render_template('index.html')

@application.route('/process', methods=['GET','POST'])
def process():
	tweet = request.form["tweet"]
	lang = detect(tweet)
	# res = {"sign": 0}
	if( lang != 'en'):
		res = {"sign": 0}
	else:
		sign = giveSign(clf2, voc2, tweet);
		res = {"sign": sign[0]}
	res = json.dumps(res)

	return res



if __name__ == '__main__':
	application.debug = True
	application.run()