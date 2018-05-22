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
            selected: null,
        },
        methods: {
            generate_key_form: self.generate_key_form
        }

    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
