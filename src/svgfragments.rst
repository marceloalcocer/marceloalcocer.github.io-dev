SVGFragments demo
##################

`SVGFragments <https://github.com/marceloalcocer/reveal-svgfragments>`_ is a plugin for the `reveal.js <https://revealjs.com>`_ presentation framework which allows SVG elements to be used as fragments.

.. raw:: html

    <link rel="stylesheet" href="svgfragments/dist/reveal.css">
    <link rel="stylesheet" href="svgfragments/dist/theme/black.css" id="theme">
    <div class="reveal" style="width: 100%; height: 300px;">
        <div class="slides">
            <section>
                <h1>SVGFragments demo</h1>
            </section>
            <section>
                <h3>SVG fragments with effects and ordering</h3>
                <object data="svgfragments/circles.svg" type="image/svg+xml">
                    <span class="svg-fragment fade-in" data-fragment-index="2" data-selector="#circle0"></span>
                    <span class="svg-fragment fade-up" data-fragment-index="1" data-selector="#circle1"></span>
                    <span class="svg-fragment fade-down" data-fragment-index="3" data-selector="#circle2"></span>
                </object>
            </section>
        </div>
    </div>
    <script src="svgfragments/dist/reveal.js"></script>
    <script src="svgfragments/plugin/svgfragments/svgfragments.js"></script>
    <script>
        Reveal.initialize(
            {
                embedded: true,
                keyboardCondition: "focused",
                plugins: [SVGFragments]
            } 
        );
    </script>
