/**
 * 根据经纬度计算距离 
 * @author Johnnian
 *
 */
export default class LocationUtils {

    private static EARTH_RADIUS: number = 6378.137;

    private static rad = (d: number): number => {
        return d * Math.PI / 180.0;
    }

    /** 
     * 通过经纬度获取距离(单位：米,公尺) 
     * @param lng1  原经度
     * @param lat1  原纬度
     * @param lat2  目的纬度
     * @param lng2  目的经度
     * @return 
     */
    public static getDistance(
        lng1: number, lat1: number,
        lng2: number, lat2: number): number {

        let radLat1 = LocationUtils.rad(lat1);
        let radLat2 = LocationUtils.rad(lat2);
        let a = radLat1 - radLat2;
        let b = LocationUtils.rad(lng1) - LocationUtils.rad(lng2);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
            + Math.cos(radLat1) * Math.cos(radLat2)
            * Math.pow(Math.sin(b / 2), 2)));
        s = s * LocationUtils.EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;        
        s = s * 1000;
        return s;
    }
}  