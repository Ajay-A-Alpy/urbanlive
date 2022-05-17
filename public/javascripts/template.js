(function($) {
    'use strict';
  
    $(function() {
      /* Code for attribute data-custom-class for adding custom class to tooltip */
      if (typeof $.fn.tooltip.Constructor === 'undefined') {
        throw new Error('Bootstrap Tooltip must be included first!');
      }
  
      var Tooltip = $.fn.tooltip.Constructor;
  
      // add customClass option to Bootstrap Tooltip
      $.extend(Tooltip.Default, {
        customClass: ''
      });
  
      var _show = Tooltip.prototype.show;
  
      Tooltip.prototype.show = function() {
  
        // invoke parent method
        _show.apply(this, Array.prototype.slice.apply(arguments));
  
        if (this.config.customClass) {
          var tip = this.getTipElement();
          $(tip).addClass(this.config.customClass);
        }
  
      };
      $('[data-toggle="tooltip"]').tooltip();
  
    });
  })(jQuery);

  (function($) {
    'use strict';
    $(function() {
      var todoListItem = $('.todo-list');
      var todoListInput = $('.todo-list-input');
      $('.todo-list-add-btn').on("click", function(event) {
        event.preventDefault();
  
        var item = $(this).prevAll('.todo-list-input').val();
  
        if (item) {
          todoListItem.append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox'/>" + item + "<i class='input-helper'></i></label></div><i class='remove ti-trash'></i></li>");
          todoListInput.val("");
        }
  
      });
  
      todoListItem.on('change', '.checkbox', function() {
        if ($(this).attr('checked')) {
          $(this).removeAttr('checked');
        } else {
          $(this).attr('checked', 'checked');
        }
  
        $(this).closest("li").toggleClass('completed');
  
      });
  
      todoListItem.on('click', '.remove', function() {
        $(this).parent().remove();
      });
  
    });
  })(jQuery);


  (function($) {
    'use strict';
    $(function() {
      var body = $('body');
      var contentWrapper = $('.content-wrapper');
      var scroller = $('.container-scroller');
      var footer = $('.footer');
      var sidebar = $('.sidebar');
  
      //Add active class to nav-link based on url dynamically
      //Active class can be hard coded directly in html file also as required
  
      function addActiveClass(element) {
        if (current === "") {
          //for root url
          if (element.attr('href').indexOf("index.html") !== -1) {
            element.parents('.nav-item').last().addClass('active');
            if (element.parents('.sub-menu').length) {
              element.closest('.collapse').addClass('show');
              element.addClass('active');
            }
          }
        } else {
          //for other url
          if (element.attr('href').indexOf(current) !== -1) {
            element.parents('.nav-item').last().addClass('active');
            if (element.parents('.sub-menu').length) {
              element.closest('.collapse').addClass('show');
              element.addClass('active');
            }
            if (element.parents('.submenu-item').length) {
              element.addClass('active');
            }
          }
        }
      }
  
      var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
      $('.nav li a', sidebar).each(function() {
        var $this = $(this);
        addActiveClass($this);
      })
  
      //Close other submenu in sidebar on opening any
  
      sidebar.on('show.bs.collapse', '.collapse', function() {
        sidebar.find('.collapse.show').collapse('hide');
      });
  
  
      //Change sidebar 
      $('[data-toggle="minimize"]').on("click", function() {
        body.toggleClass('sidebar-icon-only');
      });
  
      //checkbox and radios
      $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');
  
    });
  
    // focus input when clicking on search icon
    $('#navbar-search-icon').click(function() {
      $("#navbar-search-input").focus();
    });
    if ($.cookie('royal-free-banner')!="true") {
      document.querySelector('#proBanner').classList.add('d-flex');
      document.querySelector('.navbar').classList.remove('fixed-top');
    }
    else {
      document.querySelector('#proBanner').classList.add('d-none');
      document.querySelector('.navbar').classList.add('fixed-top');
    }
    
    if ($( ".navbar" ).hasClass( "fixed-top" )) {
      document.querySelector('.page-body-wrapper').classList.remove('pt-0');
      document.querySelector('.navbar').classList.remove('pt-5');
    }
    else {
      document.querySelector('.page-body-wrapper').classList.add('pt-0');
      document.querySelector('.navbar').classList.add('pt-5');
      document.querySelector('.navbar').classList.add('mt-3');
      
    }
    document.querySelector('#bannerClose').addEventListener('click',function() {
      document.querySelector('#proBanner').classList.add('d-none');
      document.querySelector('#proBanner').classList.remove('d-flex');
      document.querySelector('.navbar').classList.remove('pt-5');
      document.querySelector('.navbar').classList.add('fixed-top');
      document.querySelector('.page-body-wrapper').classList.add('proBanner-padding-top');
      document.querySelector('.navbar').classList.remove('mt-3');
      var date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000); 
      $.cookie('royal-free-banner', "true", { expires: date });
    });
    
  })(jQuery);

  (function($) {
    'use strict';
    $(function() {
      if ($('.demo-tabs').length) {
        $('.demo-tabs').pwstabs({
          effect: 'none'
        });
      }
  
      if ($('.hello_world').length) {
        $('.hello_world').pwstabs();
      }
  
      if ($('#rtl-tabs-1').length) {
        $('#rtl-tabs-1').pwstabs({
          effect: 'slidedown',
          defaultTab: 2,
          rtl: true
        });
      }
  
      if ($('#vertical-left').length) {
        $('#vertical-left').pwstabs({
          effect: 'slideleft',
          defaultTab: 1,
          containerWidth: '600px',
          tabsPosition: 'vertical',
          verticalPosition: 'left'
        });
      }
  
      if ($('#horizontal-left').length) {
        $('#horizontal-left').pwstabs({
          effect: 'slidedown',
          defaultTab: 2,
          containerWidth: '600px',
          horizontalPosition: 'bottom'
        });
      }
  
      if ($('.tickets-tab').length) {
        $('.tickets-tab').pwstabs({
          effect: 'none'
        });
      }
  
    });
  })(jQuery);

  (function($) {
    'use strict';
    $(function() {
      if ($('.demo-tabs').length) {
        $('.demo-tabs').pwstabs({
          effect: 'none'
        });
      }
  
      if ($('.hello_world').length) {
        $('.hello_world').pwstabs();
      }
  
      if ($('#rtl-tabs-1').length) {
        $('#rtl-tabs-1').pwstabs({
          effect: 'slidedown',
          defaultTab: 2,
          rtl: true
        });
      }
  
      if ($('#vertical-left').length) {
        $('#vertical-left').pwstabs({
          effect: 'slideleft',
          defaultTab: 1,
          containerWidth: '600px',
          tabsPosition: 'vertical',
          verticalPosition: 'left'
        });
      }
  
      if ($('#horizontal-left').length) {
        $('#horizontal-left').pwstabs({
          effect: 'slidedown',
          defaultTab: 2,
          containerWidth: '600px',
          horizontalPosition: 'bottom'
        });
      }
  
      if ($('.tickets-tab').length) {
        $('.tickets-tab').pwstabs({
          effect: 'none'
        });
      }
  
    });
  })(jQuery);

  (function($) {
    'use strict';
    //Open submenu on hover in compact sidebar mode and horizontal menu mode
    $(document).on('mouseenter mouseleave', '.sidebar .nav-item', function(ev) {
      var body = $('body');
      var sidebarIconOnly = body.hasClass("sidebar-icon-only");
      var sidebarFixed = body.hasClass("sidebar-fixed");
      if (!('ontouchstart' in document.documentElement)) {
        if (sidebarIconOnly) {
          if (sidebarFixed) {
            if (ev.type === 'mouseenter') {
              body.removeClass('sidebar-icon-only');
            }
          } else {
            var $menuItem = $(this);
            if (ev.type === 'mouseenter') {
              $menuItem.addClass('hover-open')
            } else {
              $menuItem.removeClass('hover-open')
            }
          }
        }
      }
    });
  })(jQuery);


  (function($) {
    'use strict';
    $(function() {
      if ($("#order-chart").length) {
        var areaData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              data: [175, 200, 130, 210, 40, 60, 25],
              backgroundColor: [
                'rgba(255, 193, 2, .8)'
              ],
              borderColor: [
                'transparent'
              ],
              borderWidth:3,
              fill: 'origin',
              label: "services"
            },
            {
              data: [175, 145, 190, 130, 240, 160, 200],
              backgroundColor: [
                'rgba(245, 166, 35, 1)'
              ],
              borderColor: [
                'transparent'
              ],
              borderWidth:3,
              fill: 'origin',
              label: "purchases"
            }
          ]
        };
        var areaOptions = {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            filler: {
              propagate: false
            }
          },
          scales: {
            xAxes: [{
              display: false,
              ticks: {
                display: true
              },
              gridLines: {
                display: false,
                drawBorder: false,
                color: 'transparent',
                zeroLineColor: '#eeeeee'
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                display: true,
                autoSkip: false,
                maxRotation: 0,
                stepSize: 100,
                min: 0,
                max: 260
              },
              gridLines: {
                drawBorder: false
              }
            }]
          },
          legend: {
            display: false
          },
          tooltips: {
            enabled: true
          },
          elements: {
            line: {
              tension: .45
            },
            point: {
              radius: 0
            }
          }
        }
        var salesChartCanvas = $("#order-chart").get(0).getContext("2d");
        var salesChart = new Chart(salesChartCanvas, {
          type: 'line',
          data: areaData,
          options: areaOptions
        });
      }
  
      if ($("#sales-chart").length) {
        var SalesChartCanvas = $("#sales-chart").get(0).getContext("2d");
        var SalesChart = new Chart(SalesChartCanvas, {
          type: 'bar',
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [{
                label: 'Offline Sales',
                data: [480, 230, 470, 210, 330],
                backgroundColor: '#8EB0FF'
              },
              {
                label: 'Online Sales',
                data: [400, 340, 550, 480, 170],
                backgroundColor: '#316FFF'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 20,
                bottom: 0
              }
            },
            scales: {
              yAxes: [{
                display: true,
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false,
                  min: 0,
                  max: 500
                }
              }],
              xAxes: [{
                stacked: false,
                ticks: {
                  beginAtZero: true,
                  fontColor: "#9fa0a2"
                },
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                  display: false
                },
                barPercentage: 1
              }]
            },
            legend: {
              display: false
            },
            elements: {
              point: {
                radius: 0
              }
            }
          },
        });
        document.getElementById('sales-legend').innerHTML = SalesChart.generateLegend();
      }
  
      if ($("#north-america-chart").length) {
        var areaData = {
          labels: ["Jan", "Feb", "Mar"],
          datasets: [{
              data: [100, 50, 50],
              backgroundColor: [
                "#71c016", "#8caaff", "#248afd",
              ],
              borderColor: "rgba(0,0,0,0)"
            }
          ]
        };
        var areaOptions = {
          responsive: true,
          maintainAspectRatio: true,
          segmentShowStroke: false,
          cutoutPercentage: 78,
          elements: {
            arc: {
                borderWidth: 4
            }
          },      
          legend: {
            display: false
          },
          tooltips: {
            enabled: true
          },
          legendCallback: function(chart) { 
            var text = [];
            text.push('<div class="report-chart">');
              text.push('<div class="d-flex justify-content-between mx-4 mx-xl-5 mt-3"><div class="d-flex align-items-center"><div class="me-3" style="width:20px; height:20px; border-radius: 50%; background-color: ' + chart.data.datasets[0].backgroundColor[0] + '"></div><p class="mb-0">Offline sales</p></div>');
              text.push('<p class="mb-0">22789</p>');
              text.push('</div>');
              text.push('<div class="d-flex justify-content-between mx-4 mx-xl-5 mt-3"><div class="d-flex align-items-center"><div class="me-3" style="width:20px; height:20px; border-radius: 50%; background-color: ' + chart.data.datasets[0].backgroundColor[1] + '"></div><p class="mb-0">Online sales</p></div>');
              text.push('<p class="mb-0">94678</p>');
              text.push('</div>');
              text.push('<div class="d-flex justify-content-between mx-4 mx-xl-5 mt-3"><div class="d-flex align-items-center"><div class="me-3" style="width:20px; height:20px; border-radius: 50%; background-color: ' + chart.data.datasets[0].backgroundColor[2] + '"></div><p class="mb-0">Returns</p></div>');
              text.push('<p class="mb-0">12097</p>');
              text.push('</div>');
            text.push('</div>');
            return text.join("");
          },
        }
        var northAmericaChartPlugins = {
          beforeDraw: function(chart) {
            var width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;
        
            ctx.restore();
            var fontSize = 3.125;
            ctx.font = "600 " + fontSize + "em sans-serif";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000";
        
            var text = "63",
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
        
            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        }
        var northAmericaChartCanvas = $("#north-america-chart").get(0).getContext("2d");
        var northAmericaChart = new Chart(northAmericaChartCanvas, {
          type: 'doughnut',
          data: areaData,
          options: areaOptions,
          plugins: northAmericaChartPlugins
        });
        document.getElementById('north-america-legend').innerHTML = northAmericaChart.generateLegend();
      }
  
    });
  })(jQuery);

  $(function() {
    /* ChartJS
     * -------
     * Data and config for chartjs
     */
    'use strict';
    var data = {
      labels: ["2013", "2014", "2014", "2015", "2016", "2017"],
      datasets: [{
        label: '# of Votes',
        data: [10, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
        fill: false
      }]
    };
    var multiLineData = {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
          label: 'Dataset 1',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: [
            '#587ce4'
          ],
          borderWidth: 2,
          fill: false
        },
        {
          label: 'Dataset 2',
          data: [5, 23, 7, 12, 42, 23],
          borderColor: [
            '#ede190'
          ],
          borderWidth: 2,
          fill: false
        },
        {
          label: 'Dataset 3',
          data: [15, 10, 21, 32, 12, 33],
          borderColor: [
            '#f44252'
          ],
          borderWidth: 2,
          fill: false
        }
      ]
    };
    var options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0
        }
      }
  
    };
    var doughnutPieData = {
      datasets: [{
        data: [30, 40, 30],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
        'Pink',
        'Blue',
        'Yellow',
      ]
    };
    var doughnutPieOptions = {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };
    var areaData = {
      labels: ["2013", "2014", "2015", "2016", "2017"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
        fill: true, // 3: no fill
      }]
    };
  
    var areaOptions = {
      plugins: {
        filler: {
          propagate: true
        }
      }
    }
  
    var multiAreaData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
          label: 'Facebook',
          data: [8, 11, 13, 15, 12, 13, 16, 15, 13, 19, 11, 14],
          borderColor: ['rgba(255, 99, 132, 0.5)'],
          backgroundColor: ['rgba(255, 99, 132, 0.5)'],
          borderWidth: 1,
          fill: true
        },
        {
          label: 'Twitter',
          data: [7, 17, 12, 16, 14, 18, 16, 12, 15, 11, 13, 9],
          borderColor: ['rgba(54, 162, 235, 0.5)'],
          backgroundColor: ['rgba(54, 162, 235, 0.5)'],
          borderWidth: 1,
          fill: true
        },
        {
          label: 'Linkedin',
          data: [6, 14, 16, 20, 12, 18, 15, 12, 17, 19, 15, 11],
          borderColor: ['rgba(255, 206, 86, 0.5)'],
          backgroundColor: ['rgba(255, 206, 86, 0.5)'],
          borderWidth: 1,
          fill: true
        }
      ]
    };
  
    var multiAreaOptions = {
      plugins: {
        filler: {
          propagate: true
        }
      },
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          }
        }]
      }
    }
  
    var scatterChartData = {
      datasets: [{
          label: 'First Dataset',
          data: [{
              x: -10,
              y: 0
            },
            {
              x: 0,
              y: 3
            },
            {
              x: -25,
              y: 5
            },
            {
              x: 40,
              y: 5
            }
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        },
        {
          label: 'Second Dataset',
          data: [{
              x: 10,
              y: 5
            },
            {
              x: 20,
              y: -30
            },
            {
              x: -25,
              y: 15
            },
            {
              x: -10,
              y: 5
            }
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }
      ]
    }
  
    var scatterChartOptions = {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }]
      }
    }
    // Get context with jQuery - using jQuery's .get() method.
    if ($("#barChart").length) {
      var barChartCanvas = $("#barChart").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      var barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: data,
        options: options
      });
    }
  
    if ($("#lineChart").length) {
      var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
      var lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: data,
        options: options
      });
    }
  
    if ($("#linechart-multi").length) {
      var multiLineCanvas = $("#linechart-multi").get(0).getContext("2d");
      var lineChart = new Chart(multiLineCanvas, {
        type: 'line',
        data: multiLineData,
        options: options
      });
    }
  
    if ($("#areachart-multi").length) {
      var multiAreaCanvas = $("#areachart-multi").get(0).getContext("2d");
      var multiAreaChart = new Chart(multiAreaCanvas, {
        type: 'line',
        data: multiAreaData,
        options: multiAreaOptions
      });
    }
  
    if ($("#doughnutChart").length) {
      var doughnutChartCanvas = $("#doughnutChart").get(0).getContext("2d");
      var doughnutChart = new Chart(doughnutChartCanvas, {
        type: 'doughnut',
        data: doughnutPieData,
        options: doughnutPieOptions
      });
    }
  
    if ($("#pieChart").length) {
      var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
      var pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: doughnutPieData,
        options: doughnutPieOptions
      });
    }
  
    if ($("#areaChart").length) {
      var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
      var areaChart = new Chart(areaChartCanvas, {
        type: 'line',
        data: areaData,
        options: areaOptions
      });
    }
  
    if ($("#scatterChart").length) {
      var scatterChartCanvas = $("#scatterChart").get(0).getContext("2d");
      var scatterChart = new Chart(scatterChartCanvas, {
        type: 'scatter',
        data: scatterChartData,
        options: scatterChartOptions
      });
    }
  
    if ($("#browserTrafficChart").length) {
      var doughnutChartCanvas = $("#browserTrafficChart").get(0).getContext("2d");
      var doughnutChart = new Chart(doughnutChartCanvas, {
        type: 'doughnut',
        data: browserTrafficData,
        options: doughnutPieOptions
      });
    }
  });