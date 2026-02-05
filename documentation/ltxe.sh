#!/usr/bin/env bash

set -e

# ---- lib: find-root.sh ----
find_root() {
  local dir="${1:-$PWD}"

  while true; do
    if [ -f "$dir/$LOCK_FILE" ]; then
      echo "$dir"
      return 0
    fi

    [ "$dir" = "/" ] && { log_error "No $LOCK_FILE file found."; return 1; }

    dir=$(dirname "$dir")
  done
}

# ---- lib: globals.sh ----
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOC_DIR="doc"
FIG_DIR="fig"
INC_DIR="inc"
TPL_DIR="tpl"
OUT_DIR="out"
LOCAL_PKG_DIR="pkg"
PKG_DIR="ltxe/pkg"
TEXMF_DIR="ltxe/texmf"
BUILD_DIR="ltxe/build"

LOCK_FILE="ltxe.lock"
SCRIPT_FILE="ltxe.sh"

# ---- lib: logger.sh ----
LOG_PREFIX="[LTXE]"

log_info() {
    echo -e "$LOG_PREFIX $*"
}

log_warn() {
    echo -e "$LOG_PREFIX \033[33mWARN: $*\033[0m" >&2
}

log_error() {
    echo -e "$LOG_PREFIX \033[31mERROR: $*\033[0m" >&2
}

# ---- command: build ----
cmd_build_run () 
{ 
    local pids=();
    local tex_files=();
    local failed_count=0;
    local total_files=0;
    local out_dir="";
    local target_file="$1";
    local ltxe_root="";
    if [ -n "$target_file" ]; then
        if [[ "$target_file" == /* ]]; then
            ltxe_root=$(find_root $(dirname "$target_file")) || { 
                log_error "Is your file inside of a LaTeX environment?";
                exit 1
            };
            out_dir="$ltxe_root/$OUT_DIR";
        else
            ltxe_root=$(find_root) || { 
                log_error "Are you inside of a LaTeX environment?";
                exit 1
            };
            out_dir="$ltxe_root/$OUT_DIR";
            target_file="$(realpath "$ltxe_root/$DOC_DIR/$target_file")";
            echo "$target_file";
        fi;
        if [ ! -f "$target_file" ]; then
            log_error "File '$1' not found.";
            return 1;
        fi;
        if [[ "$target_file" != *.tex ]]; then
            log_error "'$1' is not a .tex file.";
            return 1;
        fi;
        if [[ "$target_file" != "$ltxe_root/$DOC_DIR"* ]]; then
            log_error "'$1' is not under a '$DOC_DIR' directory.";
            return 1;
        fi;
        tex_files=("$target_file");
        total_files=1;
    else
        ltxe_root=$(find_root) || { 
            log_error "Are you inside of a LaTeX environment?";
            exit 1
        };
        out_dir="$ltxe_root/$OUT_DIR";
        if [ ! -d "$ltxe_root/$DOC_DIR" ]; then
            log_warn "No '$DOC_DIR' directory found.";
            log_info "Exiting..";
            exit 0;
        fi;
        while IFS= read -r tex_file; do
            tex_files+=("$tex_file");
        done < <(find "$ltxe_root/$DOC_DIR" -type f -name "*.tex");
        total_files=${#tex_files[@]};
        if [ $total_files -eq 0 ]; then
            log_warn "No '.tex' files found.";
            log_info "Exiting..";
            exit 0;
        fi;
        if [ -d "$out_dir" ] && [ "$(ls -A "$out_dir")" ]; then
            log_info "Clearing previous output.";
            find "$out_dir" -mindepth 1 -delete;
        fi;
    fi;
    export TEXMFHOME="$ltxe_root/$TEXMF_DIR";
    log_info "Building $total_files file(s) in parallel.";
    local result_file=$(mktemp);
    declare -A file_to_index;
    for i in "${!tex_files[@]}";
    do
        local tex_file="${tex_files[$i]}";
        local relpath="${tex_file#$ltxe_root/$DOC_DIR/}";
        file_to_index["$relpath"]=$i;
    done;
    function build_file () 
    { 
        local tex_file="$1";
        local relpath="$2";
        local tex_base="$(basename "$tex_file")";
        local tex_dir=$(dirname "$relpath");
        local build_dir="$ltxe_root/$BUILD_DIR/$tex_dir";
        mkdir -p "$build_dir";
        ( cd "$(dirname "$tex_file")" || exit 1;
        log_info "Building '$relpath'.";
        if latexmk -pdf -synctex=1 -pdflatex="pdflatex -interaction=nonstopmode -shell-escape -quiet %O %S" -outdir="$build_dir" "$tex_base" > /dev/null 2>&1; then
            echo "$relpath:SUCCESS" >> "$result_file";
            local pdf_relpath="${relpath%.tex}.pdf";
            local pdf_dir="$out_dir/$pdf_relpath";
            mkdir -p "$(dirname "$pdf_dir")";
            cp "$build_dir/${tex_base%.tex}.pdf" "$pdf_dir";
            log_info "Build successful for '$relpath'.";
        else
            echo "$relpath:FAILURE" >> "$result_file";
            log_error "Build failed for '$relpath'.";
        fi )
    };
    export -f build_file;
    export ltxe_root DOC_DIR BUILD_DIR;
    for i in "${!tex_files[@]}";
    do
        local tex_file="${tex_files[$i]}";
        local relpath="${tex_file#$ltxe_root/$DOC_DIR/}";
        build_file "$tex_file" "$relpath" & pids+=($!);
    done;
    if [ ! -n "$1" ]; then
        find "$ltxe_root/$DOC_DIR" -type f ! -name "*.tex" | while IFS= read -r file; do
            local relpath="${file#$ltxe_root/$DOC_DIR/}";
            local dest_dir="$out_dir/$(dirname "$relpath")";
            log_info "Copying file '$relpath'";
            mkdir -p "$dest_dir";
            cp "$file" "$dest_dir/";
        done;
    fi;
    for pid in "${pids[@]}";
    do
        wait "$pid" 2> /dev/null;
    done;
    log_info;
    log_info "Results:";
    while IFS= read -r line; do
        results+=("$line");
    done < "$result_file";
    sorted_results=();
    for i in "${!tex_files[@]}";
    do
        local tex_file="${tex_files[$i]}";
        local relpath="${tex_file#$ltxe_root/$DOC_DIR/}";
        for result in "${results[@]}";
        do
            if [[ "$result" == "$relpath:"* ]]; then
                sorted_results+=("$result");
                break;
            fi;
        done;
    done;
    for i in "${!sorted_results[@]}";
    do
        local result="${sorted_results[$i]}";
        local relpath="${result%:*}";
        local status="${result#*:}";
        [ $i -eq $(( ${#sorted_results[@]} - 1 )) ] && prefix="└──" || prefix="├──";
        if [ "$status" = "SUCCESS" ]; then
            log_info "$prefix ${GREEN}✓${NC} $relpath";
        else
            log_info "$prefix ${RED}✗${NC} $relpath";
            failed_count=$((failed_count + 1));
        fi;
    done;
    rm -f "$result_file";
    log_info;
    if [ $failed_count -eq 0 ]; then
        log_info "All builds completed successfully.";
        return 0;
    else
        log_info "$failed_count build(s) failed.";
        return 1;
    fi
}

# ---- command: init ----
cmd_init_run () 
{ 
    local target_dir="${1:-.}";
    if [ ! -d "$target_dir" ]; then
        mkdir -p "$target_dir" || { 
            log_error "Failed to create directory: $target_dir";
            log_info "Exiting..";
            exit 1
        };
    fi;
    if [ -d "$target_dir" ] && [ "$(ls -A "$target_dir")" ]; then
        log_error "Directory '$target_dir' must be empty.";
        log_info "Project was not created.";
        log_info "Exiting..";
        exit 0;
    fi;
    log_info "Initializing project at: $target_dir";
    cd "$target_dir";
    mkdir -p "$DOC_DIR";
    mkdir -p "$FIG_DIR";
    mkdir -p "$INC_DIR";
    mkdir -p "$BUILD_DIR";
    mkdir -p "$PKG_DIR";
    mkdir -p "$TEXMF_DIR";
    mkdir -p "$TPL_DIR";
    touch ".gitignore";
    cat <<EOF > ".gitignore"
.idea
.vscode
out/
ltxe/
EOF

    touch "$LOCK_FILE"
    cat <<EOF > "$LOCK_FILE"
# DO NOT EDIT THIS FILE.
EOF

    touch "$TPL_DIR/default.tex"
    cat <<EOF > "$TPL_DIR/default.tex"
\documentclass{article}

\begin{document}
  % Edit this template to use it with the 'ltxe new' command.
\end{document}
EOF

    local script_path="$(realpath "$0")"
    cp "$script_path" "$SCRIPT_FILE";
    log_info "Project created at: $target_dir"
}

# ---- command: install ----
cmd_install_run () 
{ 
    local script_name="${0##*/}";
    local ltxe_root;
    ltxe_root=$(find_root) || { 
        log_error "Are you inside of a LaTeX environment?";
        exit 1
    };
    local pkg_dir="$ltxe_root/$PKG_DIR";
    local lock_file="$ltxe_root/$LOCK_FILE";
    mkdir -p "$pkg_dir";
    if [ -z "$1" ]; then
        log_info "Installing packages from lock file.";
        if [ ! -f "$lock_file" ]; then
            log_error "No $LOCK_FILE file found.";
            exit 1;
        fi;
        while IFS='|' read -r pkg_root_dir repo_url commit_hash; do
            [[ -z "$repo_url" || "$repo_url" =~ ^# ]] && continue;
            local repo_name=$(basename "$repo_url" .git);
            local target_dir="$pkg_dir/$repo_name";
            log_info "Installing '$repo_name' from '$repo_url'.";
            if [ -d "$target_dir" ]; then
                log_warn "Package '$repo_name' already exists. Ignoring..";
            else
                if ! git clone "$repo_url" "$target_dir" 2> /dev/null; then
                    log_error "Failed to clone repository '$repo_url'.";
                    continue;
                fi;
                if [ -n "$commit_hash" ]; then
                    ( cd "$target_dir" || exit 1;
                    git checkout "$commit_hash" 2> /dev/null );
                fi;
                log_info "Package '$repo_name' installed successfully";
            fi;
        done < "$lock_file";
    else
        local repo_url="$1";
        local commit_hash="$2";
        local repo_name=$(basename "$repo_url" .git);
        local target_dir="$pkg_dir/$repo_name";
        log_info "Installing package '$repo_name' from '$repo_url'";
        if [ -d "$target_dir" ]; then
            log_warn "Package '$repo_name' already exists. Updating...";
            ( cd "$target_dir" || exit 1;
            git fetch origin 2> /dev/null;
            if [ -n "$commit_hash" ]; then
                git checkout "$commit_hash" 2> /dev/null;
            else
                commit_hash=$(git rev-parse HEAD 2> /dev/null);
            fi );
        else
            if ! git clone "$repo_url" "$target_dir" 2> /dev/null; then
                log_error "Failed to clone repository";
                return 1;
            fi;
            if [ -n "$commit_hash" ]; then
                ( cd "$target_dir" || exit 1;
                log_info "Checking out commit '$commit_hash'";
                git checkout "$commit_hash" 2> /dev/null );
            else
                commit_hash=$(cd "$target_dir" && git rev-parse HEAD 2> /dev/null);
            fi;
        fi;
        log_info "Package '$repo_name' installed successfully";
        if [ ! -f "$lock_file" ] || ! grep -q "^$repo_url|" "$lock_file"; then
            log_info "Adding '$repo_name' to lock file";
            local temp_file=$(mktemp);
            if [ -f "$lock_file" ]; then
                cat "$lock_file" > "$temp_file";
                echo "$repo_url|$commit_hash" >> "$temp_file";
                sort "$temp_file" -o "$temp_file";
            else
                echo "$repo_url|$commit_hash" > "$temp_file";
            fi;
            mv "$temp_file" "$lock_file";
            log_info "Lock file updated";
        fi;
    fi;
    log_info "Copying package files to TEXMF directory...";
    for dir in "$pkg_dir"/*/;
    do
        if [ -d "$dir" ]; then
            local pkg_name=$(basename "$dir");
            if [ -d "$dir/texmf" ]; then
                log_info "Copying texmf from '$pkg_name'";
                cp -rf "$dir/texmf/"* "$ltxe_root/$TEXMF_DIR/" 2> /dev/null;
            else
                if [ -d "$dir/tex" ]; then
                    log_info "Copying tex from '$pkg_name'";
                    cp -rf "$dir/tex/"* "$ltxe_root/$TEXMF_DIR/" 2> /dev/null;
                fi;
            fi;
        fi;
    done;
    log_success "Installation complete"
}

show_help() {
  echo "Usage: $0 <command> [args]"
  echo
  echo "Available commands:"
  echo "  ├── build (b): Build your documents, or a specific document."
  echo "  ├── init: Create a new LaTeX Environment."
  echo "  └── install (i): Install packages from lock file or specific git repositories."
}

main() {
  cmd="$1"; shift || true
  case "$cmd" in
    build|b) cmd_build_run "$@" ;;
    init) cmd_init_run "$@" ;;
    install|i) cmd_install_run "$@" ;;
    help|-h|--help|"") show_help ;;
    *) echo "Unknown command: $cmd"; show_help; exit 1 ;;
  esac
}

main "$@"
