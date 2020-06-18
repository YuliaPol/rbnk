var realDW = $(document).width(), // @int --> real document width
    agreePollChartClass, 
    solvedProblemCirleChartClass, 
    solvedProblemChartClass, 
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
                if(chart.config.typyCenterText == "bg-text") {
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


    // solved problem 2 chart
    var solvedProblemCirleElementPersenage = document.getElementById('solved-problem-2-chart-canvas');
    try {
        if (solvedProblemCirleData && centerSolvedProblemTxt) {
            var solvedProblemCirleChartPersent = new Chart(solvedProblemCirleElementPersenage, {
                type: 'doughnut',
                typyCenterText: 'bg-text',
                data: solvedProblemCirleData,
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
                            var total = chart.data.datasets[0]._meta[1].total;
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
                            text: centerSolvedProblemTxt,
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
            solvedProblemCirleChartClass = solvedProblemCirleChartPersent;
        }
        document.getElementById('legend-solved-problem-2').innerHTML = solvedProblemCirleChartClass.generateLegend();
    }
    catch (err) {
        console.warn(err);
    }

    
    // solved problem chart
    var solvedProblemElementPersenage = document.getElementById('solved-problem-chart-canvas');
    try {
        if (solvedProblemChartData) {
            var solvedProblemChartPersent = new Chart(solvedProblemElementPersenage, {
                type: 'doughnut',
                data: solvedProblemChartData,
                options: {
                    cutoutPercentage: 70,
                    tooltips: {
                        mode: 'index',
                        titleFontSize:12,
                        bodyFontSize: 12,
                        defaultFontSize: 12,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + ' шт.';
                                return label;
                            }
                        }
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
                            '<div style="display: flex; padding: 5px;align-items: center; justify-content: flex-start;">'+
                            '    <div style="background-color:' + chart.data.datasets[0].backgroundColor[i] + ';text-align: center;width: 30px; padding-top: 5px; padding-bottom: 5px; color: #0b0a0a;font-size: 10px;">'+ percent +'</div>'+
                            '    <div style="font-size: 10px; padding-left: 10px; color: #0b0a0a;  padding-top: 5px; padding-bottom: 5px;">'+ chart.data.labels[i] +'</div>'+
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
            solvedProblemChartClass = solvedProblemChartPersent;
        }
        document.getElementById('legend-solved').innerHTML = solvedProblemChartClass.generateLegend();
    }
    catch (err) {
        console.warn(err);
    }
} // add charts

/**
 *   function generate new charts
 */
function setNewPosition() {

    // kill old charts
    agreePollChartClass.destroy();
    solvedProblemCirleChartClass.destroy();
    solvedProblemChartClass.destroy();
    
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
    solvedProblemCirleChartClass.update();
    solvedProblemChartClass.update();
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

        $('#solved-problem-2-chart-canvas').attr('width', 220);
        $('#solved-problem-2-chart-canvas').attr('height', 220);     

        
        $('#solved-problem-chart-canvas').attr('width', 220);
        $('#solved-problem-chart-canvas').attr('height', 220);     

        
    }
    else if ($(document).width() > 1600) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 650);
        $('#agree-poll-chart-canvas').attr('height', 280);

        $('#solved-problem-2-chart-canvas').attr('width', 210);
        $('#solved-problem-2-chart-canvas').attr('height', 210);     

        $('#solved-problem-chart-canvas').attr('width', 210);
        $('#solved-problem-chart-canvas').attr('height', 210);     
    }
    else if ($(document).width() > 1500) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 550);
        $('#agree-poll-chart-canvas').attr('height', 280);

        $('#solved-problem-2-chart-canvas').attr('width', 210);
        $('#solved-problem-2-chart-canvas').attr('height', 210); 
        
        $('#solved-problem-chart-canvas').attr('width', 210);
        $('#solved-problem-chart-canvas').attr('height', 210);     
    }
    else if ($(document).width() > 1400) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 550);
        $('#agree-poll-chart-canvas').attr('height', 280);

        
        $('#solved-problem-2-chart-canvas').attr('width', 210);
        $('#solved-problem-2-chart-canvas').attr('height', 210);   
        
        $('#solved-problem-chart-canvas').attr('width', 210);
        $('#solved-problem-chart-canvas').attr('height', 210);     
    }
    else if ($(document).width() > 1350) {
        position = 'right';
        $('#agree-poll-chart-canvas').attr('width', 400);
        $('#agree-poll-chart-canvas').attr('height', 200);


        
        $('#solved-problem-2-chart-canvas').attr('width', 200);
        $('#solved-problem-2-chart-canvas').attr('height', 200);    

        $('#solved-problem-chart-canvas').attr('width', 200);
        $('#solved-problem-chart-canvas').attr('height', 200);     
    }
    else if ($(document).width() > 1300) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 380);
        $('#agree-poll-chart-canvas').attr('height', 200);

        
        $('#solved-problem-2-chart-canvas').attr('width', 200);
        $('#solved-problem-2-chart-canvas').attr('height', 200);   

        $('#solved-problem-chart-canvas').attr('width', 200);
        $('#solved-problem-chart-canvas').attr('height', 200);     
    }
    else if ($(document).width() > 1200) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 350);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#solved-problem-2-chart-canvas').attr('width', 200);
        $('#solved-problem-2-chart-canvas').attr('height', 200);  

        $('#solved-problem-chart-canvas').attr('width', 200);
        $('#solved-problem-chart-canvas').attr('height', 200);     
        
    }
    else if ($(document).width() > 1000) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#solved-problem-2-chart-canvas').attr('width', 200);
        $('#solved-problem-2-chart-canvas').attr('height', 200);

        $('#solved-problem-chart-canvas').attr('width', 200);
        $('#solved-problem-chart-canvas').attr('height', 200);     
    }
    else if ($(document).width() > 767) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 350);
        $('#agree-poll-chart-canvas').attr('height', 350);


        $('#solved-problem-2-chart-canvas').attr('width', 150);
        $('#solved-problem-2-chart-canvas').attr('height', 150);

        $('#solved-problem-chart-canvas').attr('width', 150);
        $('#solved-problem-chart-canvas').attr('height', 150);     
    }
    else if ($(document).width() > 600) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);


        $('#solved-problem-2-chart-canvas').attr('width', 200);
        $('#solved-problem-2-chart-canvas').attr('height', 200);

        $('#solved-problem-chart-canvas').attr('width', 200);
        $('#solved-problem-chart-canvas').attr('height', 200);     

    }
    else if ($(document).width() < 600) {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#solved-problem-2-chart-canvas').attr('width', 200);
        $('#solved-problem-2-chart-canvas').attr('height', 200);


        $('#solved-problem-chart-canvas').attr('width', 200);
        $('#solved-problem-chart-canvas').attr('height', 200);     
    }
    else {
        position = 'bottom';
        $('#agree-poll-chart-canvas').attr('width', 300);
        $('#agree-poll-chart-canvas').attr('height', 200);

        $('#solved-problem-2-chart-canvas').attr('width', 200);
        $('#solved-problem-2-chart-canvas').attr('height', 200);

        $('#solved-problem-chart-canvas').attr('width', 200);
        $('#solved-problem-chart-canvas').attr('height', 200);     

    }

} // add media sizes
