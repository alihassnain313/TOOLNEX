/* =========================================================
TOOLNEX — FINAL JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
   1. MOBILE NAVIGATION
===================================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("open");

        const isOpen = navLinks.classList.contains("open");

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });


    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            menuToggle.textContent = "☰";

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );

        });

    });

}


/* =====================================================
   2. TOOL DATABASE
   ===================================================== */

const tools = [

    {
        name: "PDF Tools",
        category: "PDF",
        description: "Merge, split, compress and work with PDF files.",
        icon: "📄",
        url: "pdf-tools.html",
        keywords: "pdf document documents merge split compress"
    },

    {
        name: "Image Tools",
        category: "Images",
        description: "Resize, compress and transform images.",
        icon: "🖼️",
        url: "image-tools.html",
        keywords: "image images photo photos resize compress picture"
    },

    {
        name: "Text Tools",
        category: "Text",
        description: "Count, clean and transform your text.",
        icon: "✍️",
        url: "text-tools.html",
        keywords: "text writing words characters clean transform"
    },

    {
        name: "Converters",
        category: "Converters",
        description: "Convert units and values in seconds.",
        icon: "🔄",
        url: "converters.html",
        keywords: "converter conversion convert units values"
    },

    {
        name: "Word Counter",
        category: "Text",
        description: "Count words and characters quickly.",
        icon: "🔢",
        url: "text-tools.html",
        keywords: "word words counter count character characters"
    },

    {
        name: "Text Case Converter",
        category: "Text",
        description: "Change text capitalization easily.",
        icon: "🔠",
        url: "text-tools.html",
        keywords: "case uppercase lowercase capitalize text"
    },

    {
        name: "Image Resizer",
        category: "Images",
        description: "Resize images to the dimensions you need.",
        icon: "📐",
        url: "image-tools.html",
        keywords: "image resize resizer dimensions width height"
    },

    {
        name: "Unit Converter",
        category: "Converters",
        description: "Convert common units quickly and easily.",
        icon: "🌡️",
        url: "converters.html",
        keywords: "unit units converter length weight temperature"
    }

];


/* =====================================================
   3. SEARCH ELEMENTS
   ===================================================== */

const searchInput = document.getElementById("toolSearch");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");


/* =====================================================
   4. CREATE SEARCH RESULT
   ===================================================== */

function createSearchResult(tool) {

    const result = document.createElement("a");

    result.className = "search-result";

    result.href = tool.url;

    result.setAttribute(
        "aria-label",
        `Open ${tool.name}`
    );


    result.innerHTML = `

        <div class="search-result-icon">
            ${tool.icon}
        </div>

        <div class="search-result-content">

            <h3>
                ${tool.name}
            </h3>

            <p>
                ${tool.description}
            </p>

            <span class="search-result-category">
                ${tool.category}
            </span>

        </div>

        <div class="search-result-arrow">
            →
        </div>

    `;


    return result;

}


/* =====================================================
   5. DISPLAY SEARCH RESULTS
===================================================== */

function displayResults(results) {

    if (!searchResults) {
        return;
    }


    searchResults.innerHTML = "";


    if (results.length === 0) {

        const noResults = document.createElement("div");

        noResults.className = "no-results";

        noResults.textContent =
            "No tools found. Try another search.";

        searchResults.appendChild(noResults);

        return;

    }


    results.forEach(tool => {

        searchResults.appendChild(
            createSearchResult(tool)
        );

    });

}


/* =====================================================
   6. SEARCH FUNCTION
===================================================== */

function performSearch() {

    if (!searchInput || !searchResults) {
        return;
    }


    const query = searchInput.value
        .trim()
        .toLowerCase();


    if (!query) {

        searchResults.innerHTML = "";

        return;

    }


    const results = tools.filter(tool => {

        const searchableText = `

            ${tool.name}
            ${tool.category}
            ${tool.description}
            ${tool.keywords}

        `.toLowerCase();


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
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();

            }

        }
    );

}


/* =====================================================
   9. SEARCH BOX — CLICK ANYWHERE TO FOCUS
===================================================== */

const toolSearch = document.querySelector(".tool-search");

if (toolSearch && searchInput) {

    toolSearch.addEventListener(
        "click",
        event => {

            if (
                event.target !== searchButton &&
                !event.target.closest("a")
            ) {

                searchInput.focus();

            }

        }
    );

}


/* =====================================================
   10. ESCAPE SEARCH
===================================================== */

if (searchInput && searchResults) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                searchInput.value = "";

                searchResults.innerHTML = "";

                searchInput.blur();

            }

        }
    );

}


/* =====================================================
   11. CONTACT FORM
===================================================== */

const contactForm =
    document.querySelector(".contact-form");

const formMessage =
    document.querySelector(".form-message");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

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
   12. CURRENT PAGE NAVIGATION
===================================================== */

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


if (navLinks) {

    navLinks.querySelectorAll("a").forEach(link => {

        const linkPage =
            link.getAttribute("href")
                ?.split("/")
                .pop()
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
   13. CLOSE MENU WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            !navLinks ||
            !menuToggle ||
            !navLinks.classList.contains("open")
        ) {
            return;
        }


        const clickedInsideMenu =
            navLinks.contains(event.target);

        const clickedToggle =
            menuToggle.contains(event.target);


        if (
            !clickedInsideMenu &&
            !clickedToggle
        ) {

            navLinks.classList.remove("open");

            menuToggle.textContent = "☰";

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );

        }

    }
);


/* =====================================================
   14. SMOOTH INTERNAL LINKS
===================================================== */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


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
   15. INITIAL STATE
===================================================== */

if (searchResults) {

    searchResults.innerHTML = "";

}


});
