import os

def generate_index_html(directory='.'):
    file_list = os.listdir(directory)
    with open('index.html', 'w') as f:
        f.write('<html>\n')
        f.write('<head>\n')
        f.write('<meta charset="UTF-8">\n')
        f.write('</head>\n')
        f.write('<body>\n')
        f.write('<h1>ECNmoins</h1>\n')
        f.write('<ul>\n')
        for file_name in file_list:
            if os.path.isfile(file_name) and file_name.endswith('.html') and file_name!='index.html':
                f.write('<li><a href="{}">{}</a></li>\n'.format(file_name, file_name[:-5]))
        f.write('</ul>\n')
        f.write('</body>\n')
        f.write('</html>\n')

generate_index_html()

