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
from svn_service import *
from locations_retriever import *
from github_service import *
from googlemaps_service import *
from output_generator import *

if __name__ == "__main__":
    
    arguments = docopt(__doc__, version='Software History Viewer')

    repository_url = arguments['<repository_url>']
    locations_url = arguments['--location']
    software_name = arguments['<name>']

    if arguments['svn']:
      retriever = SvnRetriever(SvnService(repository_url), LocationRetriever(locations_url))
    elif arguments['github']:
      retriever = GithubRetriever(GithubService(repository_url), LocationRetriever('locations/github_locations.txt'), GoogleMapsService())  
    
    print "--- Downloading Commits ---"
    commits = retriever.get_commits()

    print "--- Generating Output ---"
    OutputGenerator(software_name).generate_output(commits)    
    