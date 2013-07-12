commit_locations = open('count_commits.txt')

locations = {}

for commit in commit_locations:
	attrs = commit.split('|')
	name = attrs[0].strip()
	lat = attrs[-2].strip()
	lng = attrs[-1].strip()
	locations[name] = {
		'name': name,
		'lat' : lat,
		'lng' : lng
	}

commits = open('httpd_all_time_commits.txt')
commits = [ x for x in commits]

sorted(commits, key= lambda x: eval(x)[2])

for commit in commits:
	commit_tuple = eval(commit)
	commit_number = commit_tuple[0]
	name = commit_tuple[1].replace("'",'').strip()
	date = commit_tuple[2].strip()
	commit_message = commit_tuple[3].strip()

	if name in locations:
		lat = locations[name]['lat']
		lng = locations[name]['lng']
		
		commit_final = {
			'name':name,
			'date':date.split(' ')[0],
			'lat': lat,
			'lng': lng,
			'commit_message': commit_message,
			'commit_number': commit_number
		}

		print commit_final


