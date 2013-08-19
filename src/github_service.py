import urllib2
import json

class GithubService(object):
    
    def __init__(self, repository_url):
        self.repository_url = repository_url
        
    def get_info(self):
        response = urllib2.urlopen(self.repository_url + 'commits?per_page=100&access_token=aac0cd41817f478ae3be7e6ba920c0385705b7e0')
        commits = []

        commits.extend(self.get_commit_from_response(response))

        link = self.get_next_link(response.info())
        while link != None:
            response = urllib2.urlopen(link)
            commits.extend(self.get_commit_from_response(response))
            link = self.get_next_link(response.info())

        return commits

    def get_next_link(self, response_info):
        link_header = response_info.getheader('Link')
        first_piece = link_header.split(',')[0]

        if 'rel="next"' in first_piece:
            link = first_piece.replace('>; rel="next"', '')
            link = link.replace('<','')
            return link
        else:
            return None 

    def get_commit_from_response(self, response):

        json_object = json.loads(response.read())

        commits = []

        for github_commit in json_object:
            commits.append(github_commit)

        return commits

    def get_address_for_user(self,user):
        response = urllib2.urlopen('https://api.github.com/users/{0}?access_token=aac0cd41817f478ae3be7e6ba920c0385705b7e0'.format(user))
        json_object = json.loads(response.read())
        
        if 'location' in json_object:
            return json_object['location']
        else:
            return None        