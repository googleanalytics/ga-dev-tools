# coding=utf-8


# Copyright 2015 Google Inc. All rights reserved.
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


import json
from google.appengine.api import memcache
from oauth2client.client import SignedJwtAssertionCredentials


# The scope for the OAuth2 request.
SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'


# The location of the key file with the key data.
KEY_FILEPATH = 'service-account-key.json'


CACHE_KEY = 'access_token'


# The duration to consider stored access tokens valid for.
# Access token expire in 60 minutes, use 50 minutes to be safe.
EXPIRY_TIME = 60 * 50


def _get_access_token_from_cache():
  """Gets an access token stored in cache, if present."""
  return memcache.get(CACHE_KEY)


def _refresh_access_token_in_cache(access_token):
  """Update the access token in the cache with a new, valid one."""
  memcache.set(CACHE_KEY, access_token, time=EXPIRY_TIME)


def _get_access_token_from_key_file():
  """Gets an access token from the key file data"""

  with open(KEY_FILEPATH) as key_file:
    KEY_DATA = json.load(key_file)

  credentials = SignedJwtAssertionCredentials(
      KEY_DATA['client_email'], KEY_DATA['private_key'], SCOPE)

  return credentials.get_access_token().access_token


def get_access_token():
  """Gets a valid access token from the data in the key file. The token is
  cached for 50 minutes so multiple calls to this function don't require
  authorization requests.
  """

  access_token = _get_access_token_from_cache()

  if not access_token:
    access_token = _get_access_token_from_key_file()
    _refresh_access_token_in_cache(access_token)

  return access_token
