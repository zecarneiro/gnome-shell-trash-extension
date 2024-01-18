const St = imports.gi.St;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const GObject = imports.gi.GObject;
const ExtensionUtils = imports.misc.extensionUtils;
const Gettext = imports.gettext.domain("trash-app-extension");
const Me = ExtensionUtils.getCurrentExtension();
const TrashMenuItem = Me.imports.trashMenuItem.TrashMenuItem;
const _ = Gettext.gettext;
const ConfirmDialog = Me.imports.confirmDialog.ConfirmDialog;
const ICON_FULL = {
  icon_name: "user-trash-full-symbolic",
  style_class: "popup-menu-icon",
};
const ICON_EMPTY = {
  icon_name: "user-trash-symbolic",
  style_class: "popup-menu-icon",
};
const TRASH_PATH = "trash:///";

var TrashMenu = GObject.registerClass(
  class TrashMenu extends PanelMenu.Button {
    _init(appName) {
      super._init(0.0, _(appName));
      this._currentIcon = null;
      this._trashIcon = null;

      // If this fails, see workaround in https://bugs.archlinux.org/task/62860
      this.trash_file = Gio.file_new_for_uri(TRASH_PATH);

      this._setIcon();
      this._addMenuItems();
      this._setupWatch();
    }

    _setIcon() {
      if (this._currentIcon == null) {
        const isEmpty = this._isTrashEmpty();
        if (isEmpty) {
          this._trashIcon = new St.Icon(ICON_EMPTY);
          this._currentIcon = ICON_EMPTY;
        } else {
          this._trashIcon = new St.Icon(ICON_FULL);
          this._currentIcon = ICON_FULL;
        }
        this.add_actor(this._trashIcon);
      }
    }

    _updateIcon() {
      if (this._currentIcon != null) {
        const isEmpty = this._isTrashEmpty();
        if (isEmpty && this._currentIcon != ICON_EMPTY) {
          this._currentIcon = ICON_EMPTY;
          this._trashIcon.icon_name = ICON_EMPTY.icon_name;
        } else if (!isEmpty && this._currentIcon != ICON_FULL) {
          this._currentIcon = ICON_FULL;
          this._trashIcon.icon_name = ICON_FULL.icon_name;
        }
      }
    }

    _addMenuItems() {
      this.empty_item = new TrashMenuItem(
        _("Empty Trash"),
        "edit-delete-symbolic",
        null,
        this._onEmptyTrash.bind(this)
      );
      this.menu.addMenuItem(this.empty_item);

      this.open_item = new TrashMenuItem(
        _("Open Trash"),
        "folder-open-symbolic",
        null,
        this._onOpenTrash.bind(this)
      );
      this.menu.addMenuItem(this.open_item);
    }

    destroy() {
      if (this.monitor && !this.monitor.is_cancelled()) {
        this.monitor.cancel();
      }
      super.destroy();
    }

    _isTrashEmpty() {
      let children = this.trash_file.enumerate_children("*", 0, null);
      let status = true;
      if (children.next_file(null) != null) {
        status = false;
      }
      children.close(null);
      return status;
    }

    _processEmptyTrash() {
      let children = this.trash_file.enumerate_children("*", 0, null);
      let child_info = null;
      while ((child_info = children.next_file(null)) != null) {
        let child = this.trash_file.get_child(child_info.get_name());
        child.delete(null);
      }
      children.close(null);
    }

    /* -------------------------------------------------------------------------- */
    /*                                   MONITOR                                  */
    /* -------------------------------------------------------------------------- */
    _onOpenTrash() {
      Gio.app_info_launch_default_for_uri(TRASH_PATH, null);
    }

    _setupWatch() {
      this.monitor = this.trash_file.monitor_directory(0, null);
      this.monitor.connect("changed", this._onTrashChange.bind(this));
    }

    _onTrashChange() {
      this._updateIcon();
    }

    _onEmptyTrash() {
      new ConfirmDialog(this._processEmptyTrash.bind(this)).open();
    }
  }
);
