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


const calculateRouter = (reservedActivity, transportType = 0 // 0:car, 1:scooter, 2:walk
) => {
    let cityList = reservedActivity.map(item =>
        (item && item.UID && item.latitude && item.longitude) ?
            [item.latitude, item.longitude, item.UID] :
            undefined
    )
    cityList = cityList.filter(item => item)
    
    const findStartIndex = (startId, cityList) => {
        for (let i = 0; i < cityList.length; i++) {
            if (cityList[i][2] === startId) return i
        }
        return -1;
    }

    const getEstimatedTimeInMinutes = (meter, transportType) => {
        const oneMeterNeedMinute = TYPE_AVG_ONE_METER_NEED_MINUTE.get(transportType);
        return meter * oneMeterNeedMinute
    }

    let resultRoute = []
    const aco = new ACO(cityList)
    aco.done = () => {
        let bestRoute = aco.getBestRoute()
        let startIndex = findStartIndex(cityList[0][2], bestRoute)

        if (startIndex !== -1) {
            for (let i = startIndex; i < bestRoute.length - 1; i++) {
                const item = {
                    UID: bestRoute[i][2],
                    latitude: Number.parseFloat(bestRoute[i][0]),
                    longitude: Number.parseFloat(bestRoute[i][1])
                }
                resultRoute.push(item)
            }
            for (let i = 0; i <= startIndex; i++) {
                if (i === startIndex) {
                    resultRoute.push(resultRoute[0])
                } else {
                    const item = {
                        UID: bestRoute[i][2],
                        latitude: Number.parseFloat(bestRoute[i][0]),
                        longitude: Number.parseFloat(bestRoute[i][1])
                    }
                    resultRoute.push(item)
                }
            }
            for (let i = 1; i < resultRoute.length; i++) {
                let prev = resultRoute[i - 1];
                let curr = resultRoute[i];
                const distance = LocationUtils.getDistance(prev.longitude, prev.latitude, curr.longitude, curr.latitude)
                curr.distanceToThisStationNeedMeter = distance
                curr.distanceOfKilometer = Math.floor(distance / 1000)
                curr.distanceOfMeter = Math.floor(distance % 1000)
                let estimatedTimeInMinutes = getEstimatedTimeInMinutes(distance, transportType)
                curr.estimatedTimeInMinutes = estimatedTimeInMinutes
                curr.estimatedDays = Math.floor(estimatedTimeInMinutes / 60 / 24)
                curr.estimatedHours = Math.floor(estimatedTimeInMinutes / 60 % 24)
                curr.estimatedMinute = Math.floor(estimatedTimeInMinutes % 60)
                curr.station = i;
            }
        }
        pubsub.publish(FUNCTION_CALLER_KEY_DRAW_ROUTER_LINES, resultRoute)
    }
    aco.start()
}

export default calculateRouter