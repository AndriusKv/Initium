import { Component, Input } from "@angular/core";
import { DateService } from "Services/dateService";

@Component({
    selector: "time",
    template: `
        <div class="time" *ngIf="clock">
            <div class="clock-container">
                <div class="clock">{{ clock }}</div>
                <div class="marker" *ngIf="marker">{{ marker }}</div>
            </div>
            <div class="date" *ngIf="!dateDisabled">{{ date }}</div>
        </div>
    `
})
export class Time {
    @Input() setting;

    static get parameters() {
        return [[DateService]];
    }

    constructor(dateService) {
        this.dateService = dateService;
        this.dateDisabled = false;
        this.timeout = 0;
    }

    ngOnChanges(changes) {
        const setting = changes.setting.currentValue;

        if (setting) {
            if (setting.timeDisplay) {
                this.changeTimeDisplay(setting.timeDisplay);
            }
            if (typeof setting.dateDisabled === "boolean") {
                if (!setting.dateDisabled) {
                    this.date = this.dateService.getDate();
                }
                this.dateDisabled = setting.dateDisabled;
            }
        }
    }

    changeTimeDisplay(display) {
        clearTimeout(this.timeout);

        if (display === "0") {
            this.updateTime(this.get12HourTime);
        }
        else {
            this.marker = "";
            this.updateTime(this.get24HourTime);
        }
    }

    getCurrentTime() {
        const date = new Date();
        const minutes = date.getMinutes();

        return {
            hours: date.getHours(),
            minutes: minutes > 9 ? minutes : `0${minutes}`
        };
    }

    get12HourTime() {
        const time = this.getCurrentTime();
        let hours = time.hours;

        if (hours > 11) {
            this.marker = "PM";
            hours = hours > 13 ? hours - 12 : hours;
        }
        else {
            this.marker = "AM";
        }
        return `${hours}:${time.minutes}`;
    }

    get24HourTime() {
        const { hours, minutes } = this.getCurrentTime();

        return `${hours}:${minutes}`;
    }

    updateTime(cb) {
        this.clock = cb.call(this);

        this.timeout = setTimeout(() => {
            this.updateTime(cb);
        }, 1000);
    }
}
