import { Gtk, astalify } from "astal/gtk3";
import { WindowTopRightCorner } from "../common/Corners";
import { bind } from "astal/binding";
import { WindowCornerStyle, FullDate, DayOfWeek, SilenceNotificationsLabel, DoNotDisturb } from "../common/Variables";
import { PersistentNotificationMap } from "./Notifications";

const {START, CENTER,  END} = Gtk.Align;
const notifs = new PersistentNotificationMap();

function SilenceNotifications() {
    SilenceNotificationsLabel.set(SilenceNotificationsLabel.get() == "" ? "" : "")
    DoNotDisturb.set(DoNotDisturb.get() ? false : true);
}

function ClearNotifications() {
    notifs.clearAll();
}

const Date = () => {
    return (
        <box className="Date" vertical>
            <box>
                <label className="DayOfWeek" label={bind(DayOfWeek)}/>
            </box>
            <box>
                <label className="FullDate" label={bind(FullDate)} />
            </box>
        </box>
    );
}

const Calendar = () => {
    const MyCalendar = astalify(Gtk.Calendar);
    return (
        <box className="CalendarContainer" vertical>
            <box className="Border" homogeneous>
                {/* can set a class, causes error but works */}
                <MyCalendar /> 
            </box>
        </box>
    );
}

const Notifications = () => {    

    return (
        <box className="NotificationsContainer" vertical>
            <box className="Title" homogeneous>
                <button
                    className="NotDisturbClear"
                    label={bind(SilenceNotificationsLabel)}
                    halign={START}
                    onClick={SilenceNotifications}
                />
                <label className="NCLabel" label="Notifications" halign={CENTER}/>
                <button
                    className="NotDisturbClear"
                    label={"󰎟"}
                    halign={END}
                    onClick={ClearNotifications}
                />
            </box>
            <box className="Content" vertical>
                <scrollable>
                    <box vertical noImplicitDestroy>
                        {bind(notifs)}
                    </box>
                </scrollable>
            </box>
        </box>
    );
}

export default function () {
    return (
        <box>
            <box className={bind(WindowCornerStyle)}>
                <WindowTopRightCorner />                
            </box>
            <box className="NotificationCenter" vertical={true} hexpand={false}>
                <Date />
                <Calendar />
                <Notifications />
            </box>
        </box>
    );
}