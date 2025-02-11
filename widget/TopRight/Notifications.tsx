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

        // Escuchar cuando se agrega una nueva notificación
        notifd.connect("notified", (_, id) => {
            this.set(id, Notification({
                notification: notifd.get_notification(id)!,
                onHoverLost: () => {
                    // No hacer nada al perder el hover
                },
                setup: () => {
                    // No establecer un timeout para eliminar la notificación
                }
            }));
        });

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