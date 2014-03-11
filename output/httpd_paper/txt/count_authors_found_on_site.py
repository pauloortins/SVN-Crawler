author_site = open('authors_site.txt')

authors_with_locations = open('authors_and_locations.txt')

author_list = map(lambda x: x.split('|')[2].strip().replace('\n', ''), authors_with_locations)

for author in author_site:		
	if author.replace("\n","").strip() in author_list:
		print author.replace("\n","")