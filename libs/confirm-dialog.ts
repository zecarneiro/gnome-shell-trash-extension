import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { ModalDialog } from "resource:///org/gnome/shell/ui/modalDialog.js";
import { gettext } from "resource:///org/gnome/shell/extensions/extension.js";
const MESSAGE =
  "Are you sure you want to delete all items from the trash?\nThis operation cannot be undone.";

export default class ConfirmDialog extends ModalDialog {
  static {
    GObject.registerClass(this);
  }
  private mainContentBox: St.BoxLayout;
  private messageBox: St.BoxLayout;
  private subjectLabel: St.Label;
  private descriptionLabel: St.Label;
  constructor(callback: () => any) {
    super({ styleClass: undefined });
    this.mainContentBox = new St.BoxLayout({
      style_class: `polkit-dialog-main-layout`,
      vertical: false,
    });
    this.contentLayout.add_child(this.mainContentBox);

    this.messageBox = new St.BoxLayout({
      style_class: `polkit-dialog-message-layout`,
      vertical: true,
    });
    this.mainContentBox.add_child(this.messageBox);

    this.subjectLabel = new St.Label({
      style_class: `polkit-dialog-headline`,
      style: `text-align: center; font-size: 1.6em; padding-bottom:1em`,
      text: "Empty Trash?",
    });

    this.messageBox.add_child(this.subjectLabel);

    this.descriptionLabel = new St.Label({
      style_class: `polkit-dialog-description`,
      style: `text-align: center`,
      text: gettext(MESSAGE),
    });

    this.messageBox.add_child(this.descriptionLabel);

    this.setup(callback);
  }

  private setup(callback: () => any) {
    this.setButtons([
      {
        label: "Cancel",
        action: () => {
          this.close();
        },
        key: Clutter.KEY_Escape,
      },
      {
        label: "Empty",
        action: () => {
          this.close();
          callback();
        },
      },
    ]);
  }
}
