
# Contact Comb

**Contact Management Full-Stact Application with Flask and React**

![Demo App](https://github.com/user-attachments/assets/9b147059-8d60-4f40-8522-51fc8fc2f862)

Dropdown Chart      |  Range Chart
:-------------------------:|:-------------------------:
![Dropdown Chart](https://github.com/user-attachments/assets/f2bebb1b-4aea-48ef-9c5c-82fa7aca9f6e) | ![Range Chart](https://github.com/user-attachments/assets/f8f573f8-cc89-4386-b8cb-d4a71d52fe1d)


### Table of Contents

1. **Tech Stack**: 
    - Backend: **Python, Flask, SQLite, SQLAlchemy**
    - Frontend: **React and Chakra UI v3 with Vite**
    - Dashboard: **Plotly and Dash**

2. **CRUD Functionality**: Create, Search/Read specific contacts, List all contacts, Update, and Delete contacts

3. **CI/CD using GitHub Actions**: 
    - Containerized with **Docker**
    - Deployed on **Render**

4. **QR-Code**: Can scan and get the details of any contact card

5. **Dashboard**: A dropdown chart featuring Source, Gender, Zodiac Sign, and Age Group, as well as a range-controlled chart showing the spread of birth years to provide an overview of the contacts' demographics.

6. Contacts cards are displayed in responsive grid layout to adjust the screen size dynamically and are **ordered alphabetically** according to their first names.

7. Light and Dark Mode: Enjoy a personalized user interface experience with light and dark mode options.


### Run the App Locally

1. Clone the repository

2. Navigate to the project directory
    ```bash
    cd Contact-Book-Fullstack
    ```

3. Set up Frontend
    ```bash
    cd frontend
    ```
    * Open App.jsx under ./src
        * Uncomment local BASE_URL used for local development (http://127.0.0.1:5000)
        * Comment render BASE_URL used for gh-pages and Render deployment (https://contact-book-fullstack.onrender.com)
    
    ```bash
    npm install
    nom run build
    ```

4. Set up Backend
    ```bash
    cd ../backend
    python3 -m venv venv
    venv\Scripts\activate   ## on MacOS and Linux : source venv/bin/activate
    pip install -r requirements.txt
    flask run
    ```

5. Open browser and go to `http://localhost:5000/` to view the application

## Acknowledgements
The architecture and structure of this project were inspired by : [As a Programmer](https://github.com/burakorkmez/react-python-tutorial)
