import axios from 'axios';

import { LogicalError } from '../Error';


const mapSeason: Map<string, number> = new Map([
    ["spring", 1],
    ["summer", 4],
    ["fall", 7],
    ["winter", 10]
]);


class ReservedInfo {
    strId: string;
    dateStart: Date | null = null;
    dateEnd: Date | null = null;
    activity: any;

    constructor(strId: string, activity: any){
        this.strId = strId;
        this.activity = activity;
    }

    static compare(reservedInfo1: ReservedInfo, reservedInfo2: ReservedInfo){
        if (reservedInfo1.dateStart === reservedInfo2.dateStart)
            return 0;
        if ((reservedInfo1.dateStart === null) && (reservedInfo2.dateStart !== null))
            return -1;
        if ((reservedInfo1.dateStart !== null) && (reservedInfo2.dateStart === null))
            return 1;
        if (reservedInfo1.dateStart! < reservedInfo2.dateStart!)
            return -1;
    
        return 1;
    }

    setTime(strStartDate: string, strEndDate: string){
        this.dateStart = (strStartDate === '')? null : new Date(strStartDate);
        this.dateEnd = (strEndDate === '')? null : new Date(strEndDate);
    }
    clearTime(){
        this.dateStart = null;
        this.dateEnd = null;
    }

    pack(){
        return {
            strId: this.strId,
            strStartDate: (this.dateStart === null)? "" : this.dateStart.toJSON().split(".")[0],
            strEndDate: (this.dateEnd === null)? "" : this.dateEnd.toJSON().split(".")[0]
        }
    }
}

export default class Activity {
    private static strUrl: string = "https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json";
    private static strKeyReservedIds = "reservedId"
    private static boolLoading = false;
    private static boolLoaded = false;

    private static arrReservedInfos: Array<ReservedInfo> = [];
    private static arrActivity: Array<any> = [];


    static async load() {
        if (Activity.isLoaded() || Activity.isLoading()) return;
        Activity.boolLoading = true;

        await axios.get(Activity.strUrl).then((response)=>{
            Activity.arrActivity = response.data;
            Activity.readFromLocalStorage();
            Activity.boolLoaded = true;
            Activity.boolLoading = false;
        });
    }
    static isLoading(){
        return Activity.boolLoading;
    }
    static isLoaded(){
        return Activity.boolLoaded;
    }

    private static packInfo(){
        let arrPackedReservedInfo: Array<any> = [];
        Activity.arrReservedInfos.forEach(reservedInfo => {
            arrPackedReservedInfo.push(reservedInfo.pack());
        })
        return arrPackedReservedInfo;
    }
    private static unpackInfo(arrPackedReservedInfo: Array<any>){
        Activity.arrReservedInfos = [];

        arrPackedReservedInfo.forEach(info => {
            let reservedInfo = new ReservedInfo(info.strId, Activity.get(info.strId));
            reservedInfo.setTime(info.strStartDate, info.strEndDate);
            Activity.arrReservedInfos.push(reservedInfo);
        })
    }
    private static readFromLocalStorage(){
        let strReservedIds = localStorage.getItem(Activity.strKeyReservedIds);
        if (strReservedIds != null) Activity.unpackInfo(JSON.parse(strReservedIds));
    }
    private static storeToLocalStorage(){
        localStorage.setItem(Activity.strKeyReservedIds, JSON.stringify(Activity.packInfo()));
    }

    static get(strId: string, isStrict: boolean = true){
        let intIndex: number = Activity.getIndex(strId);

        if ((isStrict) && (intIndex === -1)) throw new LogicalError("Activity- 此活動並未在清單中 (id: " + strId + ")");
        return (intIndex === -1)? null : Activity.arrActivity[intIndex];
    }
    private static getIndex(strId: string){
        for (let intIndex = 0; intIndex < Activity.arrActivity.length; intIndex++){
            if (Activity.arrActivity[intIndex].UID == strId) return intIndex;
        }
        return -1;
    }
    private static getIndexForReserved(strId: string){
        for (let intIndex = 0; intIndex < Activity.arrReservedInfos.length; intIndex++){
            if (Activity.arrReservedInfos[intIndex].strId == strId) return intIndex;
        }
        return -1;
    }

    static getAll(){
        return Activity.arrActivity;
    }
    static getReserved(){
        return Activity.arrReservedInfos;
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
        for (let intIndex = 0; intIndex < Activity.arrReservedInfos.length; intIndex++){
            if (Activity.arrReservedInfos[intIndex].strId === strId) return true;
        }
        return false;
    }
    static reserve(strId: string){
        if (Activity.isReserved(strId)) throw new LogicalError("Activity- 已預約過活動無法在預約 (id: " + strId + ")");
        
        Activity.arrReservedInfos.push(new ReservedInfo(strId, Activity.get(strId)));

        Activity.storeToLocalStorage();
        Activity.sort();
    }
    static cancel(strId: string){
        if (!Activity.isReserved(strId)) throw new LogicalError("Activity- 此活動尚未預約 (id: " + strId + ")");

        Activity.arrReservedInfos.splice(Activity.getIndexForReserved(strId), 1);

        Activity.storeToLocalStorage();
        Activity.sort();
    }
    static clear(){
        Activity.arrReservedInfos = [];
    }
    static setTime(strId: string, strStartDate: string, strEndDate: string){
        if (!Activity.isReserved(strId)) throw new LogicalError("Activity- 此活動尚未預約 (id: " + strId + ")");

        Activity.arrReservedInfos[Activity.getIndexForReserved(strId)].setTime(strStartDate, strEndDate);

        Activity.storeToLocalStorage();
        Activity.sort();
    }
    static clearTime(){
        Activity.arrReservedInfos.forEach(reservedInfo => {
            reservedInfo.clearTime();
        })
    }
    private static sort(){
        Activity.arrReservedInfos.sort(ReservedInfo.compare);
    }
}