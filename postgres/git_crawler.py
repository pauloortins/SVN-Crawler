import urllib2
import json

def get_next_link(response_info):
	link_header = response_info.getheader('Link')
	first_piece = link_header.split(',')[0]

	if 'rel="next"' in first_piece:
		link = first_piece.replace('>; rel="next"', '')
		link = link.replace('<','')
		return link
	else:
		return None

def print_commit_from_response(response):

	json_object = json.loads(response.read())

	for github_commit in json_object:
		author_login = ''
		if 'author' in github_commit and github_commit['author'] != None:
			author_login = github_commit['author']['login']
		
		committer_login = ''
		if 'committer' in github_commit and github_commit['committer'] != None:
			committer_login = github_commit['committer']['login']

		commit = {
			'author_name': github_commit['commit']['author']['name'], 
			'commiter_name': github_commit['commit']['committer']['name'],
			'message': github_commit['commit']['message'],
			'author_date': github_commit['commit']['author']['date'],
			'commit_date': github_commit['commit']['committer']['date'],
			'author_login': author_login,
			'committer_login': committer_login
		}
		print commit

if (__name__ == '__main__'):
	response = urllib2.urlopen('https://api.github.com/repos/postgres/postgres/commits?per_page=100&access_token=aac0cd41817f478ae3be7e6ba920c0385705b7e0')
	print_commit_from_response(response)

	link = get_next_link(response.info())
	contador = 1
	while link != None:
		response = urllib2.urlopen(link)
		print_commit_from_response(response)
		link = get_next_link(response.info())
		contador = contador + 1