f = open('github_locations.txt')

for line in f:
	if not '-1|-1' in line:
		print line.replace('\n', '')