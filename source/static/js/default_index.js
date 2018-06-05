Vue.component('v-select', VueSelect.VueSelect);

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.generate_key_form = function () {
        self.vue.signer.enabled = false;
        self.vue.key_generator.enabled = true;
    };

    self.sign_verify_form = function () {
        self.vue.signer.enabled = true;
        self.vue.key_generator.enabled = false;
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            key_generator: new KeyGenerator(),
            signer: new Signer(),
            selected: null,
        },
        methods: {
            generate_key_form: self.generate_key_form,
            sign_verify_form: self.sign_verify_form
        },

        computed: {
            available_size_or_curves() {
                return self.vue.key_generator.key_type ? self.vue.key_generator.key_type.sizes : false
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
