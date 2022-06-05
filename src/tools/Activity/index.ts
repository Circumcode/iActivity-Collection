import axios from 'axios';

import { LogicalError } from '../Error';


const mapSeason: Map<string, number> = new Map([
    ["spring", 1],
    ["summer", 4],
    ["fall", 7],
    ["winter", 10]
]);


export class ReservedInfo {
    private strId: string;
    private dateStart: Date | null = null;
    private dateEnd: Date | null = null;
    private stationData: any = null;
    activity: any;

    constructor(strId: string, activity: any)
    constructor(strId: string, activity: any, strStartTime: string, strEndTime: string)
    constructor(strId: string, activity: any, strStartTime: string, strEndTime: string, stationData: any)
    constructor(strId: string, activity: any, strStartTime: string = "", strEndTime: string = "", stationData?: any){
        this.strId = strId;
        this.activity = activity;
        this.dateStart = (strStartTime === '')? null : new Date(strStartTime);
        this.dateEnd = (strEndTime === '')? null : new Date(strEndTime);
        this.stationData = stationData ?? null;
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

    getId(){
        return this.strId;
    }

    isHavingStationData(){
        return this.stationData !== null;
    }
    clearStationData(){
        this.stationData = null;
    }
    getStationData(){
        return this.stationData;
    }

    clearTime(){
        this.dateStart = null;
        this.dateEnd = null;

        Activity.storeToLocalStorage();
    }
    private getFormatTime(date: Date){
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    getStartDate(){
        return this.dateStart;
    }
    getStartTime(){
        return (this.dateStart === null)? "" : this.getFormatTime(this.dateStart);
    }
    getEndTime(){
        return (this.dateEnd === null)? "" : this.getFormatTime(this.dateEnd);
    }
    setTime(strStartDate: string, strEndDate: string){
        this.setStartTime(strStartDate);
        this.setEndTime(strEndDate);
    }
    setStartTime(strStartTime: string){
        this.dateStart = (strStartTime === '')? null : new Date(strStartTime);

        Activity.sort();
        Activity.storeToLocalStorage();
    }
    setEndTime(strEndTime: string){
        this.dateEnd = (strEndTime === '')? null : new Date(strEndTime);

        Activity.storeToLocalStorage();
    }

    pack(){
        return {
            strId: this.strId,
            strStartDate: this.getStartTime(),
            strEndDate: this.getEndTime(),
            strStationData: JSON.stringify(this.stationData)
        }
    }
}

export default class Activity {
    private static strUrl: string = "https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json";
    private static strKeyReservedIds = "reservedId"
    private static boolLoading = false;
    private static boolLoaded = false;
    private static boolLoadingFailure = false;

    private static arrReservedInfos: Array<ReservedInfo> = [];
    private static arrActivity: Array<any> = [];

    private static intUpdatedDataNumber: number = 0;


    static async load() {
        if (Activity.isLoaded() || Activity.isLoading()) return;
        Activity.boolLoading = true;
        Activity.boolLoaded = false;
        Activity.boolLoadingFailure = false;

        await axios.get(Activity.strUrl)
            .then((response)=>{
                Activity.arrActivity = response.data;
                Activity.readFromLocalStorage();
                Activity.boolLoaded = true;
                Activity.boolLoading = false;
            })
            .catch((error) => {
                Activity.boolLoadingFailure = true;
            })
    }
    static isLoading(){
        return Activity.boolLoading;
    }
    static isLoaded(){
        return Activity.boolLoaded;
    }
    static isFailed(){
        return Activity.boolLoadingFailure;
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
            let reservedInfo = new ReservedInfo(info.strId, Activity.get(info.strId), info.strStartDate, info.strEndDate, JSON.parse(info.strStationData));
            Activity.arrReservedInfos.push(reservedInfo);
        })
    }
    private static readFromLocalStorage(){
        let strReservedIds = localStorage.getItem(Activity.strKeyReservedIds);
        if (strReservedIds != null) Activity.unpackInfo(JSON.parse(strReservedIds));
    }
    static storeToLocalStorage(){
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
            if (Activity.arrReservedInfos[intIndex].getId() == strId) return intIndex;
        }
        return -1;
    }

    static getAll(){
        return Activity.arrActivity;
    }
    static getReserved(){
        return Activity.arrReservedInfos;
    }
    static getReservedQuantity(){
        return this.arrReservedInfos.length;
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
            if (Activity.arrReservedInfos[intIndex].getId() === strId) return true;
        }
        return false;
    }
    static reserve(strId: string){
        if (Activity.isReserved(strId)) throw new LogicalError("Activity- 已預約過活動無法在預約 (id: " + strId + ")");
        
        Activity.arrReservedInfos.push(new ReservedInfo(strId, Activity.get(strId)));

        Activity.sort();
        Activity.storeToLocalStorage();
    }
    static cancel(strId: string){
        if (!Activity.isReserved(strId)) throw new LogicalError("Activity- 此活動尚未預約 (id: " + strId + ")");

        Activity.arrReservedInfos.splice(Activity.getIndexForReserved(strId), 1);

        Activity.sort();
        Activity.storeToLocalStorage();
    }
    static clear(){
        Activity.arrReservedInfos = [];

        Activity.storeToLocalStorage();
    }
    static setTime(strId: string, strStartDate: string, strEndDate: string){
        if (!Activity.isReserved(strId)) throw new LogicalError("Activity- 此活動尚未預約 (id: " + strId + ")");

        Activity.arrReservedInfos[Activity.getIndexForReserved(strId)].setTime(strStartDate, strEndDate);

        Activity.sort();
        Activity.storeToLocalStorage();
    }
    static clearTime(){
        Activity.arrReservedInfos.forEach(reservedInfo => {
            reservedInfo.clearTime();
        })
    }
    static clearStationData(){
        Activity.arrReservedInfos.forEach(reservedInfo => {
            reservedInfo.clearStationData();
        })
    }
    static sort(){
        Activity.arrReservedInfos.sort(ReservedInfo.compare);
    }
    static update(arrActivitys: Array<any>){
        this.intUpdatedDataNumber = arrActivitys.length;
        Activity.clearTime();

        arrActivitys.forEach(activity => {
            Activity.cancel(activity.UID);
        })
        for (let intIndex = (arrActivitys.length - 1); intIndex >= 0; intIndex--){
            Activity.arrReservedInfos.unshift(new ReservedInfo(arrActivitys[intIndex].UID, Activity.get(arrActivitys[intIndex].UID), "", "", arrActivitys[intIndex].stationData));
        }

        Activity.storeToLocalStorage();
    }

    static getUpdatedDataNumber(){
        return this.intUpdatedDataNumber;
    }
}
