from app import app, db, frontend_path
from flask import request, jsonify, send_from_directory
from models import Contact
from handlers import status
from sqlalchemy import or_, cast
from sqlalchemy.types import String

@app.route("/", defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(frontend_path,filename), status.HTTP_200_OK


#########################################################
# List all contacts
#########################################################
@app.route("/contacts", methods=["GET"])
def get_all_accounts():
    """ Lists all the Contacts available """
    contacts = Contact.query.all()
    contact_list = [contact.serialize() for contact in contacts]
    # if not contacts:
    #     return jsonify({"error": status.HTTP_204_NO_CONTENT, "message": f"No contacts found :("})
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
        
    return jsonify(new_contact.serialize()), status.HTTP_201_CREATED  


#########################################################
# Read a contact
#########################################################
# @app.route("/contacts/<int:contact_id>", methods=["GET"])
# def read_contact_by_id(contact_id):
#     """ Reads a particular contact given it's ID """
#     contact = Contact.query.get(contact_id)
#     if not contact:
#         return jsonify({"error": status.HTTP_404_NOT_FOUND, "message": f"No contacts found with ID: {contact_id} :("})
    
#     return jsonify(contact.serialize()), status.HTTP_200_OK
            
@app.route("/contacts/<input>", methods=["GET"])
def read_contact_by_name(input):
    """ Reads all contacts with the provided input """
    input = str(input)
    contacts = Contact.query.filter(
                or_(
                    Contact.fname.ilike(f"%{input}%"),
                    Contact.lname.ilike(f"%{input}%"),
                    Contact.source.ilike(f"%{input}%"),
                    Contact.notes.ilike(f"%{input}%"),
                    Contact.phone_number_1.ilike(f"%{input}%"),
                    Contact.phone_number_2.ilike(f"%{input}%"),
                    Contact.email.ilike(f"%{input}%"),
                    Contact.gender.ilike(f"%{input}%"),
                    cast(Contact.birthday,String).ilike(f"%{input}%")
                )
            ).all()
    
    # if not contacts:
    #     return jsonify({"error": status.HTTP_404_NOT_FOUND, "message": f"No contacts found with name: {contact_name} :("})
        
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
    
    contact.deserialize(request.json,"update")
    contact.update()
    return jsonify(contact.serialize()), status.HTTP_200_OK
