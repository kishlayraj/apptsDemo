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

var menuStatus = menuStatus || false;

function onBodyLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

Navigation = {
    Initialise:function () {
        $(":jqmData(role='page')").on("pageshow", function (event) {

            console.log("Current Status: " + menuStatus);

            /* Sidebar Control */
            $(".controls a").click(function () {
                console.log("Clicked event fired...");
                if (menuStatus != true) {
                    $(".ui-page-active .main, .ui-header-fixed").animate({
                        marginLeft:"260px"
                    }, 300, function () {
                        menuStatus = true
                    });
                    console.log("menuStatus is false...");
                    return false;
                } else {
                    $(".ui-page-active .main, .ui-header-fixed").animate({
                        marginLeft:"0px"
                    }, 300, function () {
                        menuStatus = false
                    });
                    console.log("menuStatus is true...");
                    return false;
                }
            });
        });
    }
};

function viewTemplate() {
    this.getPath = function (name) {
        console.log("Loading " + name);
        return './templates/_' + name + '.tmpl.html';
    },
        this.renderExternalTemplate = function (item) {
            var file = this.getPath(item.name);

            console.log(file);
            $.when($.get(file))
                .done(function (tmplData) {
                    $.templates({ tmpl:tmplData });
                    console.log($.render.tmpl(item.data));
                    $(item.selector).html(
                        // This .render.tmpl() does not work on phonegap :( --jesusOmar
                        $.render.tmpl(item.data)
                    );
                    console.log("Done");
                });
        }
}


$(document).bind("pageinit", function () {
    console.log("Page INIT has been called");
    //var template = new viewTemplate(); // Function is broken... --jesusOmar

    var menu = [
        { name:"Home", url:"index.html" },
        { name:"My Account", url:"my-account.html" },
        { name:"My Appointments", url:"my-appointments.html" }
    ];

    // TODO: Figure out how to read new menu items from each individual pages.

    //template.renderExternalTemplate({ name:'menuTemplate', selector:'.navigation', data:menu }); // Function is broken... --jesusOmar

    $(".navigation").html(
        $("#menuTemplate").render(menu)
    );

    Navigation.Initialise();
});

/* When this function is called, Cordova has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
function onDeviceReady() {
    navigator.notification.alert("Cordova is working");
}