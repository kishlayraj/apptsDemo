// If you want to prevent dragging, uncomment this section
/*
 function preventBehavior(e)
 {
 e.preventDefault();
 };
 document.addEventListener("touchmove", preventBehavior, false);
 */

/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
/*
 function handleOpenURL(url)
 {
 // TODO: do something with the url passed in.
 }
 */

function onBodyLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

$(document).bind("pageinit", function () {
    // putting this here calls it on every page; not sure if this is the right way to go
    utils.renderExternalTemplate("footer", "footer");
});

$(document).delegate("#my-appointments", "pageinit", function () {
    /* Only runs when #my-appointments page is loaded */
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
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
    var alreadyLoading = false;

    $(window).bind('scrollstart', function () {
        //if ($(window).scrollTop() >= ($('body').height() * 0.9)) { // TODO: $('body').height() is not been reset after appending to the viewport.
            if (utils.isAtBottom()) {
                if (alreadyLoading == false) {
                    alreadyLoading = true; // TODO: Reset alreadyLoading after appointments finish loading.
                    utils.getAppointments(); // TODO: Pass the next page argument i.e. getAppointments(nextPage);
                }
            }
       // }
    });
});

/* When this function is called, Cordova has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
function onDeviceReady() {
    navigator.notification.alert("Cordova is working");
}

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

                    $('#appointmentList').listview('refresh'); // Refreshes the jquery mobile list view after appending.
                });
        },
        isAtBottom = function () {
            var totalHeight, currentScroll, visibleHeight;

            if (document.documentElement.scrollTop) {
                currentScroll = document.documentElement.scrollTop;
            } else {
                currentScroll = document.body.scrollTop;
            }

            totalHeight = document.body.offsetHeight; // TODO: This never gets reset.
            bodyHeight = $('body').height();
            visibleHeight = document.documentElement.clientHeight;

            console.log('total height: ' + totalHeight + ' ' + 'visibleHeight : ' + visibleHeight + ' ' + 'currentScroll:' + currentScroll + ' bodyHeight:' + bodyHeight);
            return (totalHeight <= currentScroll + visibleHeight );
        };
    return {
        formatTemplatePath:formatTemplatePath,
        renderExternalTemplate:renderTemplate,
        getAppointments:getAppointments,
        isAtBottom:isAtBottom
    };
})();