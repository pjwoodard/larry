#!/bin/bash

# This script sets up the project and starts the web app.

# TODO:
# - add a cmdline argument to run web2py in the background
# - rewrite in python?

caller_path=$PWD
script_path=$(dirname $0)
module_path=$script_path/modules
web2py_path=$module_path/web2py

if ! [ -e $web2py_path/web2py.py ]
then
    cd $script_path
    if ! git submodule update --init --recursive
    then
        echo "Error unable to update submodules." >&2
        exit
    fi
    cd $caller_path
fi

if ! [ -L $web2py_path/applications/larry ]
then
    cd $web2py_path/applications
    source_path=../../../source
    if ! [ -e $source_path ] || ! ln -s $source_path larry
    then
        echo "Error linking source to web2py" >&2
        exit
    fi 
    cd $caller_path
fi

if [ -z "$PKCS11_LIBRARY_PATH" ]
then 
    echo "Warning, PKCS11_LIBRARY_PATH is undefined." >&2
fi

python3 $web2py_path/web2py.py -a 'password' -i 127.0.0.1 -p 8080 -e
