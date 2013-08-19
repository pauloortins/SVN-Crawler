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
            lat = attrs[-2].strip()
            lng = attrs[-1].strip()
            locations_map[author] = {
                'author': author,
                'lat' : float(lat),
                'lng' : float(lng)
            }

        return locations_map

    def add_location(self, committer, lat, lng):
        locations = open(self.file_path, "a")
        locations.write('{0}|{1}|{2}\n'.format(committer,lat,lng))