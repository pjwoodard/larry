function Signer()
{
    // Variables -------------------------------------------------------

    this.data = "";
    this.signed_data = "";
    this.enabled = false;

    this.key = null;
    this.sign_mech = null;

    // Member functions ------------------------------------------------

    this.reset = function() {
        this.key = null;
        this.sign_mech = null;
        this.data = "";
        this.signed_data = "";
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
        $.post(
            sign_url,
            {
                obj_type: this.key_type(),
                label: this.key.p11_label,
                object_id: this.key.p11_id,
                mech: this.sign_mech,
                data: this.data,
            }, function (data) {
                console.log(data.signed_data);
            }
        );

        this.reset();
    };

    this.verify = function() {
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

            }
        );

        this.reset();
    };
}
