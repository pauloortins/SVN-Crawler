"""Software History Viewer

Usage:
  generate_commits_data.py <name> (svn|git|github) <repository_url> [--location=<locations_url>]
  generate_commits_data.py (-h | --help)

Arguments
  svn - If you are mining a svn repository
  git - If you are mining a git repository
  github - If you are mining a github repository
  repository_url - The repository url
  locations_url - The file with the committers location

Options:
  -h --help     Show this screen.

"""

from docopt import docopt
from svn_retriever import *
from github_retriever import *
import datetime
import time
import json
from datetime import date
from commit import *
import os
import shutil

def link_locations(commits, locations):
    
    print "--- Linking Locations ---"

    locations_map = {}

    for location in locations:
        attrs = location.split('|')
        author = attrs[0].strip()
        lat = attrs[-2].strip()
        lng = attrs[-1].strip()
        locations_map[author] = {
            'author': author,
            'lat' : float(lat),
            'lng' : float(lng)
        }

    for commit in commits:
        if commit.author in locations_map:
            commit.lat = locations_map[commit.author]["lat"]
            commit.lng = locations_map[commit.author]["lng"]

    return commits

def generate_json(commits):
    
    print "--- Generating JSON ---"    

    commits_str = map(lambda x:object_to_json(x), commits)
    result = ',\n'.join(commits_str)


    return result

def object_to_json(commit):

    json = '{' + \
           '"author": "' + commit.author + '", ' + \
           '"value": ' + str(commit.value) + ', ' + \
           '"lat": ' + str(commit.lat) + ', ' + \
           '"lng": ' + str(commit.lng) + ', ' + \
           '"date": "' + commit.date + '", ' + \
           '"time": "' + commit.time + '", ' + \
           '"weekday": ' + str(commit.weekday) + '}'

    json = json.replace('\n','').replace('\t','')

    return json

def create_js_file(json, software_name):

    print "--- Creating js file ---"

    template = open("../templates/template.js")
    output = open("../output/" + software_name +"/js/commits.js", 'w')

    for line in template:
        if "#JSON_COMMITS" in line:
            line = line.replace("#JSON_COMMITS", json)

        output.write(line)

def generate_output(software_name,json_result):

    software_path = os.path.join('../output/' + software_name)    

    copy_webapp(software_path)
    create_js_file(json_result, software_name)

def copy_webapp(software_path):
    if (os.path.exists(software_path)):
         shutil.rmtree(software_path)
    
    shutil.copytree("../webapp", software_path)

if __name__ == "__main__":

    print "--- Downloading Data ---"

    arguments = docopt(__doc__, version='Software History Viewer')

    repository_url = arguments['<repository_url>']
    locations_url = arguments['--location']
    software_name = arguments['<name>']

    if arguments['svn']:
      commits = get_svn_data(repository_url)
      if (locations_url != None):       
        locations = open(locations_url)
        commits_with_location = link_locations(commits, locations)
        json_result = generate_json(commits_with_location)
      else:
        json_result = generate_json(commits)
        
    elif arguments['github']:
      commits = get_github_data(repository_url)
      locations = get_github_locations(commits)
      commits_with_location = link_locations(commits, locations)
      json_result = generate_json(commits_with_location)  
    
    generate_output(software_name,json_result)
    