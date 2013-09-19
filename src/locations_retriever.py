class LocationRetriever(object):
    """docstring for LocationRetriever"""
    def __init__(self, file_path):
        self.file_path = file_path

    def get_locations(self):
        lines = open(self.file_path)

        locations_map = {}

        for location in lines:
            attrs = location.split('|')
            author = attrs[0].strip()
            lat = attrs[-3].strip()
            lng = attrs[-2].strip()
            timeoffset = attrs[-1].strip()
            locations_map[author] = {
                'author': author,
                'lat' : float(lat),
                'lng' : float(lng),
                'timeoffset': int(timeoffset)
            }

        return locations_map

    def add_location(self, committer, lat, lng, timeoffset):
        locations = open(self.file_path, "a")
        locations.write('{0}|{1}|{2}|{3}\n'.format(committer,lat , lng, timeoffset))