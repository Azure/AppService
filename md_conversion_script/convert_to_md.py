from markdownify import markdownify

import sys
import os
import shutil
import io
from distutils.dir_util import copy_tree
import pdb
import re
from bs4 import BeautifulSoup
import traceback

def copy_files(input_dir, output_dir):
    if [f for f in os.listdir(output_dir) if not f.startswith('.')]:
        raise Warning("Output directory is not empty! Stopping operation.")
    copy_tree(input_dir, output_dir)
    return None


def get_html_files(target_dir):
    """
    Returns the list of html files in the directory(because we also copy the images, JS, and CSS.)
    :param target_dir:
    :return: A list of the files
    """
    return [os.path.join(target_dir, f) for f in os.listdir(target_dir) if f.endswith(".html")]

def main(argv):
    input_dir = argv[0]
    output_dir = argv[1]
    try:
        windows_encoding = argv[2] is not None
    except IndexError:
        windows_encoding = False

    print("Input directory: " + input_dir)
    print("Output directory: " + output_dir)

    copy_files(input_dir, output_dir)
    print("Copied files to output directory.")

    files = get_html_files(output_dir)

    try:
        for f in files:
            print("Editing file: " + os.path.basename(f))
            with open(f, 'r', encoding='utf-8') as original:
                filedata = original.read()
                font_matter: str = re.search(pattern='---[\s\S]*---', string=filedata)[0]
                filedata = re.sub(pattern='---[\s\S]*---', repl="", string=filedata)

                soup = BeautifulSoup(filedata, "html.parser")
                author_name = getattr(soup.find(class_="profile-usercard-hover"), 'text', '')
                author_name = re.sub(pattern="\([a-zA-Z\s]*\)", repl="", string=author_name)
                author_name = "author_name: "+author_name

                title = os.path.basename(f).replace(".html", "").replace(".md", "")
                title = re.sub(pattern="\d*-\d*-\d*-", repl="", string=title)
                title = "title: "+"\""+title+"\""

                font_matter = font_matter[0:3]+"\n"+\
                            title+"\n"+\
                            author_name+\
                            font_matter[3:len(font_matter)]+\
                            "\n"
            with open(f, 'w', encoding='utf-8') as modified:
                converted_article = font_matter+markdownify(filedata, bullets='-', header='ATX')
                modified.write(converted_article)
            newname = f.replace('.html', '.md')
            output = os.rename(f, newname)
            
    except Exception as e:
        print(e)
        print('Batch process failed. Deleting the contents of the output directory.')
        for filename in os.listdir(output_dir):
            filepath = os.path.join(output_dir, filename)
            try:
                shutil.rmtree(filepath)
            except OSError:
                os.remove(filepath)

    print('Done.')
    exit()


if __name__ == "__main__":
    main(sys.argv[1:])