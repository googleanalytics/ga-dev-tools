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
from oauth2client.client import SignedJwtAssertionCredentials


# The scope for the OAuth2 request.
SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'


# The location of the key file with the key data.
KEY_FILEPATH = 'service-account-key.json'


# Cache the credentials object
__credentials = None


# Gets the credentials object from the cache if available,
# otherwise generates it from the key file.
def get_credentials():
  global __credentials

  if __credentials:
    return __credentials
  else:
    # Loads the key file's private data.
    with open(KEY_FILEPATH) as key_file:
      key_data = json.load(key_file)

    # Constructs a credentials objects from the key data and OAuth2 scope.
    __credentials = SignedJwtAssertionCredentials(
        key_data['client_email'], key_data['private_key'], SCOPE)

    return __credentials


# Defines a method to get an access token from the credentials object.
# The access token is automatically refreshed if it has expired.
def get_access_token():
  return get_credentials().get_access_token().access_token
