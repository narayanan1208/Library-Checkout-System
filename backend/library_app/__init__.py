from flask import Flask

app = Flask(__name__)
app.config.from_object('config')

from library_app import routes