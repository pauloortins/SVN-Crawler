import pysvn
import datetime
import time

client = pysvn.Client()

log_messages = client.log('http://svn.apache.org/repos/asf/httpd/')

for log in log_messages:
	date = log.date
	author = 'undefined'
	
	if hasattr(log, 'author'):
		author = log.author

	print (log.revision.number, author, date, log.message)

