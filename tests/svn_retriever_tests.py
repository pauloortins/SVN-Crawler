import unittest
import json
from src import *
from collections import namedtuple
import os

def json_to_obj(json_obj):
        return json.loads(json_obj, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))

class SvnRetrieverTests(unittest.TestCase):

    def setUp(self):
        log1_svn = '{ "author": "fuankg", "date": 1375981608.243242 }'

        log2_svn = '{ "author": "fuankg", "date": 1375971894.555844 }'

        self.svn_commits = [
            json_to_obj(log1_svn),
            json_to_obj(log2_svn)
        ]

    def test_when_parsing_svn_data_should_generate_a_list_with_same_length(self):
        result = parse_svn_data(self.svn_commits)
        self.assertEqual(len(result), 2)

    def test_when_parsing_svn_data_should_generate_a_object_properly(self):
        result = parse_svn_data(self.svn_commits)
        self.assertEqual(result[0].author, "fuankg")
        self.assertEqual(result[0].date, "2013-08-08")
        self.assertEqual(result[0].time, "17:06:48")
        self.assertEqual(result[0].weekday, 3)

    def test_when_parsing_svn_data_should_generate_in_ascending_order(self):
        result = parse_svn_data(self.svn_commits)
        for x in xrange(0,len(result) - 1):
            self.assertTrue(result[x].date <= result[x+1].date)
