Vue.component('v-select', VueSelect.VueSelect);

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.test_upload = function() {
      console.log("Thing is did")
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
            test_upload: self.test_upload,
        },

        computed: {
            available_size_or_curves() {
                return this.key_generator.key_type
                    ? this.key_generator.key_type.sizes
                    : false;
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
