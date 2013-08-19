import urllib2
import json

def get_users_location():
    response = urllib2.urlopen('https://api.github.com/users?access_token=aac0cd41817f478ae3be7e6ba920c0385705b7e0')
    users = []

    users.extend(get_users_from_response(response))

    link = get_next_link(response.info())
    while link != None:
        response = urllib2.urlopen(link)
        users.extend(get_users_from_response(response))
        link = get_next_link(response.info())

    return users

def get_next_link(response_info):
    link_header = response_info.getheader('Link')
    first_piece = link_header.split(',')[0]

    if 'rel="next"' in first_piece:
        link = first_piece.replace('>; rel="next"', '')
        link = link.replace('<','')
        return link
    else:
        return None 

def get_users_from_response(response):

    json_object = json.loads(response.read())

    users = []

    for user in json_object:
        users.append(user["login"])
        print user["login"]

    return users

if __name__ == '__main__':
	get_users_location()