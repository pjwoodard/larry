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
        },

        computed: {
        }
    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
