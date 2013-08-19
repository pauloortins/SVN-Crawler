import shutil
import os

class OutputGenerator(object):
    """docstring for OutputGenerator"""
    def __init__(self, software_name):
        self.software_name = software_name
    
    def generate_output(self, commits):
        json_result = self.generate_json(commits)
        self.generate_files(json_result)

    def generate_json(self, commits):

        commits_str = map(lambda x:self.object_to_json(x), commits)
        result = ',\n'.join(commits_str)

        return result

    def object_to_json(self,commit):

        json = '{' + \
               '"author": "' + commit.author + '", ' + \
               '"value": ' + str(commit.value) + ', ' + \
               '"lat": ' + str(commit.lat) + ', ' + \
               '"lng": ' + str(commit.lng) + ', ' + \
               '"date": "' + commit.date + '", ' + \
               '"time": "' + commit.time + '", ' + \
               '"weekday": ' + str(commit.weekday) + '}'

        json = json.replace('\n','').replace('\t','')

        return json

    def generate_files(self, json_result):

        software_path = os.path.join('../output/' + self.software_name)    

        self.copy_webapp(software_path)
        self.create_js_file(json_result)

    def copy_webapp(self, software_path):
        if (os.path.exists(software_path)):
             shutil.rmtree(software_path)
    
        shutil.copytree("../webapp", software_path)

    def create_js_file(self, json):

        print "--- Creating js file ---"

        template = open("../templates/template.js")
        output = open("../output/" + self.software_name +"/js/commits.js", 'w')

        for line in template:
            if "#JSON_COMMITS" in line:
                line = line.replace("#JSON_COMMITS", json)

            output.write(line)