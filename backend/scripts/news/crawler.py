import requests
from bs4 import BeautifulSoup


URL = "https://www.jn.pt/tag/costa-da-caparica.html"

def get_feed():
  res = requests.get(URL)

  soup = BeautifulSoup(res.text, "html.parser")

  articles = soup.find_all("article")

  parsed_articles = []
  for article in articles:
    article_path = article.find("a")["href"]
    link = f"https://www.jn.pt{article_path}"
    img_tag = article.find("img")
    
    img = ""
    if img_tag:
      img = img_tag["data-src"]
    
    local = article.find("h3").find("span").text
    title = article.find("h2").find("a").text

    #try to get description
    h4 = article.find("h4")
    description = ""
    if h4:
      description = h4.find("a").text
    
    parsed_articles.append({
      "title": title,
      "local": local,
      "description": description,
      "img": img,
      "link": link
    })

  return parsed_articles
