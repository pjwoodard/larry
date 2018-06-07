Vue.component('v-select', VueSelect.VueSelect);

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.upload_file = function() {
      var passedFile = event.target.files[0];
      console.log(passedFile);
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
            upload_file: self.upload_file,
            destroy_everything: function() {
                $.post(destroy_everything_url, {});
            },
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
