$(function() {
    $('#slide-three-title').hide();
    $('#slide-three-introducing').hide();
    $('#slide-three-politik').hide();
    $('#fullpage').fullpage({
        afterLoad: function(anchor, index) {
            if (index === 2) {
                $('#search').typed({
                    strings: ["Search", "Get"],
                    typeSpeed: 60,
                    backSpeed: 60,
                    startDelay: 200,
                    backDelay: 1500,
                    callback: function() {
                        $('#need').fadeTo(500, 0, function() {
                            $('#need').html('Want')
                            setTimeout(function() {
                                $('#need').fadeTo(500, 1)
                            }, 500)
                        })
                    }
                });
            }
        }
    });
});
