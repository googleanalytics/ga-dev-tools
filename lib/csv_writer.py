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


"""Utility to convert a Data Export API reponse into TSV.

This provides utitlites to both print TSV files to the standard output
as well as directly to a file. This logic handles all the utf-8 conversion.

  GetTsvFilePrinter: Returns an instantiated object to output to files.
  GetTsvScreenPrinter: Returns an instantiated object to output to the screen.
  UnicodeWriter(): Utf-8 encodes output.
  ExportPrinter(): Converts the Data Export API response into tabular data.
"""

__author__ = 'api.nickm@ (Nick Mihailovski)'


import codecs
import csv
import StringIO
import sys
import types


# A list of special characters that need to be escaped.
SPECIAL_CHARS = ('+', '-', '/', '*', '=')
# TODO(nm): Test leading numbers.


def GetTsvFilePrinter(file_name):
  """Returns a ExportPrinter object to output to file_name.

  Args:
    file_name: string The name of the file to output to.

  Returns:
    The newly created ExportPrinter object.
  """
  my_handle = open(file_name)
  writer = UnicodeWriter(my_handle, dialect='excel-tab')
  return ExportPrinter(writer)


def GetTsvScreenPrinter():
  """Returns a ExportPrinter object to output to std.stdout."""
  writer = UnicodeWriter(sys.stdout, dialect='excel-tab')
  return ExportPrinter(writer)


def GetTsvStringPrinter(f):
  """Returns a ExportPrinter object to output to std.stdout."""
  writer = UnicodeWriter(f, dialect='excel-tab')
  return ExportPrinter(writer)


# Wrapper to output to utf-8. Taken mostly / directly from Python docs:
# http://docs.python.org/library/csv.html
class UnicodeWriter(object):
  """A CSV writer which uses the csv module to output csv compatible formats.

  Will write rows to CSV file "f", which is encoded in the given encoding.
  """

  def __init__(self, f, dialect=csv.excel, encoding='utf-8', **kwds):
    # Redirect output to a queue
    self.queue = StringIO.StringIO()
    self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
    self.stream = f
    self.encoder = codecs.getincrementalencoder(encoding)()

  # pylint: disable=g-bad-name
  def writerow(self, row):
    """Writes a CSV row.

    Args:
      row: list The row to write to the CSV output.
    """

    self.writer.writerow([s.encode('utf-8') for s in row])
    # Fetch UTF-8 output from the queue ...
    data = self.queue.getvalue()
    data = data.decode('utf-8')
    # ... and reencode it into the target encoding
    data = self.encoder.encode(data)
    # write to the target stream
    self.stream.write(data)
    # empty queue
    self.queue.truncate(0)

  # pylint: disable=g-bad-name
  def writerows(self, rows):
    """Writes rows for CSV output.

    Args:
      rows: list of rows to write.
    """
    for row in rows:
      self.writerow(row)


class ExportPrinter(object):
  """Utility class to output a the data feed as tabular data."""

  def __init__(self, writer):
    """Initializes the class.

    Args:
      writer: Typically an instance of UnicodeWriter. The interface for this
          object provides two methods, writerow and writerow, which
          accepts a list or a list of lists respectively and process them as
          needed.
    """
    self.writer = writer

  def Output(self, results):
    """Outputs formatted rows of data retrieved from the Data Export API.

    This uses the writer object to output the data in the Data Export API.

    Args:
      results: The response from the data export API.
    """

    if not results.get('rows'):
      self.writer.writerow('No Results found')

    else:
      self.OutputProfileName(results)
      self.writer.writerow([])
      self.OutputContainsSampledData(results)
      self.writer.writerow([])
      self.OutputQueryInfo(results)
      self.writer.writerow([])

      self.OutputHeaders(results)
      self.OutputRows(results)

      self.writer.writerow([])
      self.OutputRowCounts(results)
      self.OutputTotalsForAllResults(results)

  def OutputProfileName(self, results):
    """Outputs the profile name along with the qurey."""
    profile_name = ''
    info = results.get('profileInfo')
    if info:
      profile_name = info.get('profileName')

    self.writer.writerow(['Report For View (Profile): ', profile_name])

  def OutputQueryInfo(self, results):
    """Outputs the query used."""
    self.writer.writerow(['These query parameters were used:'])

    query = results.get('query')
    for key, value in query.iteritems():
      if type(value) == types.ListType:
        value = ','.join(value)
      else:
        value = str(value)
      value = ExcelEscape(value)
      self.writer.writerow([key, value])

  def OutputContainsSampledData(self, results):
    """Outputs whether the resuls have been sampled."""

    sampled_text = 'do not'
    if results.get('containsSampledData'):
      sampled_text = 'do'

    row_text = 'These results %s contain sampled data.' % sampled_text
    self.writer.writerow([row_text])

  def OutputHeaders(self, results):
    """Outputs all the dimension and metric names in order."""

    row = []
    for header in results.get('columnHeaders'):
      row.append(header.get('name'))
    self.writer.writerow(row)

  def OutputRows(self, results):
    """Outputs all the rows in the table."""

    # Replace any first characters that have an = with '=
    for row in results.get('rows'):
      out_row = []
      for cell in row:
        cell = ExcelEscape(cell)
        out_row.append(cell)
      self.writer.writerow(out_row)

  def OutputRowCounts(self, results):
    """Outputs how many rows were returned vs rows that were matched."""

    items = str(results.get('itemsPerPage'))
    matched = str(results.get('totalResults'))

    output = [
        ['Rows Returned', items],
        ['Rows Matched', matched]
    ]
    self.writer.writerows(output)

  def OutputTotalsForAllResults(self, results):
    """Outputs the totals for all results matched by the query.

    This is not the sum of the values returned in the response.
    This will align the metric totals in the same columns as
    the headers are printed. The totals are stored as a dict, where the
    key is the metric name and the value is the total. To align these
    totals in the proper columns, a position index of the metric name
    and it's position in the table is first created. Then the totals
    are added by position to a row of empty strings.

    Args:
      results: API Response from Core Reporting API.
    """

    # Create the metric position index.
    metric_index = {}
    headers = results.get('columnHeaders')
    for index in range(0, len(headers)):
      header = headers[index]
      if header.get('columnType') == 'METRIC':
        metric_index[header.get('name')] = index

    # Create a row of empty strings the same length as the header.
    row = [''] * len(headers)

    # Use the position index to output the totals in the right columns.
    totals = results.get('totalsForAllResults')
    for metric_name, metric_total in totals.iteritems():
      index = metric_index[metric_name]
      row[index] = metric_total

    self.writer.writerows([['Totals For All Rows Matched'], row])


def ExcelEscape(input_value):
  """Escapes the first character of a string if it is special in Excel.

  Args:
    input_value: string The value to escape.

  Returns:
    A string that has the first character escaped if it is special.
  """
  if input_value and input_value[0] in SPECIAL_CHARS:
    return "'" + input_value

  return input_value
