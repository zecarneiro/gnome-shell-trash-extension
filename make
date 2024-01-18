#!/bin/bash

export TRASH_EXT_ROOT_DIR=$(realpath $(dirname $0))

release() {
	zip -r trash-app-extension@zecarneiro.pt.zip * -x .git -x .zip -x Makefile -x "*.png"
}

uninstall() {
	rm -rf ~/.local/share/gnome-shell/extensions/trash-app-extension@zecarneiro.pt
}

install() {
	uninstall
	mkdir -p ~/.local/share/gnome-shell/extensions/trash-app-extension@zecarneiro.pt
	cp -R . ~/.local/share/gnome-shell/extensions/trash-app-extension@zecarneiro.pt
}

clean() {
	rm -f trash-app-extension@zecarneiro.pt.zip
}

pushd .
cd "$TRASH_EXT_ROOT_DIR"
set -euxo pipefail
eval "$*"
set +x
popd
	
