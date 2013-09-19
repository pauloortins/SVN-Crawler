import datetime

class Commit(object):

    def __init__(self, author, date, time, changed_paths):
        self.author = author
        self.lat = -1
        self.lng = -1
        self.value = 1
        self.timeoffset = 0
        self.changed_paths = changed_paths

        year = int(date.split('-')[0])
        month = int(date.split('-')[1])
        day = int(date.split('-')[2])

        hour = int(time.split(':')[0])
        minute = int(time.split(':')[1])
        second = int(time.split(':')[2])

        self.date = datetime.datetime(year, month, day, hour, minute, second)