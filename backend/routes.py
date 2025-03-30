from app import flask_app, frontend_path
from flask import request, jsonify, send_from_directory, redirect
from models import Contact
from handlers import status
from datetime import datetime
from sqlalchemy import or_, cast, func
from sqlalchemy.types import String
import pandas as pd


@flask_app.route("/", defaults={"filename":""})
@flask_app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(frontend_path,filename), status.HTTP_200_OK


#########################################################
# List all contacts
#########################################################
@flask_app.route("/contacts", methods=["GET"])
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
@flask_app.route("/contacts", methods=["POST"])
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
# @flask_app.route("/contacts/<int:contact_id>", methods=["GET"])
# def read_contact_by_id(contact_id):
#     """ Reads a particular contact given it's ID """
#     contact = Contact.query.get(contact_id)
#     if not contact:
#         return jsonify({"error": status.HTTP_404_NOT_FOUND, "message": f"No contacts found with ID: {contact_id} :("})
    
#     return jsonify(contact.serialize()), status.HTTP_200_OK
            
@flask_app.route("/contacts/<input>", methods=["GET"])
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
                    func.lower(Contact.gender).ilike(f"{input}"),
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
@flask_app.route("/contacts/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    """ Deletes an contact from the database """
    contact = Contact.query.get(contact_id)
    if contact:
        contact.delete()

    return jsonify({"message": "Contact Deleted"}), status.HTTP_204_NO_CONTENT


#########################################################
# Update contact
#########################################################
@flask_app.route("/contacts/<int:contact_id>", methods=["PUT"])
def update_contact(contact_id):
    """ Updates the details of a contact """
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error":status.HTTP_404_NOT_FOUND, "message": f"No contacts found with ID: {contact_id} :("})
    
    contact.deserialize(request.json,"update")
    contact.update()
    return jsonify(contact.serialize()), status.HTTP_200_OK


#########################################################
# DASH Plots
#########################################################
@flask_app.route("/dash", methods=["GET"])
def get_dashboard():
    """ Retrieve data from database and plot in Dash"""
    def get_zodiac_sign(date):
        day = date.day
        month = date.month
        
        zodiac_signs = [((21, 3), (19, 4), "Aries"), ((20, 4), (20, 5), "Taurus"), ((21, 5), (21, 6), "Gemini"),
                        ((22, 6), (22, 7), "Cancer"), ((23, 7), (22, 8), "Leo"), ((23, 8), (22, 9), "Virgo"),
                        ((23, 9), (23, 10), "Libra"), ((24, 10), (21, 11), "Scorpio"), ((22, 11), (21, 12), "Sagittarius"),
                        ((22, 12), (19, 1), "Capricorn"), ((20, 1), (18, 2), "Aquarius"), ((19, 2), (20, 3), "Pisces")
                        ]
        
        for start_date, end_date, sign in zodiac_signs:
            start_day, start_month = start_date
            end_day, end_month = end_date
            
            if (start_month < month < end_month) or \
            (start_month == month and day >= start_day) or \
            (end_month == month and day <= end_day):
                return sign

    contacts = Contact.query.with_entities(Contact.source,Contact.gender,Contact.birthday).all()
    if contacts:    
        # Derive year, zodiac sign and age columns from the contacts information  
        df = pd.DataFrame.from_records(contacts, columns=["source", "gender", "birthday"])
        df = df[(df.gender != "") & (df.birthday != "")]
        df['birthday'] = pd.to_datetime(df['birthday'], format='%d-%m-%Y', errors='coerce')
        df['year'] = df['birthday'].dt.year
        df['zodiac_sign'] = df['birthday'].apply(get_zodiac_sign)
        current_year = datetime.now().year
        df['age'] = current_year - df['year']
        
        # Save dataframe into .csv file
        df.to_csv("contact_details.csv", index=True, header=True)
    
    return redirect('/dashboard')