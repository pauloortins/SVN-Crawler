import datetime
import time
from commit import *
import urllib2
import json
from retriever import *

class GithubRetriever(Retriever):    
    
    def __init__(self, github_service, locations_retriever, googlemaps_service):
        self.github_service = github_service
        self.locations_retriever = locations_retriever
        self.googlemaps_service = googlemaps_service
        

    def get_commits(self):
        data = self.github_service.get_info()
        commits = self.parse_github_data(data)
        self.update_locations(commits)
        commits = self.link_commits_to_locations(commits, self.locations_retriever.get_locations())

        return commits

    def parse_github_data(self, data):
        
        print "--- Parsing Data ---"

        commits = []

        for commit in data:            
            if commit['author'] != None:
                author = commit['author']['login'].lower()
                date = commit['commit']['author']['date'].split('T')[0]
                time = commit['commit']['author']['date'].split('T')[1].split('-')[0].replace('Z', '')

                commits.append(Commit(author,date,time))

        commits.sort(key=lambda x:x.date)
        return commits

    def update_locations(self, commits):
        committers = self.get_committers_from_commits(commits)
        locations = self.locations_retriever.get_locations()

        for committer in committers:
            if (not committer in locations):
                committer_address = self.github_service.get_address_for_user(committer)
                lat, lng = self.googlemaps_service.get_coordinates_for_address(committer_address)
                self.locations_retriever.add_location(committer, lat, lng)

    def get_committers_from_commits(self, commits):
        authors = map(lambda x: x.author, commits)
        unique_authors = list(set(authors))
        unique_authors.sort()

        return unique_authors    