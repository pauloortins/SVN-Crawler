import time

f = open('commits_httpd.txt')

for line in f:
	revision = eval(line)
	date = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(revision[2]))
	print (revision[0], revision[1], date, revision[3])
