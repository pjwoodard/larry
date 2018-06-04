// This is the js for the default/index.html view.

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.generate_key_form = function () {
        if (self.vue.is_generating_key == false) {
            self.vue.is_generating_key = true;
        }
    };

     self.upload_complete = function (response) {
        // This callback is called when the insertion of the track completes.
        // The next step will be to get the track info (artist, album, etc).
        // Notes the insertion id.
        self.insertion_id = response.insertion_id;
        // Moves to entering the track info: displays the form, rather than the uploader.
        self.vue.is_adding_track_info = true;
        self.vue.is_adding_track = false;
        $("div#uploader_div").hide();
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
            generate_key_form: self.generate_key_form,
            upload_complete: self.upload_complete,
        }

    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
