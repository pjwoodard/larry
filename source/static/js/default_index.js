Vue.component('v-select', VueSelect.VueSelect);



var app = function () {

    $("div#myId").dropzone({ url: "/file/post" }).show();


    var self = {};
    Vue.config.silent = false; // show all warnings

    self.generate_key_form = function () {
        self.vue.is_generating_key = true;
        self.vue.signer.enabled = false;
    };

    self.sign_verify_form = function () {
        self.vue.signer.enabled = true;
        self.vue.is_generating_key = false;
    };


    self.choose_file = function() {
      console.log("In Choose File")
    };

    self.upload_file = function() {
        console.log("In Upload File")
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_generating_key: true,
            signer: new Signer(),
            selected: null,

            selected_price: null,
        },
        methods: {
            generate_key_form: self.generate_key_form,
            sign_verify_form: self.sign_verify_form,

            choose_file: self.choose_file,
            upload_file: self.upload_file,

        }
    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
