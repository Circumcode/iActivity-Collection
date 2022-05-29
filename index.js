class data {
	UID;
	title;
	showInfo;
	showUnit;
	descriptionFilterHtml;
	imageUrl;
	masterUnit;
	sourceWebPromote;
	startDate;
	endDate;
}
class showInfo {
	city;
	area;
	latitude;
	longitude;
	time;
	location;
	locationName;
	onSales;
	price;
	endTime;
	isIndoor;
}

let strJson = `
{
    "Id": "C2_315080000H_080702",
    "Name": "2022高雄燈會藝術節",
    "Description": "在愛河高雄橋至七賢橋兩岸周邊場域熱鬧舉辦，用「雙春閏月、贏金抱喜、迎向國際、愛與幸福」打造每一場主題活動；各式燈區將呈現出高雄西岸的海港風情、東側的山林雅致、迎新曙（鼠）光、人文薈萃，呈現出全面向，專屬於高雄的城市軌跡；期間還有精彩的主題之夜：「開幕秀之夜」、「高空秀之夜」、「踩舞秀之夜」、「馬戲秀之夜」、「亂打秀之夜」、「歌仔戲之夜」、「歌舞秀之夜」和「夜光秀之夜」，精心邀請了適合好友、情侶、全家大小一起觀賞的國內、外知名演出，邀請全國民眾新年走春來高雄，創造回味一整年的精采回憶。※2022年高雄燈會藝術節相關活動以「台灣燈會」為主。",
    "Participation": "",
    "Location": "高雄市",
    "Add": "愛河兩岸（高雄橋至七賢橋）",
    "Region": "高雄市",
    "Town": "鹽埕區",
    "Tel": "",
    "Org": "高雄市政府觀光局",
    "Start": "2022-02-01T00:00:00+08:00",
    "End": "2022-02-28T00:00:00+08:00",
    "Cycle": "2022年暫停辦理",
    "Noncycle": "",
    "Website": "",
    "Picture1": "https://www.taiwan.net.tw/att/event/cf23ca49-5cc5-47c8-800d-59108d369fd5.jpg",
    "Picdescribe1": "愛河水舞",
    "Picture2": "https://www.taiwan.net.tw/att/event/16fe5549-16ea-479c-b6d8-dc918b2cf7e3.jpg",
    "Picdescribe2": "法國白馬夜光秀",
    "Picture3": "https://www.taiwan.net.tw/att/event/4093f32d-e0d1-4955-baae-c7a19c943e8b.jpg",
    "Picdescribe3": "法國Gueule de´ours大白熊夜光踩街秀",
    "Px": 120.290117,
    "Py": 22.620658,
    "Class1": "01",
    "Class2": "02",
    "Map": "",
    "Travellinginfo": "",
    "Parkinginfo": "",
    "Charge": "",
    "Remarks": ""
  }
  `;
let json = JSON.parse(strJson);

let result = new data();
let reShowInfo = new showInfo();
result.UID = json.Id;
result.title = json.Name;

reShowInfo.city = json.Region;
reShowInfo.area = json.Town;
reShowInfo.latitude = json.Py;
reShowInfo.longitude = json.Px;
reShowInfo.time = json.Start.replace('T', " ").replace("+08:00", "");
reShowInfo.location = json.Location + json.Add;
reShowInfo.locationName = json.Add;
reShowInfo.onSales = '';
reShowInfo.price = '';
reShowInfo.endTime = json.End.replace('T', " ").replace("+08:00", "");
reShowInfo.isIndoor = '';

result.showInfo = [reShowInfo];
result.showUnit = json.Org;
result.descriptionFilterHtml = json.Description;
result.imageUrl = json.Picture1;
result.masterUnit = [json.Org];
result.sourceWebPromote = json.Website;
result.startDate = json.Start.substring(0, json.Start.indexOf('T'));
result.endDate = json.End.substring(0, json.Start.indexOf('T'));

console.log(JSON.stringify(result));