import Gio from "gi://Gio";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import TrashProcessor from "./libs/trash-processor.js";

export default class TrashApp extends Extension {
  indicator: TrashProcessor | undefined;
  readonly APP_NAME = "Trash App";
  readonly APP_STATUS_AREA_ID = "trashApp";
  // gsettings?: Gio.Settings;
  constructor(metadata: any) {
    super(metadata);

    // DO NOT create objects, connect signals or add main loop sources here
  }

  enable() {
    //this.gsettings = this.getSettings();
    this.indicator = new TrashProcessor(this.APP_NAME);
    Main.panel.addToStatusArea(this.uuid, this.indicator);
  }

  disable() {
    //Main.panel.statusArea[APP_STATUS_AREA_ID].destroy();
    if (this.indicator != undefined && this.indicator != null) {
      this.indicator.destroy();
      this.indicator = undefined;
    }
  }
}
