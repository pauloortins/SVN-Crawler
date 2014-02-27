commits = open('commits_1995_2005.txt')

authors_with_locations = open('authors_with_location_1995_2005.txt')

author_list = map(lambda x: x.replace('\n', ''), authors_with_locations)

for commit in commits:
	commit_author = commit.split('-')[-1].strip()
	if commit_author in author_list:
		print commit.replace('\n', '')