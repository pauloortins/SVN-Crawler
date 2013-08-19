import datetime

class Commit(object):

    def __init__(self, author, date, time):
        self.author = author
        self.date = date
        self.time = time        
        self.lat = -1
        self.lng = -1
        self.value = 1

        year = int(date.split('-')[0])
        month = int(date.split('-')[1])
        day = int(date.split('-')[2])

        self.weekday = datetime.date(year, month, day).weekday()