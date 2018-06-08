function KeyGenerator() {
    // Variables -------------------------------------------------------
    this.enabled = false;

    this.key_label = null;
    this.key_type = null;
    this.key_size = null;
    this.key_type_to_size_and_curves = [
        {
            type: "AES",
            sizes: ["128", "192", "256"]
        },
        {
            type: "RSA",
            sizes: ["1024", "1536", "2048", "4096"]
        },
        {
            type: "DSA",
            sizes: ["1024", "2048", "3072"]
        },
        {
            type: "EC",
            sizes:
            [
                'prime192v2', 'prime192v3', 'prime239v1', 'sect163k1',
                'sect163r2', 'secp192r1', 'secp224r1', 'sect233k1', 'secp256r1',
                'sect233r1', 'sect283k1', 'sect283r1', 'secp384r1', 'sect409k1',
                'sect409r1', 'secp521r1', 'sect571k1', 'sect571r1'
            ]
        }
    ],

    // Member functions ------------------------------------------------
    this.generate = function () {
        $.post(
            generate_key_url,
            {
                label:  this.key_label,
                type:   this.key_type.type,
                size:   this.key_size
            }
        );
    };

    this.key_sizes = function () {
        sizes = null;
        if (this.key_type != null) {
            sizes = this.key_type.sizes;
            if (sizes != null) {
                if (sizes.length <= 0) {
                    sizes = null;
                }
                else if (!sizes.includes(this.key_size)) {
                    this.key_size = sizes[0];
                }
            }
        }

        return sizes;
    };
}

