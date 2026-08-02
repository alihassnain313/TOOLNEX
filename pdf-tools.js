/* =========================================================
   TOOLNEX — PDF TOOLS JAVASCRIPT
   FINAL VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HELPERS
    ===================================================== */

    function setStatus(id, message, type = "normal") {

        const element = document.getElementById(id);

        if (!element) return;

        element.textContent = message;

        element.dataset.status = type;
    }


    function getPDFLib() {

        if (typeof PDFLib === "undefined") {
            throw new Error("PDF engine is not loaded.");
        }

        return PDFLib;
    }


    function downloadBlob(blob, filename) {

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }


    function resetButton(button, text) {

        if (!button) return;

        button.disabled = false;
        button.textContent = text;
    }


    async function loadScript(src) {

        return new Promise((resolve, reject) => {

            const existing =
                document.querySelector(`script[src="${src}"]`);

            if (existing) {

                if (existing.dataset.loaded === "true") {
                    resolve();
                    return;
                }

                existing.addEventListener("load", resolve);
                existing.addEventListener("error", reject);

                return;
            }


            const script =
                document.createElement("script");

            script.src = src;

            script.onload = () => {

                script.dataset.loaded = "true";

                resolve();

            };

            script.onerror = () => {

                reject(
                    new Error(`Could not load library: ${src}`)
                );

            };

            document.head.appendChild(script);

        });

    }


    async function loadJSZip() {

        if (typeof JSZip !== "undefined") {
            return JSZip;
        }

        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
        );

        if (typeof JSZip === "undefined") {
            throw new Error("ZIP engine could not load.");
        }

        return JSZip;
    }


    async function loadPDFJS() {

        if (window.pdfjsLib) {
            return window.pdfjsLib;
        }

        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
        );

        if (!window.pdfjsLib) {

            /*
             * Fallback to classic PDF.js build
             */

            await loadScript(
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
            );
        }


        if (!window.pdfjsLib) {
            throw new Error("PDF image engine could not load.");
        }


        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


        return window.pdfjsLib;
    }


    /* =====================================================
       1. MERGE PDF
    ===================================================== */

    const mergeFiles =
        document.getElementById("mergeFiles");

    const mergeButton =
        document.querySelector('[data-action="merge"]');

    const mergeStatus =
        document.getElementById("mergeStatus");


    if (mergeFiles && mergeButton) {

        mergeButton.addEventListener("click", async () => {

            const files =
                Array.from(mergeFiles.files || []);


            if (files.length < 2) {

                setStatus(
                    "mergeStatus",
                    "Please choose at least 2 PDF files.",
                    "error"
                );

                return;
            }


            try {

                mergeButton.disabled = true;
                mergeButton.textContent = "Merging...";


                setStatus(
                    "mergeStatus",
                    "Processing PDF files...",
                    "loading"
                );


                const PDF =
                    getPDFLib();


                const mergedPdf =
                    await PDF.PDFDocument.create();


                for (const file of files) {

                    if (
                        file.type !== "application/pdf" &&
                        !file.name.toLowerCase().endsWith(".pdf")
                    ) {
                        throw new Error(
                            `${file.name} is not a PDF file.`
                        );
                    }


                    const arrayBuffer =
                        await file.arrayBuffer();


                    const sourcePdf =
                        await PDF.PDFDocument.load(
                            arrayBuffer
                        );


                    const copiedPages =
                        await mergedPdf.copyPages(
                            sourcePdf,
                            sourcePdf.getPageIndices()
                        );


                    copiedPages.forEach(page => {
                        mergedPdf.addPage(page);
                    });

                }


                const bytes =
                    await mergedPdf.save({
                        useObjectStreams: true
                    });


                const blob =
                    new Blob(
                        [bytes],
                        {
                            type: "application/pdf"
                        }
                    );


                downloadBlob(
                    blob,
                    "TOOLNEX-Merged-PDF.pdf"
                );


                setStatus(
                    "mergeStatus",
                    `${files.length} PDF files merged successfully. Download started.`,
                    "success"
                );


            } catch (error) {

                console.error(
                    "TOOLNEX Merge Error:",
                    error
                );


                setStatus(
                    "mergeStatus",
                    "Unable to merge the selected PDFs. Please check the files and try again.",
                    "error"
                );


            } finally {

                resetButton(
                    mergeButton,
                    "Merge PDFs →"
                );

            }

        });

    }


    /* =====================================================
       2. SPLIT PDF
    ===================================================== */

    const splitFile =
        document.getElementById("splitFile");

    const splitButton =
        document.querySelector('[data-action="split"]');

    const splitStatus =
        document.getElementById("splitStatus");


    if (splitFile && splitButton) {

        splitButton.addEventListener("click", async () => {

            const file =
                splitFile.files?.[0];


            if (!file) {

                setStatus(
                    "splitStatus",
                    "Please choose a PDF file first.",
                    "error"
                );

                return;
            }


            try {

                splitButton.disabled = true;
                splitButton.textContent = "Splitting...";


                setStatus(
                    "splitStatus",
                    "Preparing your PDF pages...",
                    "loading"
                );


                const PDF =
                    getPDFLib();


                const arrayBuffer =
                    await file.arrayBuffer();


                const sourcePdf =
                    await PDF.PDFDocument.load(
                        arrayBuffer
                    );


                const pageCount =
                    sourcePdf.getPageCount();


                if (pageCount === 0) {
                    throw new Error("PDF contains no pages.");
                }


                const Zip =
                    await loadJSZip();


                const zip =
                    new Zip();


                for (
                    let pageIndex = 0;
                    pageIndex < pageCount;
                    pageIndex++
                ) {

                    const newPdf =
                        await PDF.PDFDocument.create();


                    const [page] =
                        await newPdf.copyPages(
                            sourcePdf,
                            [pageIndex]
                        );


                    newPdf.addPage(page);


                    const pageBytes =
                        await newPdf.save({
                            useObjectStreams: true
                        });


                    const pageNumber =
                        String(pageIndex + 1)
                            .padStart(2, "0");


                    zip.file(
                        `TOOLNEX-Page-${pageNumber}.pdf`,
                        pageBytes
                    );

                }


                const zipBlob =
                    await zip.generateAsync({
                        type: "blob",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 6
                        }
                    });


                downloadBlob(
                    zipBlob,
                    "TOOLNEX-Split-PDF-Pages.zip"
                );


                setStatus(
                    "splitStatus",
                    `${pageCount} pages split successfully. ZIP download started.`,
                    "success"
                );


            } catch (error) {

                console.error(
                    "TOOLNEX Split Error:",
                    error
                );


                setStatus(
                    "splitStatus",
                    "Unable to split this PDF. Please try another file.",
                    "error"
                );


            } finally {

                resetButton(
                    splitButton,
                    "Split PDF →"
                );

            }

        });

    }


    /* =====================================================
       3. COMPRESS PDF
    ===================================================== */

    const compressFile =
        document.getElementById("compressFile");

    const compressButton =
        document.querySelector('[data-action="compress"]');

    const compressStatus =
        document.getElementById("compressStatus");


    if (compressFile && compressButton) {

        compressButton.addEventListener(
            "click",
            async () => {

                const file =
                    compressFile.files?.[0];


                if (!file) {

                    setStatus(
                        "compressStatus",
                        "Please choose a PDF file first.",
                        "error"
                    );

                    return;
                }


                try {

                    compressButton.disabled = true;
                    compressButton.textContent =
                        "Compressing...";


                    setStatus(
                        "compressStatus",
                        "Optimizing your PDF...",
                        "loading"
                    );


                    const PDF =
                        getPDFLib();


                    const originalSize =
                        file.size;


                    const arrayBuffer =
                        await file.arrayBuffer();


                    const pdf =
                        await PDF.PDFDocument.load(
                            arrayBuffer
                        );


                    /*
                     * PDF-lib cannot perform aggressive
                     * image recompression like a server-side
                     * compressor, but this saves the document
                     * using optimized object streams.
                     */

                    const bytes =
                        await pdf.save({
                            useObjectStreams: true,
                            addDefaultPage: false
                        });


                    const blob =
                        new Blob(
                            [bytes],
                            {
                                type: "application/pdf"
                            }
                        );


                    const newSize =
                        blob.size;


                    downloadBlob(
                        blob,
                        "TOOLNEX-Compressed-PDF.pdf"
                    );


                    const originalKB =
                        (originalSize / 1024).toFixed(1);


                    const newKB =
                        (newSize / 1024).toFixed(1);


                    if (newSize < originalSize) {

                        setStatus(
                            "compressStatus",
                            `Done. Size reduced from ${originalKB} KB to ${newKB} KB. Download started.`,
                            "success"
                        );

                    } else {

                        setStatus(
                            "compressStatus",
                            `PDF optimized. Original: ${originalKB} KB. Download started.`,
                            "success"
                        );

                    }


                } catch (error) {

                    console.error(
                        "TOOLNEX Compression Error:",
                        error
                    );


                    setStatus(
                        "compressStatus",
                        "Unable to process this PDF. Please try another file.",
                        "error"
                    );


                } finally {

                    resetButton(
                        compressButton,
                        "Compress PDF →"
                    );

                }

            }
        );

    }


    /* =====================================================
       4. PDF TO IMAGE
    ===================================================== */

    const pdfImageFile =
        document.getElementById("pdfImageFile");

    const pdfImageButton =
        document.querySelector(
            '[data-action="pdf-to-image"]'
        );

    const pdfImageStatus =
        document.getElementById("pdfImageStatus");


    if (pdfImageFile && pdfImageButton) {

        pdfImageButton.addEventListener(
            "click",
            async () => {

                const file =
                    pdfImageFile.files?.[0];


                if (!file) {

                    setStatus(
                        "pdfImageStatus",
                        "Please choose a PDF file first.",
                        "error"
                    );

                    return;
                }


                try {

                    pdfImageButton.disabled = true;

                    pdfImageButton.textContent =
                        "Converting...";


                    setStatus(
                        "pdfImageStatus",
                        "Loading PDF image engine...",
                        "loading"
                    );


                    const pdfjs =
                        await loadPDFJS();


                    const arrayBuffer =
                        await file.arrayBuffer();


                    const pdf =
                        await pdfjs.getDocument({
                            data: arrayBuffer
                        }).promise;


                    const pageCount =
                        pdf.numPages;


                    const Zip =
                        await loadJSZip();


                    const zip =
                        new Zip();


                    for (
                        let pageNumber = 1;
                        pageNumber <= pageCount;
                        pageNumber++
                    ) {

                        setStatus(
                            "pdfImageStatus",
                            `Converting page ${pageNumber} of ${pageCount}...`,
                            "loading"
                        );


                        const page =
                            await pdf.getPage(
                                pageNumber
                            );


                        const viewport =
                            page.getViewport({
                                scale: 1.5
                            });


                        const canvas =
                            document.createElement("canvas");


                        const context =
                            canvas.getContext("2d");


                        canvas.width =
                            Math.ceil(viewport.width);


                        canvas.height =
                            Math.ceil(viewport.height);


                        await page.render({
                            canvasContext: context,
                            viewport: viewport
                        }).promise;


                        const imageBlob =
                            await new Promise(
                                resolve =>
                                    canvas.toBlob(
                                        resolve,
                                        "image/png"
                                    )
                            );


                        if (!imageBlob) {
                            throw new Error(
                                "Could not create image."
                            );
                        }


                        const pageName =
                            String(pageNumber)
                                .padStart(2, "0");


                        zip.file(
                            `TOOLNEX-Page-${pageName}.png`,
                            imageBlob
                        );


                        canvas.width = 1;
                        canvas.height = 1;

                    }


                    setStatus(
                        "pdfImageStatus",
                        "Creating ZIP download...",
                        "loading"
                    );


                    const zipBlob =
                        await zip.generateAsync({
                            type: "blob",
                            compression: "DEFLATE",
                            compressionOptions: {
                                level: 6
                            }
                        });


                    downloadBlob(
                        zipBlob,
                        "TOOLNEX-PDF-Images.zip"
                    );


                    setStatus(
                        "pdfImageStatus",
                        `${pageCount} PDF pages converted to images successfully. ZIP download started.`,
                        "success"
                    );


                } catch (error) {

                    console.error(
                        "TOOLNEX PDF to Image Error:",
                        error
                    );


                    setStatus(
                        "pdfImageStatus",
                        "Unable to convert this PDF to images. Please try again.",
                        "error"
                    );


                } finally {

                    resetButton(
                        pdfImageButton,
                        "Convert to Image →"
                    );

                }

            }
        );

    }

});
