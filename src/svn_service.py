import pysvn

class SvnService(object):
    """docstring for SvnService"""
    def __init__(self, repository_url):
        self.repository_url = repository_url

    def get_info(self):
        client = pysvn.Client()    
        data = client.log(self.repository_url, discover_changed_paths=True)
        return data

     