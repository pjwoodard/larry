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

    self.get_user_key_data = function () {
        if(self.vue.key_to_display != null) {
            console.log(self.vue.key_to_display.p11_label);
            $.ajax({
                method: "GET",
                url: key_data_url,
                data: { label: self.vue.key_to_display.p11_label },
                async: false
            }).done(function (data) {
                self.vue.user_key_data = data;
            });

            console.log(self.vue.user_key_data.signs);
            console.log(self.vue.user_key_data.verifies);
            console.log(self.vue.user_key_data.encrypts);
            console.log(self.vue.user_key_data.decrypts);

            return [{
                value: self.vue.user_key_data.signs,
                color: '#f56954',
                highlight: '#f56954',
                label: 'Signs'
            }, {
                value: self.vue.user_key_data.verifies,
                color: '#00a65a',
                highlight: '#00a65a',
                label: 'Verify'
            }, {
                value: self.vue.user_key_data.encrypts,
                color: '#f39c12',
                highlight: '#f39c12',
                label: 'Encrypts'
            }, {
                value: self.vue.user_key_data.decrypts,
                color: '#00c0ef',
                highlight: '#00c0ef',
                label: 'Decrypts'
            }];
        }
    };

    self.generate_chart = function() {
        self.vue.chart = new Chart($('#pieChart').get(0).getContext('2d'));
    };

    self.generate_legend = function() {
        document.getElementById("data-legend").innerHTML =
        self.vue.chart.Doughnut(
            self.vue.get_user_key_data(),
            self.vue.chart_options
        ).generateLegend();
    }

    self.display_chart = function() {
        self.vue.generate_chart();
        self.vue.generate_legend();
    };

    self.chart_options = {
        segmentShowStroke    : true,
        segmentStrokeColor   : '#fff',
        segmentStrokeWidth   : 2,
        percentageInnerCutout: 35,
        animationSteps       : 100,
        animationEasing      : 'easeOutBounce',
        animateRotate        : true,
        animateScale         : false,
        responsive           : true,
        maintainAspectRatio  : true,
        legendTemplate       : '<ul class="chart-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%> = <%=segments[i].value%></li><%}%><%}%></ul>'
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            chart: null,
            key_generator: new KeyGenerator(),
            signer: new Signer(),
            crypter: new Crypter(),
            banner_displayer: new BannerDisplayer(),
            user_keys: [],
            user_key_data: [],
            chart_options: [],
            selected: null,
            key_to_display: null,
            data: null,
        },
        methods: {
            upload_file: self.upload_file,
            get_user_keys: self.get_user_keys,
            display_chart: self.display_chart,
            generate_chart: self.generate_chart,
            generate_legend: self.generate_legend,
            get_user_key_data: self.get_user_key_data
        }
    });

    self.vue.get_user_keys();
    self.vue.display_chart();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
