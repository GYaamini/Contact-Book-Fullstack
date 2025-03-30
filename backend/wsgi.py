from app import flask_app, dash_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple

application = DispatcherMiddleware(flask_app, {
    '/dashboard': dash_app.server
})

if __name__ == "__main__":
    run_simple(application)