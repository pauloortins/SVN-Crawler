import pysvn
import datetime
import time
from commit import *

def get_svn_data(repository_url):
    client = pysvn.Client()    
    data = client.log(repository_url, limit=100)
    commits = parse_svn_data(data)
    return commits

def parse_svn_data(data):
    
    print "--- Parsing Data ---"

    commits = []

    for log in data:
        full_date = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(log.date)).strip()
        date = full_date.split(' ')[0]
        commit_time = full_date.split(' ')[1]
        author = 'undefined'
    
        if hasattr(log, 'author'):
            author = log.author

        commits.append(Commit(author, date, commit_time))

    commits.sort(key=lambda x:x.date)
    return commits