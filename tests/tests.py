import unittest
import json
from src import *
from collections import namedtuple
import os

class GenerateCommitDataTest(unittest.TestCase):

    def setUp(self):        

        log1_tuple = ('fuankg', '2013-06-03 13:02:46')
        log2_tuple = ('jailletc36', '2013-06-01 08:43:12')

        self.commits_tuples = [log1_tuple,log2_tuple]

        log1_obj = Commit('fuankg', '2013-06-03', '13:02:46')
        log2_obj = Commit('jailletc36', '2013-06-01', '08:43:12')

        self.commits_object = [log1_obj,log2_obj]

        location1 = 'fuankg | 42.3763 | -87.899605'
        location2 = 'jailletc36 | 39.578736 | -76.378333'

        self.locations = [location1, location2]            

    def test_when_linking_location_to_commits_should_get_location_properly(self):
        result = link_locations(self.commits_object, self.locations)
        self.assertEqual(result[0].lat, 42.3763)
        self.assertEqual(result[0].lng, -87.899605)

    def test_when_should_generate_json_properly(self):
        log1_obj = Commit('fuankg', '2013-06-03', '13:02:46')
        log2_obj = Commit('jailletc36', '2013-06-01', '08:43:12')

        log1_obj.lat = 12
        log1_obj.lng = 15

        log2_obj.lat = 10
        log2_obj.lng = 17

        commits_object = [log1_obj,log2_obj]

        result = generate_json(commits_object)
        expected = '{"author": "fuankg", "value": 1, "lat": 12, "lng": 15, "date": "2013-06-03", "time": "13:02:46", "weekday": 0},\n{"author": "jailletc36", "value": 1, "lat": 10, "lng": 17, "date": "2013-06-01", "time": "08:43:12", "weekday": 5}'

        self.assertEqual(result,expected)

    def test_when_generating_output_a_new_folder_with_software_name_should_be_created(self):
        generate_output('testeapp', 'json_content')
        path = os.path.join('../output/testeapp')

        self.assertTrue(os.path.isdir(path))

    def test_when_generating_output_a_commit_js_file_should_be_created(self):
        generate_output('testeapp', 'json_content')
        path = os.path.join('../output/testeapp/js/commits.js')

        self.assertTrue(os.path.exists(path))

if __name__ == '__main__':
    unittest.main()