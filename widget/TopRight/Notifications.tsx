import { Gtk } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "../notifications/Notification";
import { type Subscribable } from "astal/binding";
import { Variable } from "astal";

export class PersistentNotificationMap implements Subscribable {
    // El mapa para almacenar las notificaciones
    private map: Map<number, Gtk.Widget> = new Map();

    // Variable para manejar la reactividad
    private var: Variable<Array<Gtk.Widget>> = Variable([]);

    // Notificar a los suscriptores cuando cambie el estado
    private notify() {
        this.var.set([...this.map.values()].reverse());
    }

    constructor() {
        const notifd = Notifd.get_default();

        notifd.connect("notified", (_, id) => {
            const dismiss = () => this.delete(id)

            this.set(id, Notification({
                notification: notifd.get_notification(id)!,

                // once hovering over the notification is done
                // destroy the widget without calling notification.dismiss()
                // so that it acts as a "popup" and we can still display it
                // in a notification center like widget
                // but clicking on the close button will close it
                onHoverLost: () => {
                    //this.delete(id)
                },

                // notifd by default does not close notifications
                // until user input or the timeout specified by sender
                // which we set to ignore above
                setup: () => {

                },
                //onClose: () => this.hide(id)
                onDismiss: dismiss // Pasar el callback
            }))
        })

        // Escuchar cuando se resuelve una notificación (por ejemplo, cuando el usuario la cierra)
        notifd.connect("resolved", (_, id) => {
            this.delete(id);
        });
    }

    // Agregar o actualizar una notificación en el mapa
    private set(key: number, value: Gtk.Widget) {
        this.map.get(key)?.destroy(); // Destruir el widget anterior si existe
        this.map.set(key, value);
        this.notify();
    }

    // Eliminar una notificación del mapa
    private delete(key: number) {
        this.map.get(key)?.destroy(); // Destruir el widget asociado
        this.map.delete(key);
        this.notify();
    }

    // Obtener la lista actual de notificaciones
    get() {
        return this.var.get();
    }

    clearAll() {
        this.map.forEach((widget) => {
            widget.destroy();  // Destruye el widget
        });
        this.map.clear();  // Limpia el mapa
        this.notify();  // Notifica a los suscriptores para actualizar la vista
    }

    // Suscribirse a cambios en la lista de notificaciones
    subscribe(callback: (list: Array<Gtk.Widget>) => void) {
        return this.var.subscribe(callback);
    }
}