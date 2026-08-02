<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">


<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta
    name="description"
    content="TOOLNEX PDF tools — merge, split, compress and convert PDF files online."
>

<meta
    name="keywords"
    content="PDF tools, merge PDF, split PDF, compress PDF, PDF to image, TOOLNEX"
>

<meta name="author" content="TOOLNEX">

<title>PDF Tools — TOOLNEX</title>

<link rel="stylesheet" href="style.css">


</head>

<body>

<header class="site-header">


<nav class="navbar">

    <a href="index.html" class="logo">
        TOOL<span>NEX</span>
    </a>

    <button
        class="menu-toggle"
        id="menuToggle"
        type="button"
        aria-label="Open menu"
    >
        ☰
    </button>

    <div class="nav-links" id="navLinks">

        <a href="index.html">Home</a>

        <a href="tools.html">Tools</a>

        <a href="pdf-tools.html" class="active">PDF</a>

        <a href="image-tools.html">Images</a>

        <a href="text-tools.html">Text</a>

        <a href="converters.html">Converters</a>

        <a href="about.html">About</a>

        <a href="contact.html">Contact</a>

    </div>

</nav>


</header>

<main>


<!-- PAGE HERO -->

<section class="page-hero">

    <div class="page-hero-content">

        <span class="eyebrow">
            TOOLNEX PDF TOOLBOX
        </span>

        <h1>
            PDF <span>Tools</span>
        </h1>

        <p>
            Simple browser-based tools for everyday PDF tasks.
            Choose a tool below and get started.
        </p>

    </div>

</section>


<!-- PDF TOOLS -->

<section class="section">

    <div class="section-heading">

        <span class="eyebrow">
            PDF TOOLBOX
        </span>

        <h2>
            Work with your <span>PDFs</span>
        </h2>

        <p>
            Select a PDF tool and process your files directly in your browser.
        </p>

    </div>


    <div class="tools-grid">


        <!-- MERGE PDF -->

        <article class="tool-card pdf-tool">

            <div class="tool-icon">
                📄
            </div>

            <h3>
                Merge PDF
            </h3>

            <p>
                Combine multiple PDF files into one document.
            </p>

            <div class="tool-action">

                <label
                    for="mergeFiles"
                    class="file-button"
                >
                    Choose PDFs
                </label>

                <input
                    type="file"
                    id="mergeFiles"
                    accept=".pdf,application/pdf"
                    multiple
                    hidden
                >

                <button
                    type="button"
                    class="btn btn-primary pdf-action"
                    data-action="merge"
                >
                    Merge PDFs →
                </button>

            </div>

            <div
                class="tool-status"
                id="mergeStatus"
                aria-live="polite"
            ></div>

        </article>


        <!-- SPLIT PDF -->

        <article class="tool-card pdf-tool">

            <div class="tool-icon">
                ✂️
            </div>

            <h3>
                Split PDF
            </h3>

            <p>
                Extract selected pages from a PDF document.
            </p>

            <div class="tool-action">

                <label
                    for="splitFile"
                    class="file-button"
                >
                    Choose PDF
                </label>

                <input
                    type="file"
                    id="splitFile"
                    accept=".pdf,application/pdf"
                    hidden
                >

                <button
                    type="button"
                    class="btn btn-primary pdf-action"
                    data-action="split"
                >
                    Split PDF →
                </button>

            </div>

            <div
                class="tool-status"
                id="splitStatus"
                aria-live="polite"
            ></div>

        </article>


        <!-- COMPRESS PDF -->

        <article class="tool-card pdf-tool">

            <div class="tool-icon">
                🗜️
            </div>

            <h3>
                Compress PDF
            </h3>

            <p>
                Reduce PDF file size for easier sharing.
            </p>

            <div class="tool-action">

                <label
                    for="compressFile"
                    class="file-button"
                >
                    Choose PDF
                </label>

                <input
                    type="file"
                    id="compressFile"
                    accept=".pdf,application/pdf"
                    hidden
                >

                <button
                    type="button"
                    class="btn btn-primary pdf-action"
                    data-action="compress"
                >
                    Compress PDF →
                </button>

            </div>

            <div
                class="tool-status"
                id="compressStatus"
                aria-live="polite"
            ></div>

        </article>


        <!-- PDF TO IMAGE -->

        <article class="tool-card pdf-tool">

            <div class="tool-icon">
                🖼️
            </div>

            <h3>
                PDF to Image
            </h3>

            <p>
                Convert PDF pages into image files.
            </p>

            <div class="tool-action">

                <label
                    for="pdfImageFile"
                    class="file-button"
                >
                    Choose PDF
                </label>

                <input
                    type="file"
                    id="pdfImageFile"
                    accept=".pdf,application/pdf"
                    hidden
                >

                <button
                    type="button"
                    class="btn btn-primary pdf-action"
                    data-action="pdf-to-image"
                >
                    Convert to Image →
                </button>

            </div>

            <div
                class="tool-status"
                id="pdfImageStatus"
                aria-live="polite"
            ></div>

        </article>


    </div>

</section>


<!-- HOW IT WORKS -->

<section class="section">

    <div class="section-heading">

        <span class="eyebrow">
            HOW IT WORKS
        </span>

        <h2>
            Simple PDF <span>workflow</span>
        </h2>

        <p>
            Choose a tool, select your file and process it in a few simple steps.
        </p>

    </div>


    <div class="steps">

        <div class="step">

            <span>01</span>

            <h3>
                Choose a tool
            </h3>

            <p>
                Select the PDF operation you want to perform.
            </p>

        </div>


        <div class="step">

            <span>02</span>

            <h3>
                Add your file
            </h3>

            <p>
                Select the PDF document from your device.
            </p>

        </div>


        <div class="step">

            <span>03</span>

            <h3>
                Get your result
            </h3>

            <p>
                Process your document and download the result.
            </p>

        </div>

    </div>

</section>


<!-- PRIVACY NOTE -->

<section class="section">

    <div class="info-box">

        <div class="info-icon">
            🔒
        </div>

        <div>

            <h3>
                Your files matter
            </h3>

            <p>
                Do not upload sensitive or confidential documents
                unless you understand how the tool processes your files.
            </p>

        </div>

    </div>

</section>


<!-- CTA -->

<section class="cta-section">

    <div class="cta-box">

        <span class="eyebrow">
            TOOLNEX
        </span>

        <h2>
            Need another kind of tool?
        </h2>

        <p>
            Explore our complete toolbox for images, text and conversions.
        </p>

        <a
            href="tools.html"
            class="btn btn-primary"
        >
            Explore All Tools →
        </a>

    </div>

</section>

</main>

<!-- FOOTER -->

<footer class="footer">


<div class="footer-main">


    <div class="footer-brand">

        <a href="index.html" class="logo">
            TOOL<span>NEX</span>
        </a>

        <p>
            Simple, useful online tools for everyday digital tasks.
        </p>

    </div>


    <div class="footer-column">

        <h4>Tools</h4>

        <a href="tools.html">All Tools</a>

        <a href="pdf-tools.html" class="active">
            PDF Tools
        </a>

        <a href="image-tools.html">
            Image Tools
        </a>

        <a href="text-tools.html">
            Text Tools
        </a>

        <a href="converters.html">
            Converters
        </a>

    </div>


    <div class="footer-column">

        <h4>Company</h4>

        <a href="about.html">
            About
        </a>

        <a href="contact.html">
            Contact
        </a>

    </div>


    <div class="footer-column">

        <h4>Legal</h4>

        <a href="privacy.html">
            Privacy Policy
        </a>

        <a href="terms.html">
            Terms &amp; Conditions
        </a>

    </div>


</div>


<div class="footer-bottom">

    <p>
        © 2026 TOOLNEX. All rights reserved.
    </p>

    <p>
        Built for useful things.
    </p>

</div>


</footer>

<!-- PDF LIBRARY -->

<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>

<!-- GLOBAL JAVASCRIPT -->

<script src="script.js"></script>

<!-- PDF PAGE JAVASCRIPT -->

<script src="pdf-tools.js"></script>

</body>
</html>
