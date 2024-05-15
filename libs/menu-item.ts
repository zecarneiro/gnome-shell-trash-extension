import GObject from "gi://GObject";
import St from "gi://St";
import Gio from "gi://Gio";
import { PopupBaseMenuItem } from "resource:///org/gnome/shell/ui/popupMenu.js";

export default class MenuItem extends PopupBaseMenuItem {
  static {
    GObject.registerClass(this);
  }
  private readonly STYLE_CLASS = "popup-menu-icon";
  private icon: St.Icon;
  private menuLabel: St.Label;
  constructor(
    text: string,
    iconName: string,
    gicon: Gio.Icon | null,
    callback: () => any
  ) {
    super();
    if (iconName != null) {
      this.icon = new St.Icon({
        icon_name: iconName,
        style_class: this.STYLE_CLASS,
      });
    } else if (gicon != null) {
      this.icon = new St.Icon({
        gicon: gicon,
        style_class: this.STYLE_CLASS,
      });
    } else {
      this.icon = new St.Icon({
        style_class: this.STYLE_CLASS,
      });
    }

    this.add_child(this.icon);
    this.menuLabel = new St.Label({ text: text });
    this.add_child(this.menuLabel);

    this.connect("activate", callback);
  }

  destroy(): void {
    super.destroy();
  }
}
