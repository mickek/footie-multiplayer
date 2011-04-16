import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template


class ServerListHandler(webapp.RequestHandler):
    def get(self):
        v = {}
        path = os.path.join(os.path.dirname(__file__), 'templates/main.html')
        self.response.out.write(template.render(path, v))
    
    def post(self):
        link=self.request.POST.get('url', 'url')
        v = {'l': link }

        path = os.path.join(os.path.dirname(__file__), 'templates/main.html')
        self.response.out.write(template.render(path, v))


