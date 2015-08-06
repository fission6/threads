from gevent.monkey import patch_all
patch_all()

import os
import logging
from gevent.pywsgi import WSGIServer

import falcon
import requests
from cachetools import LRUCache

THREAD_ENDPOINT = os.environ.get('THREAD_ENDPOINT')
POST_ENDPOINT = os.environ.get('POST_ENDPOINT')
MAX_LENGTH = 30
CACHE_SIZE = 2000
CACHE = LRUCache(maxsize=CACHE_SIZE)


class Threads(object):

    def on_get(self, req, resp):
        """Handles GET requests"""

        print "Getting Threads"
        result = requests.get(THREAD_ENDPOINT)
        resp.status = str(result.status_code) + ' ' + result.reason
        resp.content_type = result.headers['content-type']
        resp.body = result.text

class Posts(object):

    def on_get(self, req, resp, thread_id):
        """Handles GET requests"""

        skip = req.get_param('skip', 0)
        cache_key = (thread_id, skip)

        print "Getting Posts for Thread: {0}".format(cache_key)

        # check if request is in cache
        if cache_key in CACHE:
            print "Found request in Cache {0}".format(cache_key)
            resp.body = CACHE.get(cache_key)

        # otherwise fetch upstream
        else:
            endpoint = POST_ENDPOINT.format(thread_id=thread_id)
            params = {'skip': skip}
            result = requests.get(endpoint, params=params)

            # cache client side and server side if 30 posts are returned as it should never change
            if len(result.json().get('data')) == MAX_LENGTH:
                print "Caching Response"
                CACHE[cache_key] = result.text
                resp.cache_control = ['max-age=31536000']

            print "Cache size {0}".format(CACHE.currsize)

            resp.status = str(result.status_code) + ' ' + result.reason
            resp.body = result.text


app = falcon.API()

threads = Threads()
app.add_route('/threads/', threads)

posts = Posts()
app.add_route('/threads/{thread_id}/posts/', posts)

# Useful for debugging problems in your API; works with pdb.set_trace()
if __name__ == '__main__':
    http_server = WSGIServer(('127.0.0.1', 8001), app)
    http_server.serve_forever()