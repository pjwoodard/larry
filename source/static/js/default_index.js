// This is the js for the default/index.html view.

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.generate_key_form = function () {
        if (self.vue.is_generating_key == false) {
            self.vue.is_generating_key = true;
        }
    };

    Vue.component('v-select', VueSelect.VueSelect);

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_generating_key: true,
            key_type: null,
            size_or_curve: null, 
            key_type_to_size_and_curves: [
                {
                    type: "AES",
                    sizes: ["128", "192", "256", "512"]
                },
                {
                    type: "RSA",
                    sizes: ["1024", "2048", "3072", "4096"]
                }
            ]
        },
        methods: {
            generate_key_form: self.generate_key_form
        },

        computed: {
            available_size_or_curves() {
                return this.key_type ? this.key_type.sizes : false
            }
        }
    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
