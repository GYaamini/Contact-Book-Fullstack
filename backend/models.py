from app import db
from handlers import status
from flask import jsonify

class DataValidationError(Exception):
    """Used for describing any data validation error"""


class Persistence():
    """Base class added persistent methods"""

    def __init__(self):
        self.id = None  # pylint: disable=invalid-name

    def create(self):
        """ Creates a Account to the database """
        self.id = None
        db.session.add(self)
        db.session.commit()

    def update(self):
        """ Updates a Account to the database """
        db.session.commit()

    def delete(self):
        """ Removes a Account from the data store """
        db.session.delete(self)
        db.session.commit()


class Contact(db.Model, Persistence):
    """ Class to define Contacts schema """

    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(30), nullable=False)
    lname = db.Column(db.String(30), nullable=True)
    source = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    phone_number_1 = db.Column(db.String(15), nullable=False)
    phone_number_2 = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    birthday = db.Column(db.String(15), nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    
    def serialize(self):
        d,m,y = self.birthday.split('-')
        date = y+'-'+m+'-'+d
        return {
            "id": self.id,
            "firstName": self.fname,
            "lastName": self.lname,
            "source": self.source,
            "notes": self.notes,
            "phoneNumber1": self.phone_number_1,
            "phoneNumber2": self.phone_number_2,
            "email": self.email,
            "gender": self.gender,
            "birthday": date,
            "imgURL": self.image_url,
        }

    def deserialize(self, data, purpose="normal"):
        try:
            date = "-".join(data.get("birthday").split('-')[::-1])
            
            self.fname = data.get("firstName")
            self.lname = data.get("lastName")
            self.notes = data.get("notes")
            self.phone_number_1 = data.get("phoneNumber1")
            self.phone_number_2 = data.get("phoneNumber2")
            self.email = data.get("email")
            self.birthday = date
            
            if purpose == "normal":
                self.source = data.get("source")
                self.gender = data.get("gender")
                
                if self.gender!="":
                    gen = "boy" if self.gender=="Male" else "girl"
                    self.image_url = f"https://avatar.iran.liara.run/public/{gen}?username={self.fname+' '+self.lname}"
                else:
                    self.image_url = f"https://avatar.iran.liara.run/username?username={self.fname+' '+self.lname}"
        except AttributeError as error:
            raise DataValidationError("Invalid attribute: " + error.args[0])
        except TypeError as error:
            raise DataValidationError("Invalid contact: missing " + error.args[0])
        except KeyError as error:
            raise DataValidationError("Invalid contact: body of request contained bad or no data " + error.args[0])
            
        finally:
            return self
