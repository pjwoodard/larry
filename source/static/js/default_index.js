Vue.component('v-select', VueSelect.VueSelect);

var app = function () {

    var self = {};
    Vue.config.silent = false; // show all warnings

    self.upload_file = function() {
      var passedFile = event.target.files[0];
      console.log(passedFile);
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
            user_keys: [],
            selected: null,

        },
        // watch: {
        //     user_keys: self.get_user_keys,
        // },
        methods: {
            upload_file: self.upload_file,
            destroy_everything: function() {
                $.post(destroy_everything_url, {});
                self.vue.user_keys = [];
                self.vue.signer.key=null;
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

    var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
    var pieChart       = new Chart(pieChartCanvas);
    var PieData        = [
        {
            value    : 700,
            color    : '#f56954',
            highlight: '#f56954',
            label    : 'Chrome'
        },
        {
            value    : 500,
            color    : '#00a65a',
            highlight: '#00a65a',
            label    : 'IE'
        },
        {
            value    : 400,
            color    : '#f39c12',
            highlight: '#f39c12',
            label    : 'FireFox'
        },
        {
            value    : 600,
            color    : '#00c0ef',
            highlight: '#00c0ef',
            label    : 'Safari'
        },
        {
            value    : 300,
            color    : '#3c8dbc',
            highlight: '#3c8dbc',
            label    : 'Opera'
        },
        {
            value    : 100,
            color    : '#d2d6de',
            highlight: '#d2d6de',
            label    : 'Navigator'
        }
    ];
    var pieOptions     = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke    : true,
        //String - The colour of each segment stroke
        segmentStrokeColor   : '#fff',
        //Number - The width of each segment stroke
        segmentStrokeWidth   : 2,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps       : 100,
        //String - Animation easing effect
        animationEasing      : 'easeOutBounce',
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate        : true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale         : false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive           : true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio  : true,
        //String - A legend template
        legendTemplate       : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%> = <%=segments[i].value%><%}%></li><%}%></ul>'
    }
    document.getElementById("data-legend").innerHTML = pieChart.Doughnut(PieData, pieOptions).generateLegend();

    self.vue.get_user_keys();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
