import urllib2
import json

class GoogleMapsService(object):
    """docstring for GoogleMapsService"""
    def get_coordinates_for_address(self, location):

        try:
            location = location.replace(' ', '+')
            url = 'http://maps.googleapis.com/maps/api/geocode/json?address={0}&sensor=false'.format(location)
            response = urllib2.urlopen(url)
            json_object = json.loads(response.read())
            lat = json_object['results'][0]['geometry']['location']['lat']
            lng = json_object['results'][0]['geometry']['location']['lng']
        except Exception, e:
            lat = -1
            lng = -1
        return lat,lng

        