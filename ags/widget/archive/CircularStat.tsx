import { Gtk, Astal, Gdk } from 'astal/gtk3';
import Cairo from 'cairo';
import { bind } from "astal/binding"

interface CircularStatProps {
    currentValue: number;
    maxValue: number;
}

export const CircularStat = ({
    currentValue,
    maxValue 
}:CircularStatProps) => {

    return (
        <drawingarea
            className="CircularStat"
            setup={(widget) => {

                widget.set_size_request(100, 100);

                const styleContext = widget.get_style_context();
                widget.connect('draw', (_, cairoContext: Cairo.Context) => {
                    const width = widget.get_allocated_width();
                    const height = widget.get_allocated_height();
                    const radius = Math.min(width, height) / 2 - 10;
                    const centerX = width / 2;
                    const centerY = height / 2;

                    const bgColor = styleContext.get_background_color(Gtk.StateFlags.NORMAL);
                    const accentColor = styleContext.get_color(Gtk.StateFlags.NORMAL);

                    const fullCircle = 2 * Math.PI;

                    let currentAngle = (currentValue / maxValue) * fullCircle;

                    cairoContext.setSourceRGBA(bgColor.red, bgColor.green, bgColor.blue, bgColor.alpha);
                    cairoContext.arc(centerX, centerY, radius, 0, 2 * Math.PI)
                    cairoContext.setLineWidth(14)
                    cairoContext.stroke()

                    
                    cairoContext.setSourceRGBA(accentColor.red, accentColor.green, accentColor.blue, accentColor.alpha); 
                    cairoContext.arc(centerX, centerY, radius, Math.PI / 2, Math.PI / 2 + currentAngle);
                    cairoContext.setLineWidth(14)
                    cairoContext.stroke()
                });
            }}
        />
    );
};

/*
    doc to set bind https://aylur.github.io/astal/guide/typescript/faq#custom-widgets-with-bindable-properties
    <CircularStat currentValue={Number(bind(UsedRam).as(v => v))} maxValue={TotalRam.get()}/>
    
    .CircularStat {
        background-color: $widget_bg_color;
        color: $accent_color;
    }   
*/
