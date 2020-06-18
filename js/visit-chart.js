var realDW = $(document).width(), // @int --> real document width
    agreePollChartClass, 
    indexCsiChartPersentClass, 
    managerChartClass, 
    alertStatisticChartClass, 
    position; // @string ---------------------> side of legend position in charts

$(document).ready(function () {
    // add charts
    setSize();
    generateCharts();
    $(window).on('resize', function () {
        setTimeout(function () {
            checkMedia($(document).width(), getmediaPeriod(realDW));
        }, 80);
    })
});
/**
 *   function create chart
 */
function generateCharts() {
    // draw text in doughnut center*/
    Chart.pluginService.register({
        beforeDraw: function (chart) {
            if (chart.config.options.elements.center) {
                if(chart.config.typyCenterText == "text"){
                    var rad = $(chart.canvas).width() / 3.5 - 15;
                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;
                    var arrData = chart.config.data.datasets[0].data;
                    var srrmaxData = Math.max.apply(null, arrData);
                    var collsrFillRound = '#ffffff';
                    var collsrFontRound = '#b8d500';
                    ctx.restore();
                    var fontSize = rad / 1.5;
                    ctx.font = fontSize + "px sans-serif";
                    ctx.textBaseline = "middle";
    
                    var text = chart.config.options.elements.center.text,
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2;
    
                    ctx.beginPath();
                    if (chart.config.data.round) {

                        var as = ctx.measureText(text).width / 2;
                        ctx.arc(textX + as, textY, rad, 0, 2 * Math.PI);
                        ctx.fillStyle = collsrFillRound;
                        ctx.fill();
                        ctx.arc(textX + as, textY, rad, 0, 2 * Math.PI);
                        ctx.strokeStyle = "#ffffff";
                        ctx.stroke();
                        var fontColor = collsrFontRound;
                    }
                    else {
                        var fontColor = chart.config.options.elements.center.color;
                        textX -= 2;
                        ctx.font = 32 + "px sans-serif";
                    }
                    ctx.fillStyle = fontColor;
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
                else {
                    var rad = $(chart.canvas).width() / 3.5 - 10;
                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;
                    var arrData = chart.config.data.datasets[0].data;
                    var srrmaxData = Math.max.apply(null, arrData);
                    var collsrFillRound = '#e46e60';
                    var collsrFontRound = '#ffffff';
                    ctx.restore();
                    var fontSize = rad / 1.5;
                    ctx.font = fontSize + "px sans-serif";
                    ctx.textBaseline = "middle";
    
                    var text = chart.config.options.elements.center.text,
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2;
    
                    ctx.beginPath();
                    if (chart.config.data.round) {
                        var as = ctx.measureText(text).width / 2;
                        ctx.arc(textX + as, textY, rad, 0, 2 * Math.PI);
                        ctx.fillStyle = collsrFillRound;
                        ctx.fill();
                        ctx.arc(textX + as, textY, rad, 0, 2 * Math.PI);
                        ctx.strokeStyle = "#ffffff";
                        ctx.stroke();
                        var fontColor = collsrFontRound;
                    }
                    else {
                        var fontColor = chart.config.options.elements.center.color;
                        textX -= 2;
                        ctx.font = 32 + "px sans-serif";
                    }
                    ctx.fillStyle = fontColor;
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            }
        }
    });


    //agree poll chart 
    try {
        var agreePollChartCanvas = document.getElementById("agree-poll-chart-canvas").getContext('2d');
        var agreePollChart = new Chart(agreePollChartCanvas, {
            type: 'bar',
            data: agreePollChartData,
            options: {
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                        }
                    }]
                },
            }
        });
        agreePollChartClass = agreePollChart;
        agreePollChart.legend = false;
    }
    catch (err) {
        console.warn(err);
    }


    // doughnut chart
    var indexCsiChartElementPersenage = document.getElementById('index-csi-chart-canvas');
    try {
        if (indexCsiChartData && centerDonutTxt) {
            var indexCsiChartPersent = new Chart(indexCsiChartElementPersenage, {
                type: 'doughnut',
                typyCenterText: 'text',
                data: indexCsiChartData,
                options: {
                    animation: {
                        duration: 500,
                        easing: "easeOutQuart",
                        onComplete: function () {
                            var showPercent = true;
                            if (this.tooltip._active) {
                                if (this.tooltip._active[0]) {
                                    showPercent = false;
                                }
                            }
                            if (showPercent) {
                                var ctx = this.chart.ctx;
                                ctx.font = 10 + "px sans-serif";
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                this.data.datasets.forEach(function (dataset) {
                                    for (var i = 0; i < dataset.data.length; i++) {
                                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                            total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                            mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                            start_angle = model.startAngle,
                                            end_angle = model.endAngle,
                                            mid_angle = start_angle + (end_angle - start_angle) / 2;

                                        var x = mid_radius * Math.cos(mid_angle);
                                        var y = mid_radius * Math.sin(mid_angle);

                                        ctx.fillStyle = '#fff';
                                        if (i == 3) { // Darker text color for lighter background
                                            ctx.fillStyle = '#444';
                                        }
                                        var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                                        if (dataset.data[i] != 0) {
                                            ctx.fillText(percent, model.x + x, model.y + y + 15);
                                        }
                                    }
                                });
                            }
                        }
                    },
                    tooltips: {
                        titleFontSize: 11,
                        bodyFontSize: 11,
                        defaultFontSize: 11,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                        position: 'bottom',
                        fullWidth: true,
                        labels: {
                            fontColor: 'rgb(0, 0, 0)',
                            fontSize: 9,
                            padding: 20,
                            boxWidth: 15
                        }
                    },
                    legendCallback: function (chart) {
                        var text = [];
                        text.push('<ul class="' + chart.id + '-legend" style="list-style: none; padding: 0;">');
                        for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                            text.push('<li style="font-size: 10px; line-height: 1.8;"><span style="font-size: 10px; width: 15px; height: 15px; display: inline-block; margin-right: 10px; background-color:' + chart.data.datasets[0].backgroundColor[i] + '">');
                            text.push('</span>');
                            if (chart.data.labels[i]) {
                                text.push(chart.data.labels[i]);
                            }
                            text.push('</span></li>');
                        }
                        text.push('</ul>');
                        return text.join("");
                    },
                    pieceLabel: {
                        render: 'РІlabel',
                        fontColor: '#fff',
                        fontSize: 15,
                        precision: 0
                    },
                    elements: {
                        center: {
                            bull: false,
                            text: centerDonutTxt,
                            color: '#c1db06', //Default black
                            fontStyle: 'sans-serif', //Default Arial
                            sidePadding: 15 //Default 20 (as a percentage)
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    }
                },

            });
            indexCsiChartPersentClass = indexCsiChartPersent;
        }
        document.getElementById('legend1').innerHTML = indexCsiChartPersentClass.generateLegend();
    }
    catch (err) {
        console.warn(err);
    }


    // manager chart
    var managerChartElementPersenage = document.getElementById('manager-chart-canvas');
    try {
        if (managerChartData && centerManagerTxt) {
            var managerChartPersent = new Chart(managerChartElementPersenage, {
                type: 'doughnut',
                typyCenterText: 'bg-text',
                data: managerChartData,
                options: {
                    cutoutPercentage: 80,
                    tooltips: {
                        titleFontSize:12,
                        bodyFontSize: 12,
                        defaultFontSize: 12,
                    },
                    responsive: true,
                    maintainAspectRatio : false,
                    legend: {
                        display: false,
                        position: 'bottom',
                        fullWidth: true,
                        labels: {
                            fontColor: 'rgb(0, 0, 0)',
                            fontSize: 9,
                            padding: 20,
                            boxWidth: 15
                        }
                    },
                    legendCallback: function (chart) {
                        var text = [];
                        text.push('<div class="' + chart.id + '-legend">');
                        for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                            var total = chart.data.datasets[0]._meta[2].total;
                            var percent = String(Math.round(chart.data.datasets[0].data[i] / total * 100)) + "%";
                            var legendStr = 
                            '<div class="csi-legend-data-wrp red-legend-data" style="min-width: 121px; display: flex; margin: 23px 0;">'+
                            '    <div class="legend-txt" style="width: 107px !important; background: #EEEEEE; color: #636363; text-align: center; line-height: 22px; font-size: 10px !important; border-right: 1px solid #ffffff; border-radius: 11px 0 0 11px;">'+ chart.data.labels[i] +'</div>'+
                            '    <div class="legend-val" style=" background-color:' + chart.data.datasets[0].backgroundColor[i] + '; color: #000000; font-weight: bold; font-size: 10px !important; border-radius: 0 11px 11px 0; line-height: 22px; text-align: center; width: 30px !important;">'+ percent +'</div>'+
                            '</div>';
                            text.push(legendStr);
                        }
                        text.push('</div>');
                        return text.join("");
                    },
                    pieceLabel: {
                        render: 'label',
                        fontColor: '#000',
                        fontSize:15,
                        precision: 0
                        //position: 'outside'
                    },
                    elements: {
                        center: {
                            text: centerDonutTxt,
                            color: '#77ae5e', //Default black
                            fontStyle: 'sans-serif', //Default Arial
                            sidePadding: 15 //Default 20 (as a percentage)
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    },
                }
            });
            managerChartClass = managerChartPersent;
        }
        document.getElementById('legend-manager').innerHTML = managerChartClass.generateLegend();
    }
    catch (err) {
        console.warn(err);
    }
    //alert chart 
    try {
        var alertStatisticChartCanvas = document.getElementById("alert-statistic-chart-canvas").getContext('2d');
        var alertStatisticChart = new Chart(alertStatisticChartCanvas, {
            type: 'horizontalBar',
            data: alertStatisticChartData,
            options: {
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 120,
                            beginAtZero:true,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true,
                            min: 0,
                        }
                    }]
                },
            }
        });
        alertStatisticChartClass = alertStatisticChart;
        alertStatisticChart.legend = false;
    }
    catch(err) {
        console.warn(err);
    }
} // add charts

/**
 *   function generate new charts
 */
function setNewPosition() {

    // kill old charts
    agreePollChartClass.destroy();
    indexCsiChartPersentClass.destroy();
    managerChartClass.destroy();
    alertStatisticChartClass.destroy();
    var chartArr = [
        $('#agree-poll-chart-canvas'),
        // $('#alert-statistic-chart-canvas')
    ];

    chartArr.forEach(function (item) {
        var id = $(item).attr('id');
        var parent = $(item).parent();
        $(item).remove();
        $(parent).append('<canvas id="' + id + '"><canvas>');
    });

    // set width and height
    setSize();

    // generate chart
    generateCharts();


    agreePollChartClass.update();
    indexCsiChartPersentClass.update();
    managerChartClass.update();
    alertStatisticChartClass.update();
} // set new width and height for charts
function getmediaPeriod(w) {
    var mediaperiodsArr = [  // media array
        [1700, 2900],
        [1600, 1700],
        [1500, 1600],
        [1400, 1500],
        [1350, 1400],
        [1300, 1350],
        [1200, 1300],
        [1000, 1200],
        [767, 1000],
        [600, 767],
        [0, 600]
    ];

    for (var i = 0; i < mediaperiodsArr.length; i++) {
        if (w > mediaperiodsArr[i][0]) {
            return mediaperiodsArr[i];
            break;
        }
    } // return Media Period

}

/**
 *   function check id media period was chenget
 *   if period was changed set new width
 *   @param{Integer} width
 *   @param{Array} period
 */
function checkMedia(w, period) {

    if (w < period[0] || w > period[1]) {
        setNewPosition();
        realDW = w;
    }

} // check is media period changed
/**
 *   function set new width for canvas
 */
function setSize() {
    if ($(document).width() > 1700) {
        //line chart
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 750);
        $('#agree-poll-chart-canvas').attr('height', 280);

        $('#index-csi-chart-canvas').attr('width', 220);
        $('#index-csi-chart-canvas').attr('height', 220);

        $('#manager-chart-canvas').attr('width', 220);
        $('#manager-chart-canvas').attr('height', 220);        

        $('#alert-statistic-chart-canvas').attr('width', 1200 );
        $('#alert-statistic-chart-canvas').attr('height', 450 );
    }
    else if ($(document).width() > 1600) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 650);
        $('#agree-poll-chart-canvas').attr('height', 280);

        $('#index-csi-chart-canvas').attr('width', 210);
        $('#index-csi-chart-canvas').attr('height', 210);

        
        $('#manager-chart-canvas').attr('width', 210);
        $('#manager-chart-canvas').attr('height', 210);     
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 305 ); 
    }
    else if ($(document).width() > 1500) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 550);
        $('#agree-poll-chart-canvas').attr('height', 280);

        $('#index-csi-chart-canvas').attr('width', 210);
        $('#index-csi-chart-canvas').attr('height', 210);

        
        $('#manager-chart-canvas').attr('width', 210);
        $('#manager-chart-canvas').attr('height', 210);   
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 320 );   
    }
    else if ($(document).width() > 1400) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 550);
        $('#agree-poll-chart-canvas').attr('height', 280);


        $('#index-csi-chart-canvas').attr('width', 210);
        $('#index-csi-chart-canvas').attr('height', 210);
        
        $('#manager-chart-canvas').attr('width', 210);
        $('#manager-chart-canvas').attr('height', 210);    
        $('#alert-statistic-chart-canvas').attr('width', 800);
        $('#alert-statistic-chart-canvas').attr('height', 350);  
    }
    else if ($(document).width() > 1350) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 400);
        $('#agree-poll-chart-canvas').attr('height', 200);


        $('#index-csi-chart-canvas').attr('width', 200);
        $('#index-csi-chart-canvas').attr('height', 200);

        
        $('#manager-chart-canvas').attr('width', 200);
        $('#manager-chart-canvas').attr('height', 200);    
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 300 );  
    }
    else if ($(document).width() > 1300) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 380);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#index-csi-chart-canvas').attr('width', 200);
        $('#index-csi-chart-canvas').attr('height', 200);

        
        $('#manager-chart-canvas').attr('width', 200);
        $('#manager-chart-canvas').attr('height', 200);   
        
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 400 );
    }
    else if ($(document).width() > 1200) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 350);
        $('#agree-poll-chart-canvas').attr('height', 200);


        $('#index-csi-chart-canvas').attr('width', 200);
        $('#index-csi-chart-canvas').attr('height', 200);

        
        $('#manager-chart-canvas').attr('width', 200);
        $('#manager-chart-canvas').attr('height', 200);  
        
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 500 );
    }
    else if ($(document).width() > 1000) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#index-csi-chart-canvas').attr('width', 200);
        $('#index-csi-chart-canvas').attr('height', 200);
        $('#manager-chart-canvas').attr('width', 200);
        $('#manager-chart-canvas').attr('height', 200);

        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 500 );

    }
    else if ($(document).width() > 767) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 350);
        $('#agree-poll-chart-canvas').attr('height', 350);

        $('#index-csi-chart-canvas').attr('width', 150);
        $('#index-csi-chart-canvas').attr('height', 150);

        $('#manager-chart-canvas').attr('width', 150);
        $('#manager-chart-canvas').attr('height', 150);

        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 600 );

    }
    else if ($(document).width() > 600) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#index-csi-chart-canvas').attr('width', 200);
        $('#index-csi-chart-canvas').attr('height', 200);

        $('#manager-chart-canvas').attr('width', 200);
        $('#manager-chart-canvas').attr('height', 200);

        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 380 );
    }
    else if ($(document).width() < 600) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#index-csi-chart-canvas').attr('width', 200);
        $('#index-csi-chart-canvas').attr('height', 200);

        $('#manager-chart-canvas').attr('width', 200);
        $('#manager-chart-canvas').attr('height', 200);

        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 440 );

    }
    else {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#index-csi-chart-canvas').attr('width', 200);
        $('#index-csi-chart-canvas').attr('height', 200);

        $('#manager-chart-canvas').attr('width', 200);
        $('#manager-chart-canvas').attr('height', 200);

        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 280 );

    }

} // add media sizes
