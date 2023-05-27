#!/bin/bash

echo "Creating the directory if it doesn't already exist..."
mkdir -p plugins/blender/docs

echo "Creating a Python script..."
cat << EOF > parse.py
from bs4 import BeautifulSoup
import requests
import os

url = 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/'

print(f"Sending a GET request to {url}")
response = requests.get(url)

soup = BeautifulSoup(response.text, 'html.parser')

print("Searching for chapters marked by 'h1' tags...")
chapters = soup.find_all('h1')

for chapter in chapters:
    filename = 'plugins/blender/docs/' + chapter.get_text().replace(' ', '_') + '.txt'
    print(f"Creating file: {filename}")
    
    text = [p.get_text() for p in chapter.find_next_siblings('p')]
    print(f"Extracted text: {text}")
    
    with open(filename, 'w') as f:
        f.write('\n'.join(text))
    
    if os.path.isfile(filename):
        print(f"File '{filename}' has been created successfully.")
    else:
        print(f"Failed to create the file '{filename}'.")
EOF

echo "Executing the Python script..."
python3 parse.py
