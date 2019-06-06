import webapp2

from google.appengine.api import urlfetch

class GACubesHandler(webapp2.RequestHandler):
	def get(self):
		try:
			cubes_response = urlfetch.fetch(
				"https://developers.google.com/analytics/ga_cubes.json",
				method="GET",
				headers={
					"Accept": "application/json",
				},
				validate_certificate=True,
				follow_redirects=True,
			)

		except Exception as e:
			return webapp2.Response(
				status=500,
				content_type="text/plain",
				body="Unknown error fetching cubes from developers.google.com"
			)

		if cubes_response.status_code >= 300:
			return webapp2.Response(
				status=500,
				content_type="text/plain",
				body="Error: developers.google.com returned error code {} instead of cubes data"
					.format(cubes_response.status_code),
			)

		return webapp2.Response(
			status=200,
			content_type="application/json",
			body=cubes_response.content
		)
