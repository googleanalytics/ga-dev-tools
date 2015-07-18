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


SCOPE = ['https://www.googleapis.com/auth/analytics.readonly']
KEY_FILEPATH = 'service-account-key.json'

with open(KEY_FILEPATH) as key_file:
  KEY_DATA = json.load(key_file)


_credentials = SignedJwtAssertionCredentials(KEY_DATA['client_email'],
                                             KEY_DATA['private_key'],
                                             SCOPE)

_access_token = _credentials.get_access_token().access_token;


def get_access_token():
  return _access_token
