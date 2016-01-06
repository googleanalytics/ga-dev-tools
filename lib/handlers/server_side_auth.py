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


import lib.service_account as service_account
import lib.template as template
from lib.handlers.base import BaseHandler


class ServerSideAuthHandler(BaseHandler):
  def get(self):
    data = template.get_data('embed-api', 'server-side-authorization')
    data['site']['access_token'] = service_account.get_access_token()
    html = template.render('embed-api', 'server-side-authorization', data)

    self.response.write(html)
