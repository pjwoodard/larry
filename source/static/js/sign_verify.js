function Signer()
{
    // Variables -------------------------------------------------------

    this.data = "";
    this.enabled = false;

    this.key_type = null;
    this.sign_mech = null;
    this.dgst_mech = null;

    // Mechanism lists -------------------------------------------------

    // Later should put these in a configurable JSON file or something.

    this.all_dgsts = [
        "MD5",
        "SHA_1",
        "SHA224",
        "SHA256",
        "SHA384",
        "SHA512",
    ];

    this.mech_map = {
        DSA: {
            DSA: this.all_dgsts,
            DSA_SHA1: null,
            DSA_SHA224: null,
            DSA_SHA256: null,
            DSA_SHA384: null,
            DSA_SHA512: null,
        },

        EC: {
            ECDSA: this.all_dgsts,
        },

        RSA: {
            RSA_PKCS: this.all_dgsts,
            RSA_X509: this.all_dgsts,
            MD5_RSA_PKCS: null,
            SHA1_RSA_PKCS: null,
            SHA224_RSA_PKCS: null,
            SHA256_RSA_PKCS: null,
            SHA384_RSA_PKCS: null,
            SHA512_RSA_PKCS: null,
        },
    };

    // Member functions ------------------------------------------------

    this.key_types = function() {
        return [ "DSA", "EC", "RSA" ];
    };

    this.sign_mechs = function() {
        mechs = null;
        if (this.key_type != null)
        {
            mechs = Object.keys(this.mech_map[this.key_type]);
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
            }
        }

        return mechs;
    };

    this.dgst_mechs = function() {
        mechs = null;
        if (this.key_type != null && this.sign_mech != null)
        {
            mechs = this.mech_map[this.key_type][this.sign_mech];
            if (mechs != null && mechs.length <= 0)
            {
                mechs = null;
            }
        }

        return mechs;
    };

    this.sign = function() {
        console.log(this.data);
        console.log(this.key_type);
        console.log(this.sign_mech);
        console.log(this.dgst_mech);
    };

    this.verify = function() {
        console.log(this.data);
        console.log(this.key_type);
        console.log(this.sign_mech);
        console.log(this.dgst_mech);
    };
}