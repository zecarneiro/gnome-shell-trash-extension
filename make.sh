#!/bin/bash
ROOT_DIR=$(realpath $(dirname $0))
LOCAL_SHARE_DIR="$HOME/.local/share"
NAME="trash-app-extension"
DOMAIN="zecarneiro.pt"
BIN_DIR="$ROOT_DIR/dist"
ZIP_FILE_NAME="${NAME}.zip"
ZIP_FILE="$ROOT_DIR/$ZIP_FILE_NAME"
UUID="${NAME}@${DOMAIN}"
LATEST_VERSION="2.0.1"

# ---------------------------------------------------------------------------- #
#                                 GENERIC AREA                                 #
# ---------------------------------------------------------------------------- #
exec_cmd() {
    local cmd="$1"
    echo ">>> $cmd"
    eval "$cmd"
}

read_user_keyboard() {
    local message="$1"
    read -p "$message " keyValue
    echo "$keyValue"
}

exit_error() {
    local msg="$1"
    echo "[ERROR] $msg"
    exit 1
}

# ---------------------------------------------------------------------------- #
#                                EXTENSION AREA                                #
# ---------------------------------------------------------------------------- #
clean() {
    if [ -d "$BIN_DIR" ]; then
        exec_cmd "rm -rf '$BIN_DIR'"
    fi
}

build() {
    clean
    exec_cmd "npm install"
    exec_cmd "tsc --skipLibCheck"
}

release() {
    build
    exec_cmd "cp metadata.json '$BIN_DIR'"
    (cd "$BIN_DIR" && zip "$ZIP_FILE" -9r .)
    echo "[INFO] The release package is located: '$ZIP_FILE'"
    clean
}

uninstall() {
    exec_cmd "gext uninstall $UUID"
}

install() {
    local typeInstall="$1"
    local installDir="$LOCAL_SHARE_DIR/gnome-shell/extensions/$UUID"
    local zipTmp="/tmp/${ZIP_FILE_NAME}"
    uninstall
    if [ -d "$installDir" ]; then
        exec_cmd "rm -rf '$installDir'"
    fi
    if [[ "${typeInstall}" == "local" ]]; then
        exec_cmd "cp '$ZIP_FILE' '${zipTmp}'"
    else
        wget -q -O "${zipTmp}" "https://github.com/zecarneiro/trash-app-extension/releases/download/v${LATEST_VERSION}/${ZIP_FILE_NAME}"
    fi
    exec_cmd "gnome-extensions install '$zipTmp' --force"
    exec_cmd "gext enable '$UUID'"
    exec_cmd "rm -rf '$zipTmp'"
}

# ---------------------------------------------------------------------------- #
#                               DEPENDENCIES AREA                              #
# ---------------------------------------------------------------------------- #
install_python() {
    echo "[INFO] Need to install Python and pipx"
    local res="$(read_user_keyboard "Continue? [y/N]")"
    if [[ "${res}" == "y" ]] || [[ "${res}" == "Y" ]]; then
        exec_cmd "sudo apt install python3 -y"
        exec_cmd "sudo apt install python3-pip -y"
        exec_cmd "sudo apt install python3-venv -y"
        exec_cmd "python3 -m venv $HOME/.venv/anynamehere"
        exec_cmd "sudo apt install pipx -y"
        exec_cmd "pipx ensurepath"
        exec_cmd "sudo apt install python-is-python3 -y"
    fi

}

install_gext() {
    echo "[INFO] Need to install gnome-extensions-cli"
    local res=$(read_user_keyboard "Continue? [y/N]")
    if [[ "${res}" == "y" ]] || [[ "${res}" == "Y" ]]; then
        exec_cmd "pipx install gnome-extensions-cli --system-site-packages"
        exec_cmd "sudo ln -s '$HOME/.local/bin/gext' /usr/bin/gext"
        exec_cmd "sudo ln -s '$HOME/.local/bin/gnome-extensions-cli' /usr/bin/gnome-extensions-cli"
    fi
}

# ---------------------------------------------------------------------------- #
#                                   MAIN AREA                                  #
# ---------------------------------------------------------------------------- #
validate_all() {
    if [ ! "$(command -v npm)" ]; then
        exit_error "Please, install nodejs"
    fi
    if [ ! "$(command -v tsc)" ]; then
        exit_error "Please, install typescript"
    fi
}

main() {
    local action="$1"
    if [ ! "$(command -v gext)" ]; then
        install_python
        install_gext
    fi
    case "$action" in
    --release)
        validate_all
        release
    ;;
    --install) install "$@" ;;
    --uninstall) uninstall ;;
    --build)
        validate_all
        build
    ;;
    --clean)
        validate_all
        clean
    ;;
    *) echo "$0 --build|--install|--release|--clean" ;;
    esac

}

pushd .
cd "$ROOT_DIR"
main $@
popd
