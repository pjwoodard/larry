function Crypter()
{
    // Variables -------------------------------------------------------
    this.data = null;
    this.key = null;
    this.IV = null;
    this.size = 0;
    this.encr_mech = null;

    this.key_error = false;
    this.data_error = false;
    this.IV_error = false;

    this.is_uploading = false;

    // Member functions ------------------------------------------------

    this.upload_data = function () {
      console.log("uploadong in crypt");
      this.is_uploading = true;
      var fr = new FileReader();
      fr.onload = function(e) {
          APP.vue.crypter.data = e.target.result;
          console.log("uploaded: ", APP.vue.crypter.data);
          APP.vue.crypter.is_uploading = false;
      };
      fr.readAsText(event.target.files[0]);
    };

    this.reset = function() {
        this.data = null;
        this.key = null;
        this.IV = null;
        this.size = 0;
        this.encr_mech = null;

        this.key_error = false;
        this.data_error = false;
        this.IV_error = false;
};

    this.clear_errors = function() {
        this.key_error = false;
        this.data_error = false;
    };

    this.validate_form = function() {
        this.clear_errors();
        this.key_error = this.key == null;
        this.data_error = this.data == null;
        this.IV_error = this.IV == null || this.IV.length != 16;
         if (this.key_type() != 'AES') {
            this.IV_error = false;
            this.IV = null;
        }
        return !(this.data_error || this.key_error || this.IV_error);
    };
    
    this.encrypt = function() {
        if (this.validate_form()) {
            $.post(encrypt_url, {
                obj_type: this.key_type(),
                label: this.key.p11_label,
                object_id: this.key.p11_id,
                mech: this.encr_mech,
                data: this.data,
                iv: this.IV,

            }, function (data) {
                APP.vue.banner_displayer.display_success("File encrypted successfully.");
                download(data.encrypted_data, "encrypted_data.txt");
            });
            this.reset();
        }
    };

    this.decrypt = function() {
        if (this.validate_form()) {
            $.post(decrypt_url, {
                obj_type: this.key_type(),
                label: this.key.p11_label,
                object_id: this.key.p11_id,
                mech: this.encr_mech,
                data: this.data,
                iv: this.IV,

            }, function (data) {
                APP.vue.banner_displayer.display_success("File decrypted successfully.");
                download(data.decrypted_data, "decrypted_data.txt");
            });
            this.reset();
        }
    };

    this.key_type = function() {
        if (this.key != null) {
            return String(this.key.p11_type);
        }

        return null
    };

    this.encr_mechs = function() {
        var mechs = null;
        if (this.key_type() != null) {
            mechs = Object.keys(encr_mech_map[this.key_type()]).slice();
            if (mechs.length <= 0) {
                mechs = null;
            } else if (!mechs.includes(this.encr_mech)) {
                this.encr_mech = mechs[0];
            } else if (this.encr_mech != null) {
                var index = mechs.indexOf(this.encr_mech);
                if (index >= 0) {
                    mechs.splice(index, 1);
                }
            }
        }
        return mechs;
    };
}
