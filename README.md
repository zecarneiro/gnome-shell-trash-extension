# trash-app-extension

**IMPORTANT**

This extension was created based on:
`https://gjs.guide/extensions/development/typescript.html`

---

This extension is a fork of [Trash Extension](https://gitlab.com/bertoldia/gnome-shell-trash-extension)

A minimalist Trash management extension for the Gnome Shell.

It allows you to empty and open the Trash folder.

# Manual Installation

```
wget -qO- https://raw.githubusercontent.com/zecarneiro/trash-app-extension/master/make.sh | bash /dev/stdin "--install"
```
Restart the shell(`Alt + F2 → r → Enter`).

# For tests

1. Login with **Wayland**
2. Run `make --install`
3. Run `dbus-run-session -- gnome-shell --nested --wayland`
4. To exit from tests, use `CTRL+C`
