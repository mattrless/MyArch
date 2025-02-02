import { Astal } from "astal/gtk3"
import { Variable } from "astal";
import Apps from "gi://AstalApps";
import { subprocess, exec, execAsync } from "astal/process";
import GTop from "gi://GTop";

const { EXCLUSIVE, NORMAL } = Astal.Exclusivity
const { TOP, BOTTOM } = Astal.Layer
const {ON_DEMAND, NONE} = Astal.Keymode

export const TopLeftWindowVisible = Variable(false);
export const DashboardVisible = Variable(false);
export const AppLauncherVisible = Variable(false);
export const TopLeftCurrentWindow = Variable("Default");
export const StyleLabel = Variable("󰖯");
export const TopBarStyle = Variable("TransparentSpacer");
export const WindowCornerStyle = Variable("TransparentSpacerCorner");

/* AppLauncher */
export const AppNameText = Variable("")
export const FirstApp = Variable<Apps.Application | null>(null);
export const Keymode = Variable(NONE);

/* Dashboard */
export const HomePath = Variable("/home/matterless");
export const PicturesPath = Variable("/home/matterless/Pictures");
export const UserHostname = Variable("");
execAsync(["bash", "-c", 'echo "$USER@$HOSTNAME"'])
    .then((out) => {
        UserHostname.set(out);
    })
    .catch((err) => {
        UserHostname.set(err);
    })

export const UpTime = Variable("00m").poll(20_000, "uptime",
    (out, _) => {
        let regex = out.match(/(\d+:\d+),/)
        if (regex) {
            let match = regex[1]
            let hour = match.slice(0, match.indexOf(':'))
            let min = match.slice(match.indexOf(':') + 1).padStart(2, '0')

            return `${hour} hours, ${min} minutes`

        } else {
            regex = out.match(/up \d+/)
            let match = regex![0]
            let min = match.slice(3).padStart(2, '0')

            return `${min} minutes`
        }
    }
);

export const NetIp = Variable("").poll(20000,
    "nmcli -t -f IP4.ADDRESS device show",
    (out) => {
        const firstResult = out
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.startsWith("IP4.ADDRESS"))[0];

        if (firstResult) {
            const ip = firstResult.split(":")[1];
            return ip;
        }

        return "No IP found";
    }
);

export const NetType = Variable("").poll(20000,
    "nmcli -t -f GENERAL.TYPE device show",
    (out) => {
        const firstType = out
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.startsWith("GENERAL.TYPE"))[0];

        if (firstType) {
            let type = firstType.split(":")[1].toString();
            if(type == 'ethernet'){
                type = '';
            }
            return type;
        }

        return "Unknown";
    }
);

/* Dashboard/RamUsage */
const mem = new GTop.glibtop_mem();

GTop.glibtop_get_mem(mem);

export const UsedRam = Variable<number>(0);
UsedRam.poll(1000, () => {
    GTop.glibtop_get_mem(mem);
    return (mem.used - mem.cached) / (1024 * 1024 * 1024);
});

export const TotalRam = Variable(mem.total / (1024 * 1024 * 1024));

/* Dashboard/CpuUsage */
const cpu = new GTop.glibtop_cpu();

let lastUsedCpu = 0;
let lastTotalCpu = 0;
let usedCpu = 0;
let totalCpu = 0;
let diffUsed = 0;
let diffTotal = 0;
let load = 0;

export const UsedCpu = Variable<number>(0);

GTop.glibtop_get_cpu(cpu);

UsedCpu.poll(1000, () => {
    GTop.glibtop_get_cpu(cpu);

    usedCpu = cpu.user + cpu.sys + cpu.nice + cpu.irq + cpu.softirq;
    totalCpu = usedCpu + cpu.idle + cpu.iowait;

    diffUsed = usedCpu - lastUsedCpu;
    diffTotal = totalCpu - lastTotalCpu;

    load = diffTotal > 0 ? (diffUsed / diffTotal) : 0;

    lastUsedCpu = usedCpu;
    lastTotalCpu = totalCpu;
    return load ;
});

/* Dashboard/DiskUsage */
const disk = new GTop.glibtop_fsusage();

export const UsedDisk = Variable<number>(0);

GTop.glibtop_get_fsusage(disk, '/');

let totalSpace = 0;
let freeSpace = 0;
let usedSpace = 0;

UsedDisk.poll(2000, () => {
    totalSpace = disk.blocks * disk.block_size;
    freeSpace = disk.bfree * disk.block_size;
    usedSpace = totalSpace - freeSpace; 
    
    return (usedSpace / totalSpace);
});
/* Dashboard/QuickNote */
export const SaveButtonVisible = Variable(true);


// Center Widgets
export const TopCenterWindowVisible = Variable(false);
export const TopCenterWindowKeymode = Variable(NONE);