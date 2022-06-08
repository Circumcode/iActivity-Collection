export interface ACOStation {
    UID: String,
    distanceOfKilometer?: number
    distanceOfMeter?: number
    distanceToThisStationNeedMeter?: number
    estimatedDays?: number
    estimatedHours?:number
    estimatedMinute?: number
    estimatedTimeInMinutes?: number
    latitude: number
    longitude: number
    station?: number
}