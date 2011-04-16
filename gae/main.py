from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app









class ServerListHandler(webapp.RequestHandler):
    def get(self):
        pass


def main():
    run_wsgi_app(webapp.WSGIApplication([
        ('/', ServerListHandler),
        ], debug=True))

if __name__ == '__main__':
    main()
