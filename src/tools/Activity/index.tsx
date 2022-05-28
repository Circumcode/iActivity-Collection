import axios from 'axios';


const mapSeason: Map<string, number> = new Map([
    ["spring", 1],
    ["summer", 4],
    ["fall", 7],
    ["winter", 10]
]);

export default class Activity {
    private static strUrl: string = "https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json";
    private static isLoading = false;
    private static isLoaded = false;

    private static arrActivityReserved: Array<any> = [];
    private static arrActivity: Array<any> = [];


    static async load() {
        if (!Activity.isLoaded && !Activity.isLoading)
            await axios.get(Activity.strUrl).then((response)=>{
                Activity.arrActivityReserved = [];
                Activity.arrActivity = response.data;
                Activity.isLoading = false;
                Activity.isLoaded = true;


                // Start Test Data =====================================
                Activity.reserve("5b3dd544aaa378d7ca9a2e9a");
                Activity.reserve("5c7e1bcdaaa375d860933d3a");
                Activity.reserve("5e5ffbf8d083a329401eed57");
                Activity.reserve("5efb8db9d083a33abc1ac109");
                // End Test Data =======================================
            });
        
        Activity.isLoading = true;
    }
    static isLoad(){
        return Activity.isLoaded;
    }

    static get(strId: string){
        let intIndex: number = Activity.getIndex(strId);
        return (intIndex === -1)? null : Activity.arrActivity[intIndex];
    }
    private static getIndex(strId: string){
        for (let intIndex = 0; intIndex < Activity.arrActivity.length; intIndex++){
            if (Activity.arrActivity[intIndex].UID == strId) return intIndex;
        }
        return -1;
    }

    static getAll(){
        return Activity.arrActivity;
    }
    static getReserved(){
        return Activity.arrActivityReserved;
    }

    static getBySeason(intYear: number, strSeason: "spring" | "summer" | "fall" | "winter"){
        let intSeasonMonth: number = mapSeason.get(strSeason)!;
        let dateSeasonStart: Date = new Date(intYear + "/" + intSeasonMonth + "/1");
        let dateSeasonEnd: Date = new Date(intYear + "/" + (intSeasonMonth + 3) + "/1");

        let arrActivitySeason: Array<any> = [];
        Activity.arrActivity.forEach(activity => {
            let dateActivityStart = new Date(activity.startDate);
            let dateActivityEnd = new Date(activity.endDate);
            if (!( (dateActivityStart > dateSeasonEnd) || (dateActivityEnd < dateSeasonStart) )) arrActivitySeason.push(activity);
        })
        return arrActivitySeason;
    }

    static isReserved(strId: string){
        for (let intIndex = 0; intIndex < Activity.arrActivityReserved.length; intIndex++){
            if (Activity.arrActivityReserved[intIndex].UID === strId) return true;
        }
        return false;
    }
    static reserve(strId: string){
        Activity.arrActivityReserved.push(Activity.get(strId));
    }
    static cancel(strId: string){
        let intIndex: number = Activity.getIndex(strId);
        if (intIndex !== -1) Activity.arrActivityReserved.splice(intIndex, 1);
    }
}