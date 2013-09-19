import pysvn
import datetime
import time
from commit import *
from retriever import *

class SvnRetriever(Retriever):

    def __init__(self, svn_service, locations_retriever):
        self.svn_service = svn_service
        self.locations_retriever = locations_retriever

    def get_commits(self):
        data = self.svn_service.get_info()
        commits = self.parse_svn_data(data)
        commits = self.link_commits_to_locations(commits, self.locations_retriever.get_locations())
        
        return commits

    def parse_svn_data(self, data):
        
        print "--- Parsing Data ---"

        commits = []

        for log in data:
            full_date = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(log.date)).strip()
            date = full_date.split(' ')[0]
            commit_time = full_date.split(' ')[1]
            author = 'undefined'
        
            if hasattr(log, 'author'):
                author = log.author

            changed_paths = []
            for change in log.changed_paths:
                changed_paths.append(change['path'])

            commits.append(Commit(author, date, commit_time, changed_paths))

        commits.sort(key=lambda x:x.date)
        return commits