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

$(document).bind("pagechange", function(ev, data) {
    var pathname = (window.location.hash) ? window.location.hash.substr(1) : window.location.pathname;
    
    // if dialog page leave page setup
    if (data.toPage.find('[data-page=dialog]').length > 0) { return; }

    // if data-script defined, load in specific javascript for the page in question
    if (data.toPage.find('[data-script]').length > 0) {

        // if previous page "pageunload" event defined, fire it then remove it
        if (window.pageunload) {
            window.pageunload();
            delete window.unload;
        }

        // turn off all events associated with a page just in case
        $('body').off('.page');

        // now getting the page-level javascript
        $.getScript(data.toPage.find('[data-script]').data('script'), function () {
            
            // fires the page load event if the new javascript for the page defined it
            if (window.pageload) {
                window.pageload();
                delete window.pageload;
            }
        });
    }
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