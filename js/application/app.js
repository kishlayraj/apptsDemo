// Overwrite jQuery Mobile defaults
$(document).bind("mobileinit", function() {
    $.mobile.allowCrossDomainPages = true;
});

var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        app.report('deviceready');
    },
    report: function(id) {
        console.log("report:" + id);
        //navigator.notification.alert("Cordova is working");
    }
};

$(document).bind("pageinit", function() {
    // putting this here calls it on every page; not sure if this is the right way to go
    utils.renderExternalTemplate("footer", "footer");
});

$(document).delegate("#my-appointments", "pageinit", function() { /* Only runs when #my-appointments page is loaded */
    utils.getAppointments();

    var showmore = false;
    $('.desc').live("click", function(event) {
        event.preventDefault(); // Stops jQuery mobile from reloading the index page.
        event.stopImmediatePropagation();

        if (this.showmore) {
            $(this).animate({
                height: '20px'
            });
        } else {
            $(this).animate({
                height: '100%'
            });
        }
        this.showmore = !this.showmore;
    });

    // Get more appointments when reaching the end of the page.
    $(window).bind('scrollstart', function() {
        if (utils.isAtBottom()) {
            if (utils.lazyLoading === false) {
                // Add a loading spinner first so that the user knows we are working on it.
                $('#appointmentList').append('<li class="loading"><div id="canvasLoader"></div></li>');
                utils.loadingSpinner();
                $('#appointmentList').listview('refresh');
                $.mobile.silentScroll($.mobile.activePage.height());
                utils.lazyLoading = true;
                utils.getAppointments(); // TODO: Pass the next page argument i.e. getAppointments(nextPage);
            }
        }
    });
});

/* 
 * renderExternalTemplate function to use with jsrender
 * put external templates in the templates folder
 * name them _templateName.tmpl.html
 * from http://msdn.microsoft.com/en-us/magazine/hh975379.aspx 
 */
var utils = (function() {
        formatTemplatePath = function(name) {
            return "/templates/_" + name + ".tmpl.html";
        },
        renderTemplate = function(tmplName, targetSelector, data) {
            var file = formatTemplatePath(tmplName);
            $.get(file, null, function(template) {
                var tmpl = $.templates(template);
                var htmlString = tmpl.render(data);
                if (targetSelector) {
                    $(targetSelector).html(htmlString);
                }
                return htmlString;
            });
        },
        getAppointments = function() {
            console.log("Called getAppointments()");
            $.ajax({
                type: "GET",
                url: "http://api.informulate.com/api/appointments"
            }).done(function(data) {
                $.each(data, function(i, current) {
                    $('#appointmentList').append('<li>' + '<img src="http://api.informulate.com/img/instructors/' + current.instructor.image + '" />' + '<h4>' + current.name + ' ' + '</h4>' + '<p class="ui-li-desc"><strong>' + current.date.date + '</strong></p>' + '<p class="desc"> ' + current.Description + '</p></li>');
                    if (i == 9) return false;
                });
                $('.loading').remove(); // Finished loading.... remove the spinner.
                $('#appointmentList').listview('refresh'); // Refreshes the jquery mobile list view after appending.
                utils.lazyLoading = false; // Prevents getAppointments from firing during callback.
            });
        },
        isAtBottom = function() {
            var totalHeight, currentScroll, visibleHeight;

            if (document.documentElement.scrollTop) {
                currentScroll = document.documentElement.scrollTop;
            } else {
                currentScroll = document.body.scrollTop;
            }

            totalHeight = $.mobile.activePage.height();
            visibleHeight = document.documentElement.clientHeight;

            console.log('total height: ' + totalHeight + ' ' + 'visibleHeight : ' + visibleHeight + ' ' + 'currentScroll:' + currentScroll);
            return (totalHeight <= currentScroll + visibleHeight);
        },
        loadingSpinner = function() {
            var cl = new CanvasLoader('canvasLoader');
            cl.setShape('roundRect'); // default is 'oval'
            cl.setDensity(11); // default is 40
            cl.setSpeed(1); // default is 2
            cl.show(); // Hidden by default
        },
        lazyLoading = false;
    return {
        formatTemplatePath: formatTemplatePath,
        renderExternalTemplate: renderTemplate,
        getAppointments: getAppointments,
        isAtBottom: isAtBottom,
        loadingSpinner: loadingSpinner
    };
})();