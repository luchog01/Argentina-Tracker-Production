from requests_html import HTMLSession
s = HTMLSession()
response = s.get("https://www.puentenet.com/cotizaciones/acciones/")
response.html.render()

print(response.text)