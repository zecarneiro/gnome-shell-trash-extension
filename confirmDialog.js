const St = imports.gi.St;
const GObject = imports.gi.GObject;
const ModalDialog = imports.ui.modalDialog;
const Clutter = imports.gi.Clutter;
const Gettext = imports.gettext.domain("trash-app-extension");
const _ = Gettext.gettext;
const MESSAGE = _(
  "Are you sure you want to delete all items from the trash?\n\
  This operation cannot be undone."
);

var ConfirmDialog = GObject.registerClass(
  class ConfirmDialog extends ModalDialog.ModalDialog {
    _init(callback) {
      super._init({ styleClass: null });

      let mainContentBox = new St.BoxLayout({
        style_class: `polkit-dialog-main-layout`,
        vertical: false,
      });
      this.contentLayout.add_child(mainContentBox, {
        x_fill: true,
        y_fill: true,
      });

      let messageBox = new St.BoxLayout({
        style_class: `polkit-dialog-message-layout`,
        vertical: true,
      });
      mainContentBox.add_child(messageBox, { y_align: St.Align.START });

      this._subjectLabel = new St.Label({
        style_class: `polkit-dialog-headline`,
        style: `text-align: center; font-size: 1.6em; padding-bottom:1em`,
        text: _("Empty Trash?"),
      });

      messageBox.add_child(this._subjectLabel, {
        y_fill: false,
        y_align: St.Align.START,
      });

      this._descriptionLabel = new St.Label({
        style_class: `polkit-dialog-description`,
        style: `text-align: center`,
        text: Gettext.gettext(MESSAGE),
      });

      messageBox.add_child(this._descriptionLabel, {
        y_fill: true,
        y_align: St.Align.START,
      });
      this.setButtons([
        {
          label: _("Cancel"),
          action: () => {
            this.close();
          },
          key: Clutter.Escape,
        },
        {
          label: _("Empty"),
          action: () => {
            this.close();
            callback();
          },
        },
      ]);
    }
  }
);
