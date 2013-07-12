f = open('commits.txt')

users = []
for line in f:
	users.append(eval(line))

unique_users = set()
for user in users:
	unique_users.add(user['committer_login'])

for user in unique_users:
	print user