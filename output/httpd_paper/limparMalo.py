file = open("emailsFilesTESTE.txt")

for commit in file:
	print commit.replace("'malo'", "'nd'").replace("\n", '')