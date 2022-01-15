jQuery(function ($) {
    // use jQuery code inside this to avoid "$ is not defined" error
    $(document).on("change", "#filter", function () {
        var filter = $("#filter");
        $.ajax({
            url: filter.attr("action"),
            data: filter.serialize(), // form data
            type: filter.attr("method"), // POST
            beforeSend: function (xhr) {
                filter.find(".loader").addClass("show"); // changing the button label
            },
            success: function (data) {
                $("#response").html(data); // insert data
                filter.find(".loader").removeClass("show");
                misha_loadmore_params.current_page = 1;
            },
        });
        return false;
    });

    $(document).on("click", ".misha_loadmore", function () {
        var catFilter = 0;
        if ($("[name=categoryfilter]:checked").size()) {
            catFilter = $("[name=categoryfilter]:checked").val().trim();
        }
        var button = $(this),
            data = {
                action: "loadmore",
                query: misha_loadmore_params.posts, // that's how we get params from wp_localize_script() function
                page: misha_loadmore_params.current_page,
                categoryfilter: catFilter,
            };
        $.ajax({
            // you can also use $.post here
            url: misha_loadmore_params.ajaxurl, // AJAX handler
            data: data,
            type: "POST",
            beforeSend: function (xhr) {
                button.text("Loading..."); // change the button text, you can also add a preloader image
            },
            success: function (data) {
                if (data) {
                    button.text("More posts").before(data);
                    misha_loadmore_params.current_page++;

                    if (
                        misha_loadmore_params.current_page == misha_loadmore_params.max_page
                    )
                        button.remove(); // if last page, remove the button

                    // you can also fire the "post-load" event here if you use a plugin that requires it
                    // $( document.body ).trigger( 'post-load' );
                } else {
                    button.remove(); // if no data, remove the button as well
                }
            },
        });
    });
});

//https://rudrastyh.com/wordpress/load-more-posts-ajax.html
