console.log("This is from dropdown.js");

$('.navigation-dropdown').bind('change', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    $.mobile.changePage($(this).find("option:selected").val());
});