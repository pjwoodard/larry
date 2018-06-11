function UserData()
{
    this.key = null;

    this.chart = null;

    this.data = function () {
        if (this.key == null) return [{
            value    : 1,
            color    : '#f56954',
            highlight: '#f56954',
            label    : 'No key selected'
        }];

        return $.post(
            key_data_url,
            { label : this.key.p11_label },
            function (data) {
                console.log(data);
                return [{
                    value    : data.signs,
                    color    : '#f56954',
                    highlight: '#f56954',
                    label    : 'Signs'
                }, {
                    value    : data.verifies,
                    color    : '#00a65a',
                    highlight: '#00a65a',
                    label    : 'Verify'
                }, {
                    value    : data.encrypts,
                    color    : '#f39c12',
                    highlight: '#f39c12',
                    label    : 'Encrypts'
                }, {
                    value    : data.decrypts,
                    color    : '#00c0ef',
                    highlight: '#00c0ef',
                    label    : 'Decrypts'
                }];
            }
        ).responseJSON;
    };


    this.options = {
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
        legendTemplate       : '<ul class="chart-legend clearfix"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%if(segments[i].label!="No key selected"){%> = <%=segments[i].value%><%}%></li><%}%><%}%></ul>'
    };

    this.generate = function() {
        this.chart = new Chart($('#pieChart').get(0).getContext('2d'));
    };

    this.legend = function() {
        document.getElementById("data-legend").innerHTML =
            this.chart.Doughnut(
                this.data(),
                this.options
            ).generateLegend();
    };

    this.display = function() {
        console.log(this);
        this.generate();
        this.legend();
    };
}
