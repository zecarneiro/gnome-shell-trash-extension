const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const TrashMenuItem = Me.imports.trashMenuItem.TrashMenuItem;
const TrashMenu = Me.imports.trashMenu.TrashMenu;
const APP_NAME = "Trash App";
const APP_STATUS_AREA_ID = "trash_app_extension";

function init(extensionMeta) {/*DO NOTHING */}

let _indicator;

function enable() {
  _indicator = new TrashMenu(APP_NAME);
  Main.panel.addToStatusArea(APP_STATUS_AREA_ID, _indicator);
}

function disable() {
  Main.panel.statusArea[APP_STATUS_AREA_ID].destroy();
  if (_indicator != null) {
    _indicator.destroy();
    _indicator = null;
  }
}
