console.log("This is from dropdown.js");

$('.navigation').bind('click', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    $('.top-down-navigation').slideToggle('slow');
});