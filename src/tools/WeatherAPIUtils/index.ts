import axios from "axios";

const API_KEY = "CWB-9D1F8318-1E3B-4A1D-BE21-87435E79CDA7"
const BASE_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/";
const CITY_ID_1WEEK_MAP = new Map()

CITY_ID_1WEEK_MAP.set("宜蘭縣", "F-D0047-003")
CITY_ID_1WEEK_MAP.set("桃園市", "F-D0047-007")
CITY_ID_1WEEK_MAP.set("新竹縣", "F-D0047-011")
CITY_ID_1WEEK_MAP.set("苗栗縣", "F-D0047-015")
CITY_ID_1WEEK_MAP.set("彰化縣", "F-D0047-019")
CITY_ID_1WEEK_MAP.set("南投縣", "F-D0047-023")
CITY_ID_1WEEK_MAP.set("雲林縣", "F-D0047-027")
CITY_ID_1WEEK_MAP.set("嘉義縣", "F-D0047-031")
CITY_ID_1WEEK_MAP.set("屏東縣", "F-D0047-035")
CITY_ID_1WEEK_MAP.set("臺東縣", "F-D0047-039")
CITY_ID_1WEEK_MAP.set("花蓮縣", "F-D0047-043")
CITY_ID_1WEEK_MAP.set("澎湖縣", "F-D0047-047")
CITY_ID_1WEEK_MAP.set("基隆市", "F-D0047-051")
CITY_ID_1WEEK_MAP.set("新竹市", "F-D0047-055")
CITY_ID_1WEEK_MAP.set("嘉義市", "F-D0047-059")
CITY_ID_1WEEK_MAP.set("臺北市", "F-D0047-063")
CITY_ID_1WEEK_MAP.set("高雄市", "F-D0047-067")
CITY_ID_1WEEK_MAP.set("新北市", "F-D0047-071")
CITY_ID_1WEEK_MAP.set("臺中市", "F-D0047-075")
CITY_ID_1WEEK_MAP.set("臺南市", "F-D0047-079")
CITY_ID_1WEEK_MAP.set("連江縣", "F-D0047-083")
CITY_ID_1WEEK_MAP.set("金門縣", "F-D0047-087")


// https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-067?Authorization=CWB-9D1F8318-1E3B-4A1D-BE21-87435E79CDA7&format=JSON&locationName=燕巢區&elementName=PoP12h,Wx,WeatherDescription
export default class WeatherAPIUtils {

    static getByLocation = async (strCity: String, strArea: String) => {
        const requestURL = `${BASE_URL + CITY_ID_1WEEK_MAP.get(strCity)}?Authorization=${API_KEY}&format=JSON&locationName=${strArea}&elementName=PoP12h,Wx,WeatherDescription`
        const response = await axios.get(requestURL)
        let locationData = []
        if (response) {
            const element = response.data.records.locations[0].location[0].weatherElement;
            for (let i = 0; i < element[0].time.length; i++) {
                const item = {
                    startTime: element[0].time[i].startTime,
                    endTime: element[0].time[i].endTime,
                    values:{
                        PoP12h:  element[0].time[i].elementValue[0].value,
                        Wx: element[1].time[i].elementValue[0].value,
                        WeatherDescription: element[2].time[i].elementValue[0].value
                    }
                }
                locationData.push(item)
            }
        }
        return locationData;
    }
}

