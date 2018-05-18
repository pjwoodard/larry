// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    function get_memos_url(start_idx, end_idx) {
        console.log("in get_memos_url");
        console.log("start: ", start_idx);
        console.log("end: ", end_idx)
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return memos_url + "?" + $.param(pp);
    };

    self.get_memos = function() {
        console.log("let's get posty");
        $.getJSON(get_memos_url(0,10), function (data) {
            self.vue.memos = data.memos;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            enumerate(self.vue.memos);
        });
    };

    self.get_more_memos = function() {
      var num_memos = self.vue.memos.length;
      $.getJSON(get_memos_url(num_memos, num_memos + 10),
          function (data) {
          self.extend(self.vue.memos, data.memos);
          self.vue.has_more = data.has_more;
          enumerate(self.vue.memos);
          });
    };



    self.add_memo_button = function () {
        self.vue.is_editing_memo = false;
        self.vue.editing_id = -1;
        self.vue.is_adding_memo = !self.vue.is_adding_memo;
        self.vue.form_content = null;
        self.vue.form_title = null;
    };

    self.add_memo = function () {
        console.log("in add memo, hooray, spaghetti");
        console.log(self.vue.form_title);
        console.log(self.vue.form_content);

        $.post( add_memo_url, {
            title: self.vue.form_title,
            memo_content: self.vue.form_content,
        },
            function(data) {
            $.web2py.enableElement($("#add_memo_submit"));
            self.vue.memos.unshift(data);
            enumerate(self.vue.memos);
            console.log("Here is the memo that we are inserting");
            console.log(JSON.stringify(data));
            console.log("how many memos: ", self.vue.memos.length);
            console.log("Just for fun, here's data.id",data.id);
            self.vue.is_adding_memo = !self.vue.is_adding_memo;
            self.vue.form_title = null;
            self.vue.form_content = null;
            enumerate(self.vue.memos);
            });
    };

    self.edit_memo = function(memo_idx){
        console.log("WE SUBMITTING THIS EDIT DAWG");
        console.log("memo_id: ", self.vue.memos[memo_idx].id);
        console.log("title: ", self.vue.form_title);
        console.log("memo_content: ", self.vue.form_content);
        self.vue.editing_id = -1;
        self.is_editing_memo = !self.is_editing_memo;
        console.log("are we still editing memos?", self.editing_id);
        $.post(edit_memo_url, {
            memo_id: self.vue.memos[memo_idx].id,
            title: self.vue.form_title,
            memo_content: self.vue.form_content,
            },
            function (data) {
            self.vue.memos.splice(memo_idx, 1, data);
            enumerate(self.vue.memos);
            });

    };

    self.edit_memo_button = function(memo_idx) {
        self.vue.edit_title = self.vue.memos[memo_idx].title;
        self.vue.edit_content = self.vue.memos[memo_idx].memo_content;
        self.vue.is_adding_memo = false;//!self.vue.is_adding_memo;
        console.log("WE BOUTTA EDIT DAWG");
        self.vue.editing_id = self.vue.memos[memo_idx].id;
        self.vue.is_editing_memo = true;
    };


    self.toggle_public = function(memo_idx) {
        console.log("we up in toggle_memo fam");
        console.log("memo_idx:",memo_idx);
        $.post(toggle_public_url,
            {memo_id: self.vue.memos[memo_idx].id},
            function(){
               // console.log("data:", data.is_public);
                self.vue.memos[memo_idx].is_public = !self.vue.memos[memo_idx].is_public;
               // self.vue.memos.splice(memo_idx, 1, data);
                enumerate(self.vue.memos);
            });
        console.log("corresponding memo: ", JSON.stringify(self.vue.memos[memo_idx]));
        console.log("memo_id:",self.vue.memos[memo_idx].id);
    };



    self.delete_memo = function(memo_idx) {
        console.log("we up in delete_memo fam");
        console.log("memo_idx:",memo_idx);
        console.log("corresponding memo: ", JSON.stringify(self.vue.memos[memo_idx]));
        console.log("memo.id:",self.vue.memos[memo_idx].id);

        $.post(del_memo_url,
            {memo_id: self.vue.memos[memo_idx].id},
            function() {
                self.vue.memos.splice(memo_idx,1);
                enumerate(self.vue.memos);
            })
    };

    self.edit_memo_cancel = function() {
        self.vue.form_content = null;
        self.vue.form_title = null;
        self.vue.editing_id = -1;
        self.vue.is_editing_memo = false;
         // $("div#uploader_div").hide();
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {

            test_boolean: true,
        },
        methods: {

        }

    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
