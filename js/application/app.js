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
    console.log("Page INIT has been called");

    // putting this here calls it on every page; not sure if this is the right way to go
    utils.renderExternalTemplate("footer", "footer");
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
        };
    return {
      formatTemplatePath: formatTemplatePath,
        renderExternalTemplate: renderTemplate
    };
})();
