import urllib2
import json
import urllib

class GoogleMapsService(object):
    """docstring for GoogleMapsService"""
    def get_coordinates_for_address(self, location):

        try:
            location = location.replace(' ', '+')
            url = 'http://maps.googleapis.com/maps/api/geocode/json?address={0}&sensor=false'.format(urllib.quote_plus(location))
            response = urllib2.urlopen(url)
            json_object = json.loads(response.read())
            lat = json_object['results'][0]['geometry']['location']['lat']
            lng = json_object['results'][0]['geometry']['location']['lng']
        except Exception, e:
            lat = -1
            lng = -1
        return lat,lng

    def get_timezone_from_coordinates(self, lat, lng):
        try:
            
            url = 'https://maps.googleapis.com/maps/api/timezone/json?location={0},{1}&timestamp=1331161200&sensor=true'.format(lat, lng)
            response = urllib2.urlopen(url)
            json_object = json.loads(response.read())
            timezone = json_object["rawOffset"] / 3600
        except Exception, e:
            return 0

        return timezone
        