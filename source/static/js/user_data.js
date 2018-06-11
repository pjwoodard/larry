function UserData()
{
    this.key = null;
    this.chart = null;
    this.data = function () {
        return [{
            value    : 0,
            color    : '#f56954',
            highlight: '#f56954',
            label    : 'Signs'
        }, {
            value    : 0,
            color    : '#00a65a',
            highlight: '#00a65a',
            label    : 'Verify'
        }, {
            value    : 0,
            color    : '#f39c12',
            highlight: '#f39c12',
            label    : 'Encrypts'
        }, {
            value    : 0,
            color    : '#00c0ef',
            highlight: '#00c0ef',
            label    : 'Decrypts'
        }];
    };

    this.options = {
        segmentShowStroke    : true,
        segmentStrokeColor   : '#fff',
        segmentStrokeWidth   : 2,
        percentageInnerCutout: 20, // This is 0 for Pie charts
        animationSteps       : 100,
        animationEasing      : 'easeOutBounce',
        animateRotate        : true,
        animateScale         : false,
        responsive           : true,
        maintainAspectRatio  : true,
        legendTemplate       : '<ul class="chart-legend clearfix"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%> = <%=segments[i].value%><%}%></li><%}%></ul>'
    };

    this.generate = function () {
        return this.chart.Doughnut(this.data(), this.options).generateLegend();
    };
}
