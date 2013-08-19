import datetime
import time
from commit import *
import urllib2
import json

def get_github_data(repository_url):
    data = get_commits(repository_url)
    commits = parse_github_data(data)
    return commits

def get_commits(repository_url):
    response = urllib2.urlopen(repository_url + 'commits?per_page=100&access_token=aac0cd41817f478ae3be7e6ba920c0385705b7e0')
    commits = []

    commits.extend(get_commit_from_response(response))

    link = get_next_link(response.info())
    while link != None:
        response = urllib2.urlopen(link)
        commits.extend(get_commit_from_response(response))
        link = get_next_link(response.info())

    return commits

def get_next_link(response_info):
    link_header = response_info.getheader('Link')
    first_piece = link_header.split(',')[0]

    if 'rel="next"' in first_piece:
        link = first_piece.replace('>; rel="next"', '')
        link = link.replace('<','')
        return link
    else:
        return None 

def get_commit_from_response(response):

    json_object = json.loads(response.read())

    commits = []

    for github_commit in json_object:
        commits.append(github_commit)

    return commits

def parse_github_data(data):
    
    print "--- Parsing Data ---"

    commits = []

    for commit in data:
        
        if commit['author'] != None:
            author = commit['author']['login']
            date = commit['commit']['author']['date'].split('T')[0]
            time = commit['commit']['author']['date'].split('T')[1].split('-')[0]

            commits.append(Commit(author,date,time))

    commits.sort(key=lambda x:x.date)
    return commits

def get_github_locations(commits):
    existing_locations = open("github_locations.txt",'r+')

    hash_locations = {}

    for line in existing_locations:
        attrs = line.split('|')
        name = attrs[0].strip()
        lat = attrs[-2].strip()
        lng = attrs[-1].strip()
        hash_locations[name] = {
            'name': name,
            'lat' : lat,
            'lng' : lng
        }

    committers = get_committers_from_commits(commits)

    for committer in committers:
        if (not committer in hash_locations):
            lat, lng = get_committer_geolocation(committer)
            existing_locations.write('{0}|{1}|{2}\n'.format(committer,lat,lng))

    return open("github_locations.txt")

def get_committers_from_commits(commits):
    authors = map(lambda x: x.author, commits)
    unique_authors = list(set(authors))
    unique_authors.sort()

    return unique_authors 

def get_committer_geolocation(committer):
    response = urllib2.urlopen('https://api.github.com/users/' + committer)
    json_object = json.loads(response.read())
    print json_object
    if 'location' in json_object:
        lat,lng = get_coordinates_from_location(json_object['location'])
    else:
        lat = -1
        lng = -1

    return (lat, lng)

def get_coordinates_from_location(location):
    location = location.replace(' ', '+')
    url = 'http://maps.googleapis.com/maps/api/geocode/json?address={0}&sensor=false'.format(location)
    response = urllib2.urlopen(url)
    json_object = json.loads(response.read())
    lat = json_object['results'][0]['geometry']['location']['lat']
    lng = json_object['results'][0]['geometry']['location']['lng']
    return lat,lng