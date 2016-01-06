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


import cStringIO
import json
import logging
import lib.csv_writer as csv_writer
from google.appengine.api import urlfetch
from lib.handlers.base import BaseHandler

class ExplorerCsvHandler(BaseHandler):

  def get(self):
    uri = ('https://www.googleapis.com/analytics/v3/data/ga?' +
           self.request.query_string)
    result = urlfetch.fetch(url=uri, deadline=60)

    if result.status_code == 200:

      response = json.loads(result.content)
      output = cStringIO.StringIO()
      writer = csv_writer.GetTsvStringPrinter(output)
      writer.Output(response)

      out = output.getvalue()

      decoding = out.decode('utf-8')
      encoding = decoding.encode('utf-16')
      self.OutputCsv16(encoding)

      output.close()

    else:
      logging.error('there was an error')

  def OutputCsv16(self, tsv_body):
    """Renders TSV content.

    Args:
      tsv_body: The TSV content to output.
    """
    self.response.headers['Content-Type'] = (
        'application/vnd.ms-excel; charset=UTF-16LE')
    self.response.headers['Content-Disposition'] = (
        'attachment; filename=query_explorer.tsv')
    self.response.out.write(tsv_body)
