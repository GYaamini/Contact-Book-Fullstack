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
            "birthday": self.birthday,
            "imgURL": self.image_url,
        }

    def deserialize(self, data):
        try:
            required = ["firstName", "source", "phoneNumber1"]
            cols =  data.keys()
            for col in required:
                if col not in cols:
                    return jsonify({"msg": f"Missing {col}", "error": status.HTTP_204_NO_CONTENT})
            
            self.fname = data.get("firstName")
            self.lname = data.get("lastName") if "lastName" in cols else ""
            self.source = data.get("source")
            self.notes = data.get("notes") if "notes" in cols else "..."
            self.phone_number_1 = data.get("phoneNumber1")
            self.phone_number_2 = data.get("phoneNumber2") if "phoneNumber2" in cols else ""
            self.email = data.get("email") if "email" in cols else "@?"
            self.gender = data.get("gender") if "gender" in cols else ""
            self.birthday = data.get("birthday") if "birthday" in cols else ""
            
            ln = self.lname if self.lname!=None else ""
            if self.gender!=None:
                gen = "boy" if self.gender=="male" else "girl"
                self.image_url = f"https://avatar.iran.liara.run/public/{gen}?username={self.fname+" "+ln}"
            else:
                self.image_url = f"https://avatar.iran.liara.run/username?username={self.fname+" "+ln}"
        except AttributeError as error:
            raise DataValidationError("Invalid attribute: " + error.args[0])
        except TypeError as error:
            raise DataValidationError("Invalid contact: missing " + error.args[0])
        except KeyError as error:
            raise DataValidationError("Invalid contact: body of request contained bad or no data " + error.args[0])
            
        finally:
            return self
