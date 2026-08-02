/* =========================================================
   TOOLNEX — FINAL MASTER JAVASCRIPT
   Version 2.0
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       1. MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        const closeMenu = () => {

            navLinks.classList.remove("open");

            menuToggle.textContent = "☰";

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        };


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen =
                navLinks.classList.toggle("open");

            menuToggle.textContent =
                isOpen ? "✕" : "☰";

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                closeMenu();
            });

        });


        document.addEventListener("click", (event) => {

            if (
                navLinks.classList.contains("open") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });


        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* =====================================================
       2. TOOL DATABASE
    ===================================================== */

    const tools = [

        {
            name: "PDF Tools",
            category: "PDF",
            description:
                "Merge, split, compress and work with PDF files.",
            icon: "📄",
            url: "pdf-tools.html",
            keywords:
                "pdf document documents merge split compress combine pages"
        },

        {
            name: "Image Tools",
            category: "Images",
            description:
                "Resize, compress and transform images.",
            icon: "🖼️",
            url: "image-tools.html",
            keywords:
                "image images photo photos picture resize compress crop"
        },

        {
            name: "Text Tools",
            category: "Text",
            description:
                "Count, clean and transform your text.",
            icon: "✍️",
            url: "text-tools.html",
            keywords:
                "text writing words characters clean transform format"
        },

        {
            name: "Converters",
            category: "Converters",
            description:
                "Convert units and values in seconds.",
            icon: "🔄",
            url: "converters.html",
            keywords:
                "converter conversion convert units values calculate"
        },

        {
            name: "Word Counter",
            category: "Text",
            description:
                "Count words and characters quickly.",
            icon: "🔢",
            url: "text-tools.html",
            keywords:
                "word words counter count character characters letters"
        },

        {
            name: "Text Case Converter",
            category: "Text",
            description:
                "Change text capitalization easily.",
            icon: "🔠",
            url: "text-tools.html",
            keywords:
                "case uppercase lowercase capitalize text capitalization"
        },

        {
            name: "Image Resizer",
            category: "Images",
            description:
                "Resize images to the dimensions you need.",
            icon: "📐",
            url: "image-tools.html",
            keywords:
                "image resize resizer dimensions width height size"
        },

        {
            name: "Unit Converter",
            category: "Converters",
            description:
                "Convert common units quickly and easily.",
            icon: "🌡️",
            url: "converters.html",
            keywords:
                "unit units converter length weight temperature distance"
        }

    ];


    /* =====================================================
       3. SEARCH ELEMENTS
    ===================================================== */

    const searchInput =
        document.getElementById("toolSearch");

    const searchButton =
        document.getElementById("searchButton");

    const searchResults =
        document.getElementById("searchResults");

    const toolSearch =
        document.querySelector(".tool-search");


    /* =====================================================
       4. CREATE SEARCH RESULT
    ===================================================== */

    function createSearchResult(tool) {

        /*
         * IMPORTANT:
         * Entire result is an <a>.
         * Therefore user can tap/click ANYWHERE
         * on the result card to open the tool.
         */

        const result =
            document.createElement("a");

        result.className = "search-result";

        result.href = tool.url;

        result.setAttribute(
            "aria-label",
            `Open ${tool.name}`
        );


        const icon =
            document.createElement("div");

        icon.className =
            "search-result-icon";

        icon.textContent =
            tool.icon;


        const content =
            document.createElement("div");

        content.className =
            "search-result-content";


        const title =
            document.createElement("h3");

        title.textContent =
            tool.name;


        const description =
            document.createElement("p");

        description.textContent =
            tool.description;


        const category =
            document.createElement("span");

        category.className =
            "search-result-category";

        category.textContent =
            tool.category;


        content.appendChild(title);

        content.appendChild(description);

        content.appendChild(category);


        const arrow =
            document.createElement("div");

        arrow.className =
            "search-result-arrow";

        arrow.textContent =
            "→";


        result.appendChild(icon);

        result.appendChild(content);

        result.appendChild(arrow);


        return result;

    }


    /* =====================================================
       5. DISPLAY SEARCH RESULTS
    ===================================================== */

    function displayResults(results) {

        if (!searchResults) {
            return;
        }


        searchResults.replaceChildren();


        if (results.length === 0) {

            const noResults =
                document.createElement("div");

            noResults.className =
                "no-results";

            noResults.textContent =
                "No tools found. Try another search.";

            searchResults.appendChild(
                noResults
            );

            return;

        }


        const fragment =
            document.createDocumentFragment();


        results.forEach(tool => {

            fragment.appendChild(
                createSearchResult(tool)
            );

        });


        searchResults.appendChild(
            fragment
        );

    }


    /* =====================================================
       6. SEARCH FUNCTION
    ===================================================== */

    function performSearch() {

        if (
            !searchInput ||
            !searchResults
        ) {
            return;
        }


        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        /*
         * Empty search = hide results.
         */

        if (!query) {

            searchResults.replaceChildren();

            return;

        }


        const results =
            tools.filter(tool => {

                const searchableText = [

                    tool.name,

                    tool.category,

                    tool.description,

                    tool.keywords

                ]
                    .join(" ")
                    .toLowerCase();


                /*
                 * Supports:
                 * PDF
                 * pdf tools
                 * image
                 * resize
                 * text
                 * word
                 * converter
                 * etc.
                 */

                return searchableText.includes(query);

            });


        displayResults(results);

    }


    /* =====================================================
       7. SEARCH BUTTON
    ===================================================== */

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            performSearch
        );

    }


    /* =====================================================
       8. LIVE SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            performSearch
        );


        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performSearch();

                }


                if (event.key === "Escape") {

                    searchInput.value = "";

                    if (searchResults) {
                        searchResults.replaceChildren();
                    }

                    searchInput.blur();

                }

            }
        );

    }


    /* =====================================================
       9. WHOLE SEARCH BOX CLICK = FOCUS
    ===================================================== */

    if (
        toolSearch &&
        searchInput
    ) {

        toolSearch.addEventListener(
            "click",
            (event) => {

                /*
                 * If user clicks the search button,
                 * don't interfere with the button.
                 */

                if (
                    searchButton &&
                    searchButton.contains(event.target)
                ) {
                    return;
                }


                searchInput.focus();

            }
        );

    }


    /* =====================================================
       10. CURRENT PAGE ACTIVE NAVIGATION
    ===================================================== */

    if (navLinks) {

        let currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        /*
         * GitHub Pages root:
         * /TOOLNEX/
         *
         * Treat it as index.html.
         */

        if (
            !currentPage ||
            currentPage === "toolnex"
        ) {
            currentPage = "index.html";
        }


        navLinks
            .querySelectorAll("a")
            .forEach(link => {

                const href =
                    link.getAttribute("href");


                if (!href) {
                    return;
                }


                const linkPage =
                    href
                        .split("/")
                        .pop()
                        .split("#")[0]
                        .toLowerCase();


                if (
                    linkPage &&
                    linkPage === currentPage
                ) {

                    link.classList.add("active");

                }

            });

    }


    /* =====================================================
       11. SMOOTH INTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    let target = null;


                    try {

                        target =
                            document.querySelector(
                                targetId
                            );

                    } catch (error) {

                        return;

                    }


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }

                }
            );

        });


    /* =====================================================
       12. CONTACT FORM
    ===================================================== */

    const contactForm =
        document.querySelector(
            ".contact-form"
        );

    const formMessage =
        document.querySelector(
            ".form-message"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                if (formMessage) {

                    formMessage.textContent =
                        "Thanks! Your message has been received.";

                }


                contactForm.reset();

            }
        );

    }


    /* =====================================================
       13. SEARCH RESULT KEYBOARD ACCESS
    ===================================================== */

    if (searchResults) {

        searchResults.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    const result =
                        event.target.closest(
                            ".search-result"
                        );


                    if (result) {

                        event.preventDefault();

                        result.click();

                    }

                }

            }
        );

    }


    /* =====================================================
       14. RESET SEARCH RESULTS ON PAGE LOAD
    ===================================================== */

    if (searchResults) {

        searchResults.replaceChildren();

    }


    /* =====================================================
       15. PREVENT BROKEN SEARCH BUTTON SUBMIT
    ===================================================== */

    if (searchButton) {

        const searchForm =
            searchButton.closest("form");


        if (searchForm) {

            searchForm.addEventListener(
                "submit",
                (event) => {

                    event.preventDefault();

                    performSearch();

                }
            );

        }

    }


    /* =====================================================
       16. RESIZE SAFETY — CLOSE MOBILE MENU
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 760 &&
                navLinks &&
                menuToggle
            ) {

                navLinks.classList.remove(
                    "open"
                );

                menuToggle.textContent =
                    "☰";

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            }

        }
    );


});
