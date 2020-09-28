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
                <h3>SVG fragments</h3>
                <object data="svgfragments/circles.svg" type="image/svg+xml">
                    <span class="fragment" data-selector="#circle0"></span>
                    <span class="fragment" data-selector="#circle1"></span>
                    <span class="fragment" data-selector="#circle2"></span>
                </object>
            </section>
            <section>
                <h3>SVG fragment effects</h3>
                <object data="svgfragments/circles.svg" type="image/svg+xml">
                    <span class="fragment fade-out" data-selector="#circle0"></span>
                    <span class="fragment fade-up" data-selector="#circle1"></span>
                    <span class="fragment fade-down" data-selector="#circle2"></span>
                </object>
            </section>
            <section>
                <h3>Nested SVG fragments</h3>
                <object data="svgfragments/circles.svg" type="image/svg+xml">
                    <span class="fragment fade-in" data-selector="#circle0">
                      <span class="fragment fade-out" data-selector="#circle0"></span>
                    </span>
                    <span class="fragment fade-up" data-selector="#circle1"></span>
                    <span class="fragment fade-down" data-selector="#circle2"></span>
                </object>
            </section>
            <section>
                <h3>SVG fragment ordering</h3>
                <object data="svgfragments/circles.svg" type="image/svg+xml">
                    <span class="fragment" data-fragment-index="2" data-selector="#circle0"></span>
                    <span class="fragment" data-fragment-index="1" data-selector="#circle1"></span>
                    <span class="fragment" data-fragment-index="3" data-selector="#circle2"></span>
                </object>
            </section>
            <section>
                <h3>HTML and SVG fragments</h3>
                <ul>
                    <li class="fragment">HTML fragment 0</li>
                    <li class="fragment">HTML fragment 1</li>
                </ul>
                <object data="svgfragments/circles.svg" type="image/svg+xml">
                    <span class="fragment" data-selector="#circle0"></span>
                    <span class="fragment" data-selector="#circle1"></span>
                    <span class="fragment" data-selector="#circle2"></span>
                </object>
            </section>
            <section>
                <h3>Everything!</h3>
                <ul>
                    <li class="fragment" data-fragment-index="1">HTML fragment 0</li>
                    <li class="fragment" data-fragment-index="5">HTML fragment 1</li>
                </ul>
                <object data="svgfragments/circles.svg" type="image/svg+xml">
                    <span class="fragment fade-in" data-fragment-index="2" data-selector="#circle0">
                      <span class="fragment fade-out" data-fragment-index="4" data-selector="#circle0"></span>
                    </span>
                    <span class="fragment fade-up" data-fragment-index="0" data-selector="#circle1"></span>
                    <span class="fragment fade-down" data-fragment-index="3" data-selector="#circle2"></span>
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
