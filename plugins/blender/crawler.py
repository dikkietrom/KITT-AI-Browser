import requests
from bs4 import BeautifulSoup

def crawl(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the main content element
        main_content = soup.find('main', class_='document')
        
        if main_content:
            # Exclude the menu
            menu = main_content.find('nav', id='main-menu')
            if menu:
                menu.decompose()

            # Print the main window content
            print(main_content.get_text())
        else:
            print("Main content not found.")

url = 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/'

crawl(url)
