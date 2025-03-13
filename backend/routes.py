from app import app, db
from flask import request, jsonify, abort
from models import Contact
from handlers import status

@app.route("/")
def index():
    return jsonify(name="Account REST API Service"), status.HTTP_200_OK


#########################################################
# List all contacts
#########################################################
@app.route("/contacts", methods=["GET"])
def get_all_accounts():
    """ Lists all the Contacts available """
    contacts = Contact.query.all()
    contact_list = [contact.serialize() for contact in contacts]
    if not contacts:
        return jsonify({"error": status.HTTP_204_NO_CONTENT, "message": f"No contacts found :("})
    return jsonify(contact_list), status.HTTP_200_OK


#########################################################
# Create contact
#########################################################
@app.route("/contacts", methods=["POST"])
def create_contacts():
    """ Creates a new Contact """
    new_contact = Contact()
    new_contact.deserialize(request.json)
    try:
        new_contact.create()
    except Exception as error:
        return jsonify({"message": "Invalid or No Acceptable Content","error": status.HTTP_204_NO_CONTENT})
        
    message = new_contact.serialize()
    return jsonify(message), status.HTTP_201_CREATED  


#########################################################
# Read a contact
#########################################################
@app.route("/contacts/<int:contact_id>", methods=["GET"])
def read_contact_by_id(contact_id):
    """ Reads a particular contact given it's ID """
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error": status.HTTP_404_NOT_FOUND, "message": f"No contacts found with ID: {contact_id} :("})
    
    return jsonify(contact.serialize()), status.HTTP_200_OK
            
@app.route("/contacts/<string:contact_name>", methods=["GET"])
def read_contact_by_name(contact_name):
    """ Reads all contacts with the provided first name """
    contacts = db.session.query(Contact).filter_by(fname=contact_name)
    if not contacts:
        return jsonify({"error": status.HTTP_404_NOT_FOUND, "message": f"No contacts found with name: {contact_name} :("})
        
    contact_list = [contact.serialize() for contact in contacts]
    return jsonify(contact_list), status.HTTP_200_OK


#########################################################
# Delete contact
#########################################################
@app.route("/contacts/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    """ Deletes an contact from the database """
    contact = Contact.query.get(contact_id)
    if contact:
        contact.delete()

    return jsonify({"message": "Contact Deleted"}), status.HTTP_204_NO_CONTENT


#########################################################
# Update contact
#########################################################
@app.route("/contacts/<int:contact_id>", methods=["PUT"])
def update_contact(contact_id):
    """ Updates the details of a contact """
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error":status.HTTP_404_NOT_FOUND, "message": f"No contacts found with ID: {contact_id} :("})
    
    contact.deserialize(request.json)
    contact.update()
    return jsonify(contact.serialize()), status.HTTP_200_OK
