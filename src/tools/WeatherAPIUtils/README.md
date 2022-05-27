# Weather API Utile
### 根據位址獲取 天氣往後12小時天氣預測資訊
```javascript
WeatherAPIUtils.getLocation("高雄市", "燕巢區")
.then((data)=>{
  console.log(data)
  /* Output
  data = [
      0: {
          startTime: "2022-05-27 18:00:00",
          endTime: "2022-05-28 06:00:00",
          values: {
              PoP12h: "30",                   // 降雨機率
              Wx: "陰時多雲短暫陣雨或雷雨",     // 天氣狀況
              WeatherDescription: "陰時多雲短暫陣雨或雷雨。降雨機率 30%。溫度攝氏25至28度。舒適至悶熱。偏南風 風速2級(每秒2公尺)。相對濕度92%。" // 天氣敘述
          }
      }
      .....
  ] 
  */
})
```