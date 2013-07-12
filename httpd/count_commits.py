import operator

f = open('httpd_all_time_commits.txt')

commitMap = {}

for line in f:
	revision = eval(line)
	author = revision[1]
	if (author in commitMap):
		commitMap[author] = commitMap[author] + 1
	else:
		commitMap[author] = 1

sorted_dict = sorted(commitMap.iteritems(), key=operator.itemgetter(1), reverse=True)

for key in sorted_dict:
	print "{0} - {1}".format(key[0], key[1])