from googlemaps_service import *

f = open('locations/httpd_locations.txt')

for line in f:
    attrs = line.split('|')
    lat = attrs[-2].strip()
    lng = attrs[-1].strip()
    timeoffset = GoogleMapsService().get_timezone_from_coordinates(lat, lng)
    attrs.append(str(timeoffset))    
    text = '|'.join(attrs).replace('\n','')
    print text
    

