from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from handlers import ServerListHandler



def main():
    run_wsgi_app(webapp.WSGIApplication([
        ('/', ServerListHandler),
        ], debug=True))

if __name__ == '__main__':
    main()
