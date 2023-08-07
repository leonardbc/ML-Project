from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Users, Images, Labels
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__) 
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}}) # CORS(app) (uncomment for swagger or pytest)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initializing the database with the Flask app
db.init_app(app)

# Before creating the tables, we check if they already exist
def tables_exist():
    tables = db.metadata.tables # Tables from the models
    metadata = db.MetaData()
    with app.app_context():
        metadata.reflect(bind=db.engine)
    table_names = list(metadata.tables.keys()) # Tables from the database
    for table in tables:
        if table in table_names:
            return True
    return False

################ Authentication endpoints ################

@app.route('/authentication/validate', methods=['POST'])
def get_user():
    """Gets username and password and validates the user in the database. Returns user type (admin or labeller)"""
    username, password = (
        request.json['username'],
        request.json['password'],
    )
    # Request
    try:
        with app.app_context():
            type = Users.query.filter_by(username=username, password=password).first().type
        return jsonify(type), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error", 400

################ Images endpoints ################

# two possible implementations:
# single request (all images) or multiple requests (single image). 
@app.route('/images/data', methods=['POST']) 
def get_image_data():
    """Receives id and returns binary data of image. Optionaly with labeller and mask info"""
    id, label_mode = (  
        request.json["id"],
        request.json["label_mode"]
        )
    # Request
    try:
        item = Images.query.get(id)
        data_string = item.data.decode('utf-8')
        if label_mode == True:
            return jsonify(data_string, item.labeller, item.mask), 200
        elif label_mode == False: 
            return jsonify(data_string), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error", 400

@app.route('/images/table', methods=['POST']) 
def filter_images(): # (optionally) This endpoint could be split in two (one specifically for csv).
    label, id_mode = (
        request.json["label"], # done, pending or full.
        request.json["id_mode"] # Boolean. Returns entire table (false) or array of ids (true).
        )
    try:
        if label == "done":
            elementsObjs = db.session.query(Images).filter(Images.mask.isnot(None)).all()
        elif label == "pending":
            elementsObjs = Images.query.filter_by(mask=None).all()
        elif label == "full":
            elementsObjs = Images.query.all()
        
        if id_mode == True:
            elements = [element.id for element in elementsObjs]
        elif id_mode == False:
            elements = [{'id': e.id, 'filename': e.filename,'mask': e.mask,'labeller': e.labeller} for e in elementsObjs]
        return jsonify(elements), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error", 400 # Generic error code

@app.route('/images/add', methods=['POST'])
def add_image():
    # Get parameters (filename, data) (mask and labeller Null when introduced)
    filename, data = (
            request.json["filename"],
            request.json["data"]
        )
    # Request
    try:
        with app.app_context():
            image_count = Images.query.count() + 1 # We suppose there are no id gaps in this implementation (no deletion)
            new_image = Images(id=image_count, filename=filename, data=bytes(data, "utf-8"), mask=None, labeller=None)
            db.session.add(new_image)
            db.session.commit()
        return "Success", 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error", 400

@app.route('/images/update_mask', methods=['PUT'])
def update_image_mask():
    """get arguments (image id, mask or no_mask and labeller) and updates image in the database"""
    id, mask, labeller= (
            request.json["id"],
            request.json["mask"],
            request.json["labeller"]
        )
    # request
    try:
        with app.app_context():
            mask_id = Labels.query.filter_by(label=mask).first().id
            element = Images.query.get(id)
            element.mask = mask_id
            element.labeller = labeller
            db.session.commit()
        return "Success", 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error", 400 # Generic error message

################ Labels endpoints ################

@app.route('/labels/get', methods=['GET']) 
def get_labels():
    """Returns all labels in the database as a list of strings"""
    try:
        labelsObjs = Labels.query.all()
        labels = [element.label for element in labelsObjs]
        return jsonify(labels), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error", 400
    
@app.route('/labels/add', methods=['POST'])
def add_label():
    """Get parameter (label) and adds to database"""
    label = (
            request.json["label"],
        )
    # Make request to add label
    try:
        with app.app_context():
            label_count = Labels.query.count() + 1 # (supposing no deletions)
            new_label = Labels(id=label_count, label=label)
            db.session.add(new_label)
            db.session.commit()
        return "Success", 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error", 400
    
######################################################
    
if __name__ == '__main__':
    # Creating users and labels on init for testing
    if not tables_exist():
        user1 = Users(username="admin", password="1234" , type="admin")
        user2 = Users(username="labeller1", password="1234" , type="labeller")
        user3 = Users(username="labeller2", password="1234" , type="labeller")
        label1 = Labels(id=1, label="With mask")
        label2 = Labels(id=2, label="Without mask")
        with app.app_context():
            db.create_all()
            db.session.add(user1)
            db.session.add(user2)
            db.session.add(user3)
            db.session.add(label1)
            db.session.add(label2)
            db.session.commit()

    app.run()

