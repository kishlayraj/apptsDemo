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

$(document).bind("pageinit", function () {
    // putting this here calls it on every page; not sure if this is the right way to go
    utils.renderExternalTemplate("footer", "footer");
});

$(document).delegate("#my-appointments", "pageinit", function () {
    /* Only runs when #my-appointments page is loaded */
    utils.getAppointments();

    var showmore = false;
    $('.desc').live("click", function (event) {
        event.preventDefault(); // Stops jQuery mobile from reloading the index page.
        event.stopImmediatePropagation();

        if (this.showmore) {
            $(this).animate({height:'20px'});
        }
        else {
            $(this).animate({height:'100%'});
        }
        this.showmore = !this.showmore;
    });

    // Get more appointments when reaching the end of the page.
    $(window).bind('scrollstart', function () {
        if (utils.isAtBottom()) {
           console.log('utils.lazyLoading = ' + utils.lazyLoading);
            if (utils.lazyLoading === false) {
                utils.getAppointments(); // TODO: Pass the next page argument i.e. getAppointments(nextPage);
                utils.lazyLoading = true; // TODO: Display a progress icon so that the user knows we are loading new appointments.
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
utils = (function () {
    var
        formatTemplatePath = function (name) {
            return "/templates/_" + name + ".tmpl.html";
        },
        renderTemplate = function (tmplName, targetSelector, data) {
            var file = formatTemplatePath(tmplName);
            $.get(file, null, function (template) {
                var tmpl = $.templates(template);
                var htmlString = tmpl.render(data);
                if (targetSelector) {
                    $(targetSelector).html(htmlString);
                }
                return htmlString;
            });
        },
        getAppointments = function () {
            console.log("Called getAppointments()");
            // Add a loading spinner first so that the user knows we are working on it.
            $('#appointmentList').append('<li class="loading"></li>');
            $('#appointmentList').listview('refresh');
            $.ajax({
                type:"GET",
                url:"http://api.informulate.com/api/appointments"
            }).done(function (data) {
                    $.each(data, function (i, val) {
                        $('#appointmentList').append('<li>' +
                            '<img src="http://www.newwinechurch.com/wp-content/uploads/2011/06/Sunrise.jpg' + '" height="40px" width="60px"/>' +
                            '<h4>' + val.name + ' ' + '</h4>' +
                            '<p>' + val.date.date + '</p>' +
                            '<div style="height:20px;overflow:hidden" class="desc"> ' + val.Description + '</div></li>');
                        if (i == 9)
                            return false;
                    });
                    $('.loading').hide(); // Finished loading.... hide the spinner.
                    $('#appointmentList').listview('refresh'); // Refreshes the jquery mobile list view after appending.
                    utils.lazyLoading = false; // Prevents getAppointments from firing during callback.
                });
        },
        isAtBottom = function () {
            var totalHeight, currentScroll, visibleHeight;

            if (document.documentElement.scrollTop) {
                currentScroll = document.documentElement.scrollTop;
            } else {
                currentScroll = document.body.scrollTop;
            }

            totalHeight = $.mobile.activePage.height();
            visibleHeight = document.documentElement.clientHeight;

            console.log('total height: ' + totalHeight + ' ' + 'visibleHeight : ' + visibleHeight + ' ' + 'currentScroll:' + currentScroll);
            return (totalHeight <= currentScroll + visibleHeight );
        }, lazyLoading = false;
    return {
        formatTemplatePath:formatTemplatePath,
        renderExternalTemplate:renderTemplate,
        getAppointments:getAppointments,
        isAtBottom:isAtBottom
    };
})();