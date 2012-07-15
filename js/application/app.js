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

Navigation = {
    Initialise:function () {
        $(":jqmData(role='page')").on("pageshow", function (event) {
            var menuStatus;
            menuStatus = false;
            /* Sidebar Control */
            $(".controls a").click(function () {
                if (menuStatus != true) {
                    $(".ui-page-active, .ui-header-fixed").animate({
                        marginLeft:"250px",
                    }, 300, function () {
                        menuStatus = true
                    });
                    return false;
                } else {
                    $(".ui-page-active, .ui-header-fixed").animate({
                        marginLeft:"0px",
                    }, 300, function () {
                        menuStatus = false
                    });
                    return false;
                }
            });
        });
    }
};

function viewTemplate() {
    this.getPath = function (name) {
        return '../../templates/_' + name + '.tmpl.html';
    },
        this.renderExternalTemplate = function (item) {
            var file = this.getPath(item.name);

            $.when($.get(file))
                .done(function (tmplData) {
                    $.templates({ tmpl:tmplData });
                    $(item.selector).html($.render.tmpl(item.data));
                });
        }
}


$(document).bind("pageinit", function () {
    var template = new viewTemplate();

    var menu = [
        { name:"Home", url:"index.html" },
        { name:"My Account", url:"my-account.html" },
        { name:"My Appointments", url:"my-appointments.html" }
    ];

    // TODO: Figure out how to read new menu items from each individual pages.

    template.renderExternalTemplate({ name:'menuTemplate', selector:'#navigation', data:menu });

    Navigation.Initialise();
});

/* When this function is called, Cordova has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
function onDeviceReady() {
    // do your thing!
    var template = new viewTemplate();

    var menu = [
        { name:"Home", url:"index.html" },
        { name:"My Account", url:"my-account.html" },
        { name:"My Appointments", url:"my-appointments.html" }
    ];

    // TODO: Figure out how to read new menu items from each individual pages.

    template.renderExternalTemplate({ name:'menuTemplate', selector:'#navigation', data:menu });

    Navigation.Initialise();
    navigator.notification.alert("Cordova is working");
}