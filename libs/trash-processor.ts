import Gio from "gi://Gio";
import St from "gi://St";
import MenuItem from "./menu-item.js";
import ConfirmDialog from "./confirm-dialog.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import GObject from "gi://GObject";
import Clutter from "gi://Clutter";
const TRASH_PATH = "trash:///";

// If this fails, see workaround in https://bugs.archlinux.org/task/62860
const TRASH = Gio.file_new_for_uri(TRASH_PATH);
1;

export default class TrashProcessor extends PanelMenu.Button {
  static {
    GObject.registerClass(this);
  }
  private readonly ICON_FULL = {
    icon_name: "user-trash-full-symbolic",
    style_class: "popup-menu-icon",
  };
  private readonly ICON_EMPTY = {
    icon_name: "user-trash-symbolic",

    style_class: "popup-menu-icon",
  };

  private monitor: Gio.FileMonitor;
  private currentIcon: any;
  private trashIcon: St.Icon | null;
  private emptyItem: MenuItem | undefined;
  private openItem: MenuItem | undefined;

  constructor(appName: string) {
    super(0.5, appName);
    this.currentIcon = null;
    this.trashIcon = null;

    this.monitor = TRASH.monitor_directory(0, null);

    this.setIcon();
    this.menu.actor.reactive = false;
    this.menu.actor.can_focus = false;
    this.menu.actor.track_hover = false;
    this.menu.actor.x_expand = true;
    this.menu.actor.y_expand = true;
    this.addMenuItems();
    this.setupWatch();
  }

  private isTrashEmpty(): boolean {
    let children = TRASH.enumerate_children("*", 0, null);
    let status = true;
    if (children.next_file(null) != null) {
      status = false;
    }
    children.close(null);
    return status;
  }

  private setIcon() {
    if (this.currentIcon == null) {
      const isEmpty = this.isTrashEmpty();
      if (isEmpty) {
        this.trashIcon = new St.Icon(this.ICON_EMPTY);
        this.currentIcon = this.ICON_EMPTY;
      } else {
        this.trashIcon = new St.Icon(this.ICON_FULL);
        this.currentIcon = this.ICON_FULL;
      }
      this.add_child(this.trashIcon);
    }
  }

  private addMenuItems() {
    this.emptyItem = new MenuItem(
      "Empty Trash",
      "edit-delete-symbolic",
      null,
      this.onEmptyTrash.bind(this)
    );
    // @ts-ignore
    this.menu.addMenuItem(this.emptyItem);
    this.openItem = new MenuItem(
      "Open Trash",
      "folder-open-symbolic",
      null,
      this.onOpenTrash
    );
    // @ts-ignore
    this.menu.addMenuItem(this.openItem);
  }

  private updateIcon() {
    if (this.currentIcon != null) {
      const isEmpty = this.isTrashEmpty();
      let iconName = "";
      if (isEmpty && this.currentIcon != this.ICON_EMPTY) {
        this.currentIcon = this.ICON_EMPTY;
        iconName = this.ICON_EMPTY.icon_name;
      } else if (!isEmpty && this.currentIcon != this.ICON_FULL) {
        this.currentIcon = this.ICON_FULL;
        iconName = this.ICON_FULL.icon_name;
      }

      if (iconName && this.trashIcon) {
        this.trashIcon.icon_name = iconName;
      }
    }
  }

  destroy() {
    if (this.monitor && !this.monitor.is_cancelled()) {
      this.monitor.cancel();
    }
    super.destroy();
  }

  public processEmptyTrash() {
    let children = TRASH.enumerate_children("*", 0, null);
    let childInfo: Gio.FileInfo | null;
    while ((childInfo = children.next_file(null)) != null) {
      let child = TRASH.get_child(childInfo.get_name());
      child.delete(null);
    }
    children.close(null);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   MONITOR                                  */
  /* -------------------------------------------------------------------------- */
  public onEmptyTrash() {
    new ConfirmDialog(this.processEmptyTrash).open();
  }
  public onOpenTrash() {
    Gio.app_info_launch_default_for_uri(TRASH_PATH, null);
  }
  private setupWatch() {
    this.monitor.connect("changed", this.onTrashChange.bind(this));
  }

  public onTrashChange() {
    this.updateIcon();
  }
}
