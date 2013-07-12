from collections import defaultdict

f = open('commits_httpd.txt')

commits = [x.replace('\n','') for x in f]
commits.reverse();

res = defaultdict(list)

for commit in commits: 
	obj = eval(commit)	
	key = obj['date'] + '-' + obj['name']
	res[key].append(commit)

new_commits = []
for k, v in res.items():
	obj = eval(v[0])

	new_commits.append({
			'date': obj['date'],
			'name': obj['name'],
			'lat': obj['lat'],
			'lng': obj['lng'],
			'value': len(v),
			'commitMessage': obj['commit_message'],
			'commitNumber': obj['commit_number']
		})

new_commits.sort(key=lambda x:x['date'])

for commit in new_commits:
	print '{0},'.format(commit)