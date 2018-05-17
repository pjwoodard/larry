# larry

![Alt Text](https://media.giphy.com/media/2Ylp4JECyTYRi/giphy.gif)

# Table of contents

[Installation](#install)
- [MacOS](#install-macos)
- [Linux](#install-linux)

[Setup](#setup)
- [Testing](#testing)

[Running the web app](#run)

# <a name="install"><a/> Installation

## <a name="install-macos"><a/> MacOS

### Using brew ([homepage](https://brew.sh/))

```bash
$ brew install softhsm python
$ pip3 install python-pkcs11
# To make this permanent, add to .bash_profile or .bashrc
$ export PKCS11_LIBRARY_PATH=$(brew --prefix softhsm)/lib/softhsm/libsofthsm2.so
```

## <a name="install-linux"><a/>Linux

```bash
apt-get update
apt-get install -y softhsm2 git-core build-essential cmake libssl-dev libseccomp-dev
```

# <a name="setup"><a/>Setup

Setup environment (*if not done already*):
```bash
# To make this permanent, add to .bash_profile or .bashrc
$ export PKCS11_LIBRARY_PATH=<PATH TO SOFTHSM LIBRARY>
```

Create a softhsm token:
```bash
$ softhsm2-util --init-token --slot 0 --label larry --pin 1234 --so-pin 0000
```

## <a name="testing"><a/>Testing ([source](http://python-pkcs11.readthedocs.io/en/latest/index.html))

```bash
import pkcs11
import os

# Setup HSM
# Note that, you can supply the full path of the library instead of using os.environ.
lib = pkcs11.lib(os.environ['PKCS11_LIBRARY_PATH'])
token = lib.get_token(token_label='larry')

# Test encryption/decryption
with token.open(user_pin='1234') as session:
    # Setup key
    key = session.generate_key(pkcs11.KeyType.AES, 256)
    iv = session.generate_random(128)  # AES blocks are fixed at 128 bits

    # Encrypt/decrypt
    ciphertext = key.encrypt(b'INPUT DATA', mechanism_param=iv)
    plaintext = key.decrypt(ciphertext, mechanism_param=iv)

    # Print the stuff!
    print("Cipher text: ", end="")
    print(ciphertext)
    print("Plain text: " + plaintext.decode("utf-8"))
```

# <a name="run"><a/>Running the web app

Clone and start web2py by doing,
```bash
$ git clone https://github.com/pjwoodard/larry
$ cd larry
$ ./start.sh
```

The web app should be running at, `127.0.0.1:8080/larry/default/index`. The default admin password is `password`.
