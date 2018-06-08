Vue.component('v-select', VueSelect.VueSelect);

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.upload_file = function() {
      var passedFile = event.target.files[0];
      console.log(passedFile);
    };

    self.get_user_keys = function() {
        $.get(get_user_keys_url, {}, function(data) {
            self.vue.user_keys = [];
            self.vue.labels = [];
            for (var i = 0; i < data.keys.length; i++)
            {
                self.vue.user_keys.push(JSON.stringify(data.keys[i]));
                self.vue.labels.push(data.keys[i].p11_label);
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
            user_keys: [],
            labels: [],
            selected: null,

        },
        // watch: {
        //     user_keys: self.get_user_keys,
        // },
        methods: {
            upload_file: self.upload_file,
            destroy_everything: function() {
                $.post(destroy_everything_url, {});
                self.get_user_keys();
            },
            get_user_keys: self.get_user_keys,
        },
        computed: {
            available_size_or_curves() {
                return this.key_generator.key_type
                    ? this.key_generator.key_type.sizes
                    : false;
            },
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
