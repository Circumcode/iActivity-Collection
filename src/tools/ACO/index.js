import ACO from './ACO'
import LocationUtils from './LocationUtils'

import pubsub from 'pubsub-js'
import { FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES } from '../../components/ActivityMap'

const TYPE_AVG_ONE_METER_NEED_MINUTE = new Map()
// 開車 分速為1111.111 公尺/分鐘 m/min
TYPE_AVG_ONE_METER_NEED_MINUTE.set(0, 0.0009)
// 小機車 分速為769.231 公尺/分鐘 m/min
TYPE_AVG_ONE_METER_NEED_MINUTE.set(1, 0.0013)
// 走路 分速為50.000 公尺/分鐘 m/min
TYPE_AVG_ONE_METER_NEED_MINUTE.set(2, 0.02)

let aco

export const getACOCalculateState = ()=>{
    if(aco) return aco.getState()
    return aco
}

const calculateRouter = (reservedActivity, transportType = 0 // 0:car, 1:scooter, 2:walk
) => {
    // console.log("@", reservedActivity)

    let cityList = reservedActivity.map(item =>
        (item && item.UID && item.latitude && item.longitude) ?
            [item.latitude, item.longitude, item] :
            undefined
    )
    cityList = cityList.filter(item => item)

    const findStartIndex = (startId, cityList) => {
        for (let i = 0; i < cityList.length; i++) {
            if (cityList[i][2].UID === startId) return i
        }
        return -1;
    }

    const getEstimatedTimeInMinutes = (meter, transportType) => {
        const oneMeterNeedMinute = TYPE_AVG_ONE_METER_NEED_MINUTE.get(transportType);
        return meter * oneMeterNeedMinute
    }

    let resultRoute = []
    aco = new ACO(cityList)
    aco.done = () => {
        let bestRoute = aco.getBestRoute()
        let startIndex = findStartIndex(cityList[0][2].UID, bestRoute)

        if (startIndex !== -1) {
            for (let i = startIndex; i < bestRoute.length - 1; i++) {
                // const item = {
                //     UID: bestRoute[i][2],
                //     latitude: Number.parseFloat(bestRoute[i][0]),
                //     longitude: Number.parseFloat(bestRoute[i][1])
                // }
                // resultRoute.push(item)
                resultRoute.push(bestRoute[i][2])
            }
            for (let i = 0; i <= startIndex; i++) {
                if (i === startIndex) {
                    resultRoute.push(resultRoute[0])
                } else {
                    // const item = {
                    //     UID: bestRoute[i][2],
                    //     latitude: Number.parseFloat(bestRoute[i][0]),
                    //     longitude: Number.parseFloat(bestRoute[i][1])
                    // }
                    // resultRoute.push(item)
                    resultRoute.push(bestRoute[i][2])
                }
            }
            for (let i = 1; i < resultRoute.length; i++) {
                // console.log("@2",resultRoute)
                let prev = resultRoute[i - 1];
                let curr = resultRoute[i];
                const distance = LocationUtils.getDistance(prev.longitude, prev.latitude, curr.longitude, curr.latitude)
                curr.stationData = {}
                curr.stationData.distanceToThisStationNeedMeter = distance
                curr.stationData.distanceOfKilometer = Math.floor(distance / 1000)
                curr.stationData.distanceOfMeter = Math.floor(distance % 1000)
                let estimatedTimeInMinutes = getEstimatedTimeInMinutes(distance, transportType)
                curr.stationData.estimatedTimeInMinutes = estimatedTimeInMinutes
                curr.stationData.estimatedDays = Math.floor(estimatedTimeInMinutes / 60 / 24)
                curr.stationData.estimatedHours = Math.floor(estimatedTimeInMinutes / 60 % 24)
                curr.stationData.estimatedMinute = Math.floor(estimatedTimeInMinutes % 60)
                curr.stationData.station = i;
            }
        }
        console.log("@3", resultRoute)
        pubsub.publish(FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES, resultRoute)
    }
    aco.start()
}

export default calculateRouter