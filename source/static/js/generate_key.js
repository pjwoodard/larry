function KeyGenerator() {
    // Variables -------------------------------------------------------
    this.enabled = false;

    this.key_label = null;
    this.key_type = null;
    this.key_size = null;

    this.kl_error = false;
    this.kt_error = false;
    this.ks_error = false;

    this.key_type_to_size_and_curves = function() {
        return size_or_curve_map;
    };
        
    this.clearErrors = function () {
        this.kl_error = false;
        this.ks_error = false;
        this.kt_error = false;
    };

    this.validateForm = function () {
        validated = true; 

        this.clearErrors();
        
        if (this.key_label == null) {
            this.kl_error = true;
            validated = false;
        } 
        if (this.key_type == null) {
            this.kt_error = true;
            validated = false;
        } 
        if (this.key_size == null) {
            this.ks_error = true;
            validated = false;
        }

        return validated;
    }

    // Member functions ------------------------------------------------
    this.generate = function () {
        if (this.validateForm()) {
            $.post(
                generate_key_url,
                {
                    label: this.key_label,
                    type: this.key_type.type,
                    size: this.key_size
                }, function (key) {
                    if (key != null) {
                        APP.vue.user_keys.push(key);
                        APP.vue.filter_keys();
                        APP.vue.banner_displayer.display_success("Key generated successfully.");
                    }
                }
            );
            this.key_label = null;
            this.key_type = null;
            this.key_size = null;
        }
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

