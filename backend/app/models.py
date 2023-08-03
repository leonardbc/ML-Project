from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Defining models

class Users(db.Model):
    __tablename__ = 'users'
    username = db.Column(db.String, primary_key=True)
    password = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)

class Images(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String, nullable=False)
    data = db.Column(db.LargeBinary, nullable=False) # If I make this unique I restrict the size
    mask = db.Column(db.Integer, db.ForeignKey('labels.id'), nullable=True) # Null when it's pending
    labeller = db.Column(db.String, nullable=True) # Null when it's pending
    # Could've included format

    label = db.relationship('Labels', backref='images')

class Labels(db.Model):
    __tablename__ = 'labels'
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String, unique=True, nullable=False)
