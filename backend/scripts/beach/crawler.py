import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

NOS_VALUE = 1.852

#used to evaluate the risk index
MAX_VALUES = {
  "wave_height": 10,
  "wave_period": 20,
  "wind_speed": 100,
  "water_depth": 20,
  "water_temperature": 30,
  "power": 20
}

def parse_coords(script_tag):
  script_tag = str(script_tag)
  sindex = script_tag.index("Dec2DMS(")
  eindex = script_tag.index(")", sindex)
  return script_tag[sindex+8:eindex].strip()

def parse_direction(src_tag):
  src_tag = str(src_tag)
  sindex = src_tag.rfind("_")
  eindex = src_tag.index(".gif", sindex)
  return src_tag[sindex+1:eindex].strip().upper()
  
class Beach:
  def __init__(self, beach_id=14):
    self.url = f"https://www.ipma.pt/pt/maritima/costeira/index.jsp?selLocal={beach_id}&idLocal={beach_id}"
    self.data = self.__get_beach_data__()

  def __get_beach_data__(self):
    req = requests.get(self.url)
    soup = BeautifulSoup(req.content, 'html.parser')

    beach_data = soup.find("div", attrs={"class":"marbottom10"})

    #metadata
    beach_name = beach_data.find("strong").text.strip()
    beach_lat = parse_coords(beach_data.find_all("em")[0])
    beach_lon = parse_coords(beach_data.find_all("em")[1])
    beach_alt = beach_data.find_all("em")[2].text.split()[0].strip()

    beach_metadata = {
      "name": beach_name,
      "lat": beach_lat,
      "lon": beach_lon, 
      "height": beach_alt
    }

    #get today date and the next 3 days
    dates = []
    for i in range(4):
      dates.append((datetime.now() + timedelta(days=i)).strftime("%d-%m-%Y"))

    predicted_data = soup.find_all("div", attrs={"class":"simpleTabsContent"})

    beach_states = []
    for i, day_data in enumerate(predicted_data):
      #get the data divided in chunks of hours
      hour_states = day_data\
        .find_all("tr")[1:]
        
      #handle first hour outside of table
      base_state = day_data.find_all("td")[0:11]
      hour_states.insert(0, None)      

      for hour_state in hour_states:
        hour_data = hour_state.find_all("td") if hour_state != None else base_state
        beach_states.append({
          "date": dates[i],
          "hour": hour_data[0].text.strip(),
          "water_depth": float(hour_data[1].text.strip()),
          "wave_height": float(hour_data[2].text.strip()),
          "wave_direction": parse_direction(hour_data[3].find("img")["src"]),
          "wave_period": float(hour_data[4].text.strip()),
          "max_wave_period": float(hour_data[5].text.strip()),
          "wind_speed": float(hour_data[6].text.strip()) * NOS_VALUE,
          "wind_direction": parse_direction(hour_data[7].find("img")["src"]),
          "beaufort_scale": int(hour_data[8].text.strip()),
          "water_temperature": float(hour_data[9].text.strip()),
          "power": float(hour_data[10].text.strip())          
        })

    return {
      "metadata": beach_metadata,
      "states": beach_states
    }

  #public getters
  def get_data(self):
    return self.data
  
  def get_states_by_day(self, day_offset=0):
    max_offset = min((day_offset+1)*24, len(self.data["states"]))
    return self.data["states"][day_offset*24:max_offset]
  
  def get_average(self, property, day_offset=0):
    states = self.get_states_by_day(day_offset)
    return sum([float(state[property]) for state in states])/len(states)
  
  def get_risk_index(self, day_offset=0):
    states = self.get_states_by_day(day_offset)

    average_wave_height = sum([float(state["wave_height"]) for state in states])/len(states)
    average_wave_period = sum([float(state["wave_period"]) for state in states])/len(states)
    average_wind_speed = sum([float(state["wind_speed"]) for state in states])/len(states)
    average_water_depth = sum([float(state["water_depth"]) for state in states])/len(states)
    average_water_temperature = sum([float(state["water_temperature"]) for state in states])/len(states)
    average_power = sum([float(state["power"]) for state in states])/len(states)

    risk_index = (0.3 * average_wave_height) + (0.3 * average_wave_period) + (0.25 * average_wind_speed) + (0.25 * average_water_depth) + (0.15 * average_water_temperature) + (0.1 * average_power)

    max_risk_index = (0.3 * MAX_VALUES["wave_height"]) + (0.3 * MAX_VALUES["wave_period"]) + (0.25 * MAX_VALUES["wind_speed"]) + (0.25 * MAX_VALUES["water_depth"]) + (0.15 * MAX_VALUES["water_temperature"]) + (0.1 * MAX_VALUES["power"])

    normalized_risk_index = (risk_index/max_risk_index) * 10
    return normalized_risk_index