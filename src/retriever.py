class Retriever(object):
    """docstring for Retriever"""
    def link_commits_to_locations(self, commits, locations_map):   

        for commit in commits:
            if commit.author in locations_map:
                commit.lat = locations_map[commit.author]["lat"]
                commit.lng = locations_map[commit.author]["lng"]

        return commits
        