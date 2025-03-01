import { Gtk, Widget } from "astal/gtk3";
import { bind } from "astal/binding";
import { WindowCornerStyle, Clipboard } from "../common/Variables";
import {
    WindowTopLeftCorner,
    WindowBottomLeftCorner,
    WindowTopRightCorner,
    WindowBottomRightCorner
} from "../common/Corners";
import { OnClickCloseTRButton } from "./BarButtons";
import { execAsync } from "astal/process";

export let firstButton: Widget.Button | null = null;

function ClipboardItem({ item, first }: { item: any, first?: boolean }) {
    return (
        <button            
            className="ClipboardItem"
            onClicked={() => {
                const cbItem = item.id.toString() + '\\t';
                const command = 'echo -e "' + cbItem + '" > decoded_item && cliphist decode < decoded_item > decoded_result && wl-copy < decoded_result && wtype -M ctrl v -m ctrl';
                execAsync(['bash', '-c', command]);
                OnClickCloseTRButton();
            }}
            onDraw={(self) => {
                //change this only works the first time the cb opens
                if (first && !firstButton) {
                    firstButton = self;
                    self.grab_focus();
                }
            }}
        >
            <label 
                className="item"
                wrap
                truncate
                xalign={0}
                label={item.content} 
            />
        </button>
    );
}

const ClearButton = () => {
    return (
        <button
            className="ClearClipboardButton"
            onClicked={() => {
                execAsync(["bash", "-c", "cliphist wipe"]);
                Clipboard.set("");
            }}
        >            
            <label 
                label={'Clear clipboard'} 
            />            
        </button>
    );
}

export default function () {    
    return (
        <box>
            <box className={bind(WindowCornerStyle)}>
                <WindowTopRightCorner />
            </box>
            <box className="Clipboard" vertical>
                <overlay>                    
                    <scrollable>
                        <box spacing={6} vertical>
                            {                                
                                bind(Clipboard).as(cb => {
                                    const items = cb.split('\n').map((line, index, array) => {                                        
                                        const [id, content] = line.split('\t');
                                        const item: { id: string, content: string } = { id, content };
                                        return <ClipboardItem item={item || ""} first={index === 0}/>;
                                    });

                                    return items;                                    
                                })
                            }
                        </box>
                    </scrollable>                    
                    <WindowTopLeftCorner />
                    <WindowTopRightCorner />
                    <WindowBottomLeftCorner />
                    <WindowBottomRightCorner />
                </overlay>
                <ClearButton />
            </box>
        </box>
    );
}