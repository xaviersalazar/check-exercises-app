$(document).ready(function () {

    const typed = () => {
        let typed1 = new Typed('#typed1', {
            strings: ['enter your github name'],
            typeSpeed: 75,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
        });
    };

    const scrollMagic = () => {
        // Main controller for ScrollMagic
        let controller = new ScrollMagic.Controller({
            globalSceneOptions: {
                triggerHook: 'onLeave'
            }
        });

        // Get all panels
        let slides = $('div.panel');

        // Add panels to the controller
        for (let i=0; i<slides.length; i++) {
            new ScrollMagic.Scene({
                triggerElement: slides[i]
            })
                .setPin(slides[i])
                .addTo(controller);
        }
    };

    // Get our repo files
    const getData = (githubName) => {
        // Return ajax response
        const getAjax = (url) => {
            return $.ajax(url)
        };

        const mainUrl = `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/`;
        const cssUrl = `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/css/`;
        const jsUrl = `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/js/`;
        let files = [];

        // Make sure we get the data first
        $.when(getAjax(mainUrl), getAjax(cssUrl), getAjax(jsUrl)).then((html, css, js) => {

            // Filter out files by .extension
            const filter = (arr, ext) => {
                arr.filter(item => {
                    if (item.name.endsWith(ext))
                        files.push(item.name);
                });
            };

            filter(html[0], '.html');
            filter(css[0], '.css');
            filter(js[0], '.js');

            missing(files);
        });

        // Check for missing exercises
        const missing = (exercises) => {

            // Difference helper method
            Array.prototype.diff = function(a) {
                return this.filter(function(i) {return a.indexOf(i) < 0;});
            };

            // Filter out files by extension
            const filter = (arr, newArr) => {
                const ext = ['.html', '.css', '.js', '.java', '.sql'];
                for (let e of ext) {
                    let temp = [];
                    arr.filter(item => {
                        if (item.endsWith(e))
                            temp.push(item);
                    });
                    newArr.push(temp);
                }
            };

            // Master array of all exercises from curriculum
            const allExercises = [
                // html + css
                'welcome.html',
                'forms.html',
                // css i
                'style.css',
                'css_selectors.html',
                'selectors.css',
                'css_box_model.html',
                'box_model.css',
                'css_positioning.html',
                'positioning.css',
                // css ii
                'media-queries.html',
                'media-queries.css',
                'grid-layout.html',
                'grid-layout.css',
                'order-pizza.html',
                // js
                'inline_js.html',
                'external_js.html',
                'external.js',
                'functions_js.html',
                'functions.js',
                'conditionals.html',
                'conditionals.js',
                'loops.html',
                'while.js',
                'for_loops.js',
                'break_and_continue.js',
                // js arrays
                'iterating_arrays_js.html',
                'iterating.js',
                'planets-js.html',
                'planets-array.js',
                'split-join.html',
                'planets-string.js',
                // js objects
                'objects.html',
                'objects.js',
                'math-js.html',
                'circle.js',
                // bom and dom
                'defuse-the-bom.html',
                'dom-query-js.html',
                'google_maps_api.html',
                // jquery
                'jquery_exercises.html',
                'konami.html',
                'jquery_faq.html',
                // jquery ajax requests
                'ajax-store.html',
                'inventory.json',
                'ajax-blog.html',
                'blog.json',
                'weather_map.html',
                // js ii
                'es6.js',
                'map-filter-reduce.js',
                'promises.js',
                // java i
                'HelloWorld.java',
                'ConsoleExercises.java',
                'ControlFlowExercises.java',
                'StringExercise.java',
                'MethodsExercises.java',
                'HighLow.java',
                // java ii
                'Person.java',
                'Input.java',
                'Circle.java',
                'CircleApp.java',
                'ServerNameGenerator.java',
                'Movie.java',
                'MoviesArray.java',
                'MoviesApplication.java',
                'Rectangle.java',
                'Square.java',
                'ShapesTest.java',
                'Shape.java',
                'Measurable.java',
                'Quadrilateral.java',
                'Student.java',
                'GradesApplication.java',
                'albums_migration.sql',
                'albums_seeder.sql',
                'aliases_exercises.sql',
                'delete_exercises.sql',
                'functions_exercises.sql',
                'group_by_exercises.sql',
                'join_exercises.sql',
                'limit_exercises.sql',
                'order_by_exercises.sql',
                'select_exercises.sql',
                'subqueries_exercises.sql',
                'update_exercises.sql',
                'where_exercises.sql'];

            // Find missing exercises
            const missing = allExercises.diff(exercises);
            const missingByExt = [];

            filter(missing, missingByExt);
            showMissing(missingByExt);
        };
    };

    // Show the missing exercises
    const showMissing = (all) => {
        // Create the div
        const create = (arr, selector) => {
            for (let item of arr) {
                let div = (
                    '<div class="col-6">' +
                    '<h5 class="text-center">' + item + '</h5>' +
                    '</div>'
                );
                selector.append(div);
            }
        };

        const rows = [$('#html'), $('#css'), $('#js'), $('#java'), $('#sql')];
        const selectors = [$('#html-row:last'), $('#css-row:last'), $('#js-row:last'), $('#java-row:last'), $('#sql-row:last')];

        // Only create div if you have missing items
        for (let ext of all) {
            if (ext.length === 0)
                rows[all.indexOf(ext)].remove();
            else
                create(ext, selectors[all.indexOf(ext)])
        }

        // Animations
        scrollMagic();
        $('#arrow').animate({
            opacity: 1
        }, 5000);
    };

    typed();

    $('#check-exercises').click(() => {
        // Check for empty input
        if ($('#repo').val() === '') {
            $('#empty').animate({
                opacity: 1
            }, 2000, () => {
                $('#empty').animate({
                    opacity: 0
                }, 5000);
            });
        }
        else {
            // Attempt the ajax request
            $.ajax({
                url: `https://api.github.com/repos/${$('#repo').val()}/codeup-web-exercises/contents/`,
                error: () => {
                    $('#invalid').animate({
                        opacity: 1
                    }, 2000, () => {
                        $('#invalid').animate({
                            opacity: 0
                        }, 5000);
                    });
                    $('#repo').val('');
                },
                success: () => {
                    $('#get-repo').css('display', 'none');
                    $('#missing').css('display', 'inline-block');
                    getData($('#repo').val());
                }
            });
        }
    });
});