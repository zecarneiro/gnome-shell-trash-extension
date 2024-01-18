const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;
const GObject = imports.gi.GObject;
const ICON_CFG = { style_class: "popup-menu-icon" };

var TrashMenuItem = GObject.registerClass(
  class TrashMenuItem extends PopupMenu.PopupBaseMenuItem {
    _init(text, icon_name, gicon, callback) {
      super._init(0.0, text);
      if (icon_name != null) {
        ICON_CFG.icon_name = icon_name;
      } else if (gicon != null) {
        ICON_CFG.gicon = gicon;
      }

      this.icon = new St.Icon(ICON_CFG);
      this.actor.add_child(this.icon);
      this.label = new St.Label({ text: text });
      this.actor.add_child(this.label);

      this.connect("activate", callback);
    }

    destroy() {
      super.destroy();
    }
  }
);
