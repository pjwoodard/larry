Vue.component('v-select', VueSelect.VueSelect);

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.upload_file = function() {
      fr = new FileReader();
      fr.onload = function(e) {
          APP.vue.data = e.target.result;
      };
      fr.readAsText(event.target.files[0]);
    };

    self.get_user_keys = function() {
        $.getJSON(get_user_keys_url, {}, function(data) {
            self.vue.user_keys = [];
            for (var i = 0; i < data.keys.length; i++)
            {
                self.vue.user_keys.push(data.keys[i]);
            }
        });
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            key_generator: new KeyGenerator(),
            signer: new Signer(),
            crypter: new Crypter(),
            banner_displayer: new BannerDisplayer(),
            user_keys: [],
            selected: null,
            data: null,
        },
        methods: {
            hahaha: function () {console.log("fuck webapps");},
            upload_file: self.upload_file,
            get_user_keys: self.get_user_keys,
        }
    });

    self.vue.get_user_keys();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
