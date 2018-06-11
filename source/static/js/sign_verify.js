function Signer()
{
    // Variables -------------------------------------------------------

    this.data = null;
    this.signed_data = null;
    this.enabled = false;

    this.key = null;
    this.sign_mech = null;

    this.key_error = false;
    this.data_error = false;

    // Member functions ------------------------------------------------

    this.upload_data = function () {
      console.log("uploadong");
      fr = new FileReader();
      fr.onload = function(e) {
          APP.vue.signer.data = e.target.result;
      };
      fr.readAsText(event.target.files[0]);
    };

    this.upload_signed_data = function () {
      console.log("uploadong");
      fr = new FileReader();
      fr.onload = function(e) {
          APP.vue.signer.signed_data = e.target.result;
      };
      fr.readAsText(event.target.files[0]);
    };

    this.reset = function() {
        this.key = null;
        this.sign_mech = null;
        this.data = "";
        this.signed_data = "";
    };

    this.clear_errors = function() {
        this.key_error = false;
        this.data_error = false;
    };

    this.validate_form = function() {
        validated = true;

        this.clear_errors();

        if(this.key == null) {
            this.key_error = true;
            validated = false;
        }
        if(this.data == null) {
            this.data_error = true;
            validated = false;
        }
        return validated;
    };

    this.key_type = function() {
        if (this.key != null)
        {
            console.log(this.key.p11_type);
            return String(this.key.p11_type);
        }

        return null
    };

    this.sign_mechs = function() {
        mechs = null;
        if (this.key_type() != null)
        {
            mechs = Object.keys(sign_mech_map[this.key_type()]).slice();
            if (mechs != null)
            {
                if (mechs.length <= 0)
                {
                    mechs = null;
                }
                else if (!mechs.includes(this.sign_mech))
                {
                    this.sign_mech = mechs[0];
                }
                else if (this.sign_mech != null)
                {
                    var index = mechs.indexOf(this.sign_mech);
                    if (index >= 0)
                    {
                        mechs.splice(index, 1);
                    }
                }
            }
        }

        return mechs;
    };

    this.sign = function() {
        if(this.validate_form()) {
            $.post(
                sign_url,
                {
                    obj_type: this.key_type(),
                    label: this.key.p11_label,
                    object_id: this.key.p11_id,
                    mech: this.sign_mech,
                    data: this.data,
                }, function (data) {
                    APP.vue.banner_displayer.display_success("Sign completed successfully.");
                    console.log(data.signed_data);
                }
            );

            this.reset();
        }
    };

    this.verify = function() {
        if(this.validate_form()) {
            console.log(this.signed_data);
            $.post(
                verify_url,
                {
                    obj_type: this.key_type(),
                    label: this.key.p11_label,
                    object_id: this.key.p11_id,
                    mech: this.sign_mech,
                    data: this.data,
                    signed_data: this.signed_data,
                }, function (data) {
                    if(data.is_valid_signature == true) {
                        APP.vue.banner_displayer.display_success("Verify completed successfully.");
                    } else if(data.is_valid_signature == false) {
                        APP.vue.banner_displayer.display_error("Verify did not complete succesfully.");
                    }
                }
            );

            this.reset();
        }
    };
}
