# coding=utf-8

# Copyright 2018 Google Inc. All rights reserved.
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

# This module manages access to our API keys for the bitly API

import ConfigParser
import warnings

KEY_CFG_PATH = 'bitly_api_key.cfg'
KEY_CFG_HEADER = 'Production'

def get_client_key(file_path, header):
    config = ConfigParser.SafeConfigParser()

    try:
        with open(file_path) as file:
            config.readfp(file, file_path)
    except Exception as e:
        warnings.warn(
            "Error reading bitly API credentials. "
            "API shortening will be disabled.\n"
            "If you want to do bit.ly API shortening, add a bitly_api_key.cfg "
            "file to the project root, which should include client_id and "
            "client_secret under the header [Production].\n"
            "{}".format(e))
        return None, None


    client_id = config.get(header, 'client_id')
    client_secret = config.get(header, 'client_secret')

    return client_id, client_secret

CLIENT_ID = None
CLIENT_SECRET = None

def refresh_global_client_key(file_path=None, header=None):
    file_path = file_path or KEY_CFG_PATH
    header = header or KEY_CFG_HEADER

    global CLIENT_ID
    global CLIENT_SECRET

    CLIENT_ID, CLIENT_SECRET = get_client_key(file_path, header)

    return CLIENT_ID, CLIENT_SECRET

# We assume that we'll only want to load once per process invocation, so we just
# do it on import
refresh_global_client_key()
