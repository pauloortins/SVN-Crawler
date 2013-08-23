import unittest
import json
from generate_commits_data import *
from collections import namedtuple
import os

def json_to_obj(json_obj):
        return json.loads(json_obj, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))

class GithubRetrieverTests(unittest.TestCase):

    def setUp(self):
        log1_github = '{ "commit": { "author": { \
                            "date": "2010-04-10T14:10:01-07:00",\
                            "name": "Scott Chacon" }}, "author": {"login":"Login1"} }'

        log2_github = '{ "commit": { "author": { \
                            "date": "2010-04-10T14:10:01-07:00",\
                            "name": "Paul Graham" }}, "author": {"login":"login2"} }'

        self.github_commits = [
            json.loads(log1_github),
            json.loads(log2_github)
        ]

        commit1 = Commit('author', '2013-01-01' ,'13:00:01')
        commit2 = Commit('author2', '2013-01-01' ,'13:00:01')
        commit3 = Commit('author', '2013-01-01' ,'13:00:01')

        self.commits = [commit1, commit2, commit3]

    def test_when_parsing_svn_data_should_generate_a_list_with_same_length(self):
        result = parse_github_data(self.github_commits)
        self.assertEqual(len(result), 2)

    def test_when_parsing_svn_data_should_generate_a_object_properly(self):
        result = parse_github_data(self.github_commits)
        self.assertEqual(result[0].author, "login1")
        self.assertEqual(result[0].date, "2010-04-10")
        self.assertEqual(result[0].time, "14:10:01")
        self.assertEqual(result[0].weekday, 5)

    def test_when_parsing_svn_data_should_generate_in_ascending_order(self):
        result = parse_github_data(self.github_commits)
        for x in xrange(0,len(result) - 1):
            self.assertTrue(result[x].date <= result[x+1].date)

    def test_should_get_committers_from_commits_properly(self):
        result = get_committers_from_commits(self.commits)
        self.assertEqual(result[0], 'author')
        self.assertEqual(result[1], 'author2')
