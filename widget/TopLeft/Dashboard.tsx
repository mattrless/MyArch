import { Gtk, astalify } from "astal/gtk3";
import Apps from "gi://AstalApps";
import { speeds } from './NetSpeed'
import { WindowTopLeftCorner } from "../common/Corners";
import { bind } from "astal/binding"
import { OnClickCloseButton } from "./BarWidgets";
import { exec } from "astal/process";
import {
        HomePath,
        PicturesPath,
        UserHostname,
        UpTime,
        NetIp,
        NetType,
        UsedRam,
        TotalRam,
        UsedCpu,
        UsedDisk,
        SaveButtonVisible,
        WindowCornerStyle
    } from "../common/Variables";
import MprisPlayers from './Player'

const {START, CENTER,  END} = Gtk.Align;
const buffer = new Gtk.TextBuffer();
buffer.set_text("", 0);

function OnClickNetworkButton(){
    const apps = new Apps.Apps();
    apps.fuzzy_query('nm-connection-editor')[0].launch();
    OnClickCloseButton();
}

function OnClickSaveNoteButton(){
    SaveButtonVisible.set(false);
    try {
        let start: Gtk.TextIter = buffer.get_start_iter();
        let text: string = buffer.get_text(start, buffer.get_end_iter(), true);

        if(text){            
            const out = exec(HomePath.get() + '/.config/ags/scripts/quick_note.sh ' + '"' + text + '"')
            
            if(out.startsWith("Note saved at"))
                clearNote();

            start = buffer.get_start_iter();
            buffer.insert(start, "\n\n\n\n\t" + out, -1);
            
            if (out.startsWith("Note saved at")) {
                setTimeout(() => {
                    clearNote();
                    SaveButtonVisible.set(true);
                }, 5000);//5s
            }
        } else {
            buffer.insert(start, "\n\n\n\n\t\t" + "Nothing to save.", -1);
            setTimeout(() => {
                clearNote();
                SaveButtonVisible.set(true);
            }, 3000);//3s
        }
    } catch (err) {
        console.error(err)
    }
}

function clearNote(){
    buffer.set_text("", 0);
}

const Whoami = () => {
    return (
        <box className="WhoamiBox">
            <box
                className="ProfileImage"
                css={`background-image: url('${PicturesPath.get()}/wallpapers/profile/profile.jpg')`}
            />
            <box className="Divider"/>
            <box className="UserInfo" vertical>
                <label label={bind(UserHostname)} halign={START} />
                <label label={bind(UpTime).as(v => "up for " + v.toString())} halign={START} />
            </box>
        </box>
    );
}

const NetInfo = () => {
    return (
        <button className="NetInfoButton" onClicked={OnClickNetworkButton} cursor="pointer">
            <centerbox>
                <box className="IpSpeed" vertical >
                    <label className="Ip" label={bind(NetIp)} />
                    <label className="NetSpeed" label={bind(speeds)} />
                </box>
                <box className="NetInfoDivider" />
                <box className="NetTypeIcon" homogeneous={true}>
                    <label label={bind(NetType)}/>
                </box>            
            </centerbox>
        </button>
    );
}

const SysInfo = () => {
    return(
        <centerbox className="SysUsage">
            
            <box className="RamUsage" halign={START}>
                {/* Didn't use the default circularprogress child because it renders a weird line*/}
                <overlay>
                    <circularprogress 
                        value={bind(UsedRam).as(used => used / TotalRam.get())} 
                        startAt={0.25} 
                        endAt={1.25} 
                        rounded
                    />
                    <label label="󰍛" />
                </overlay>
            </box>

            <box className="CpuUsage" halign={CENTER}>
                <overlay>
                    <circularprogress 
                        value={bind(UsedCpu)} 
                        startAt={0.25} 
                        endAt={1.25} 
                        rounded
                    />
                    <label label="" />
                </overlay>
            </box>

            <box className="DiskUsage" halign={END}>
                <overlay>
                    <circularprogress 
                        value={bind(UsedDisk)} 
                        startAt={0.25}
                        endAt={1.25}
                        rounded
                    />
                    <label label="󰋊" />
                </overlay>
            </box>
    
        </centerbox>
    );
}

const AudioPlayer = () => { 
    return <box className='AudioPlayerContainer'>
        <MprisPlayers />
    </box>
}
const QuickNote = () => {
    const TextView = astalify(Gtk.TextView);

    return(
        <box className="QuickNote" vertical>
            <box className="Title" homogeneous>
                <button
                    visible={bind(SaveButtonVisible)}
                    className="ClearSave"
                    label={""}
                    halign={START}
                    onClick={clearNote}
                />
                <label className="QNLabel" label="Quick Note" halign={CENTER}/>
                <button
                    visible={bind(SaveButtonVisible)}
                    className="ClearSave"
                    label={"󱣫"}
                    halign={END}
                    onClick={OnClickSaveNoteButton}
                />
            </box>
            <box className="Content" vertical>
                <scrollable>
                    <TextView
                        wrapMode={Gtk.WrapMode.CHAR}
                        buffer={buffer}
                        editable={true}
                        cursor_visible={true}
                        sensitive={true}
                        focus_on_click={true}                        
                    />
                </scrollable>
            </box>
        </box>
    );
}

export default function () {
    return (
        <box>
            <box className="Dashboard" vertical={true} hexpand={false}>
                <Whoami />                
                <SysInfo />
                <AudioPlayer />
                <NetInfo />
                <QuickNote />
            </box>
            <box className={bind(WindowCornerStyle)}>
                <WindowTopLeftCorner />
            </box>
        </box>
    );
}