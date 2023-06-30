export default class time {
    static conventionalToSeconds(hour, min, second) {
        return hour * 3600 + min * 60 + second;
    }
    static secondsToConventional(second) {
        let hour = 0;
        let min = 0;
        if(second > 3600) {
            hour = Math.floor(second / 3600);
            second -= hour * 3600;
        }
        if(second > 60) {
            min = Math.floor(second / 60);
            second -= min * 60;
        }
        return {
            hour: hour,
            minute: min,
            second: second,
        }
    }
    static add(time1, time2) {
        return this.conventionalToSeconds(time1.hour, time1.minute, time1.second) + this.conventionalToSeconds(time2.hour, time2.minute, time2.second);
    }
    static subtract(time1, time2) {
        return this.conventionalToSeconds(time1.hour, time1.minute, time1.second) - this.conventionalToSeconds(time2.hour, time2.minute, time2.second);
    }
}
