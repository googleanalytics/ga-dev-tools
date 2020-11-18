# coding=utf-8


# Copyright 2016 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import webapp2
import lib.handlers.redirects as redirects
from webapp2_extras.routes import RedirectRoute
from lib.handlers.base import BaseHandler
from lib.handlers.explorer_csv import ExplorerCsvHandler
from lib.handlers.server_side_auth import ServerSideAuthHandler
from lib.handlers.url_shorten_auth import UrlShortenAuthHandler
from lib.handlers.ga_cubes import GACubesHandler


router = webapp2.WSGIApplication([

  # Redirects
  (r'/demos/embed-api.*', redirects.EmbedApiRedirect),
  (r'/explorer/csvhandler.*', redirects.QueryExplorerCsvRedirect),
  (r'/explorer.*', redirects.QueryExplorerRedirect),
  (r'/polymer-elements.*', redirects.HomePageRedirect),
  (r'/aw-event-builder.*', redirects.AppWebRedirect),

  # Static routes
  (r'/query-explorer/csvhandler.*', ExplorerCsvHandler),
  (r'/bitly-api-token-handler/?', UrlShortenAuthHandler),
  (r'/ga_cubes.json/?', GACubesHandler),

  # Dynamic routes
  RedirectRoute(r'/',
      handler=BaseHandler, name='Home', strict_slash=True),
  RedirectRoute(r'/<project>/',
      handler=BaseHandler, name='Project', strict_slash=True),
  RedirectRoute(r'/<project>/<page>/',
      handler=BaseHandler, name='Page', strict_slash=True),

], debug=False)
