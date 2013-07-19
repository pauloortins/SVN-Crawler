from collections import defaultdict

f = open('emails/emails.txt')

commits = [x.replace('\n','').replace('\t','') for x in f]
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
			'lat': obj['lat'].strip(),
			'lng': obj['lng'].strip(),
			'value': len(v),			
			'commitNumber': obj['commitNumber']
		})

new_commits.sort(key=lambda x:x['date'])

for commit in new_commits:
	print '{0},'.format(commit)