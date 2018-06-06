function KeyGenerator() {
    // Variables -------------------------------------------------------
    this.enabled = false;

    this.key_label = null;
    this.key_type = null;
    this.key_size_or_curve = null;
    this.key_type_to_size_and_curves = [
        {
            type: "AES",
            sizes: ["128", "192", "256", "512"]
        },
        {
            type: "RSA",
            sizes: ["1024", "2048", "3072", "4096"]
        },
        {
            type: "DSA",
            sizes: ["1024", "2048", "3072"]
        },
        {
            type: "EC",
            sizes: ["prime128", "prime256v1"]
        }
    ],

    // Member functions ------------------------------------------------
    this.generate = function () {
        console.log(this.key_label);
        console.log(this.key_type.type);
        console.log(this.key_size_or_curve);

        // $.post()
    };
}
