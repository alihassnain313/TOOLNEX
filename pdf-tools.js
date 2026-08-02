/* =========================================================
   TOOLNEX — PDF TOOLS ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PDF.JS + PDF-LIB CHECK
    ===================================================== */

    const hasPDFLib = typeof PDFLib !== "undefined";
    const hasPDFJS = typeof pdfjsLib !== "undefined";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const mergeFiles = document.getElementById("mergeFiles");
    const splitFile = document.getElementById("splitFile");
    const compressFile = document.getElementById("compressFile");
    const pdfImageFile = document.getElementById("pdfImageFile");

    const mergeButton =
        document.querySelector('[data-action="merge"]');

    const splitButton =
        document.querySelector('[data-action="split"]');

    const compressButton =
        document.querySelector('[data-action="compress"]');

    const pdfImageButton =
        document.querySelector('[data-action="pdf-to-image"]');

    const mergeStatus =
        document.getElementById("mergeStatus");

    const splitStatus =
        document.getElementById("splitStatus");

    const compressStatus =
        document.getElementById("compressStatus");

    const pdfImageStatus =
        document.getElementById("pdfImageStatus");


    /* =====================================================
       STATUS HELPER
    ===================================================== */

    function setStatus(element, message, type = "") {

        if (!element) return;

        element.textContent = message;

        element.classList.remove(
            "success",
            "error",
            "loading"
        );

        if (type) {
            element.classList.add(type);
        }

    }


    /* =====================================================
       FILE SIZE
    ===================================================== */

    function formatFileSize(bytes) {

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    }


    /* =====================================================
       DOWNLOAD HELPER
    ===================================================== */

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


    /* =====================================================
       BUTTON LOADING
    ===================================================== */

    function setButtonLoading(button, loading, normalText) {

        if (!button) return;

        button.disabled = loading;

        if (loading) {

            button.dataset.originalText =
                button.textContent;

            button.textContent =
                "Processing...";

        } else {

            button.textContent =
                normalText ||
                button.dataset.originalText ||
                "Done";

        }

    }


    /* =====================================================
       FILE VALIDATION
    ===================================================== */

    function isPDF(file) {

        if (!file) return false;

        return (
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        );

    }


    /* =====================================================
       MERGE PDF
    ===================================================== */

    if (mergeButton) {

        mergeButton.addEventListener("click", async () => {

            const files =
                mergeFiles?.files;

            if (!files || files.length < 2) {

                setStatus(
                    mergeStatus,
                    "Please choose at least 2 PDF files.",
                    "error"
                );

                return;
            }


            if (!hasPDFLib) {

                setStatus(
                    mergeStatus,
                    "PDF engine is not loaded. Please refresh the page.",
                    "error"
                );

                return;
            }


            for (const file of files) {

                if (!isPDF(file)) {

                    setStatus(
                        mergeStatus,
                        "Only PDF files are allowed.",
                        "error"
                    );

                    return;
                }

            }


            setButtonLoading(
                mergeButton,
                true
            );

            setStatus(
                mergeStatus,
                "Merging your PDFs...",
                "loading"
            );


            try {

                const mergedPdf =
                    await PDFLib.PDFDocument.create();


                for (const file of files) {

                    const arrayBuffer =
                        await file.arrayBuffer();

                    const sourcePdf =
                        await PDFLib.PDFDocument.load(
                            arrayBuffer
                        );


                    const pages =
                        await mergedPdf.copyPages(
                            sourcePdf,
                            sourcePdf.getPageIndices()
                        );


                    pages.forEach(page => {
                        mergedPdf.addPage(page);
                    });

                }


                const mergedBytes =
                    await mergedPdf.save();


                const blob =
                    new Blob(
                        [mergedBytes],
                        {
                            type: "application/pdf"
                        }
                    );


                downloadBlob(
                    blob,
                    "TOOLNEX-Merged.pdf"
                );


                setStatus(
                    mergeStatus,
                    `Done — ${files.length} PDFs merged successfully.`,
                    "success"
                );

            } catch (error) {

                console.error(error);

                setStatus(
                    mergeStatus,
                    "Could not merge the PDFs. Make sure the files are valid.",
                    "error"
                );

            } finally {

                setButtonLoading(
                    mergeButton,
                    false,
                    "Merge PDFs →"
                );

            }

        });

    }


    /* =====================================================
       SPLIT PDF
    ===================================================== */

    if (splitButton) {

        splitButton.addEventListener("click", async () => {

            const file =
                splitFile?.files?.[0];

            if (!file) {

                setStatus(
                    splitStatus,
                    "Please choose a PDF file first.",
                    "error"
                );

                return;
            }


            if (!isPDF(file)) {

                setStatus(
                    splitStatus,
                    "Please choose a valid PDF file.",
                    "error"
                );

                return;
            }


            if (!hasPDFLib) {

                setStatus(
                    splitStatus,
                    "PDF engine is not loaded. Please refresh the page.",
                    "error"
                );

                return;
            }


            setButtonLoading(
                splitButton,
                true
            );

            setStatus(
                splitStatus,
                "Reading your PDF...",
                "loading"
            );


            try {

                const arrayBuffer =
                    await file.arrayBuffer();


                const sourcePdf =
                    await PDFLib.PDFDocument.load(
                        arrayBuffer
                    );


                const pageCount =
                    sourcePdf.getPageCount();


                if (pageCount === 0) {

                    throw new Error(
                        "PDF contains no pages."
                    );

                }


                /*
                 * For a safe browser-based workflow,
                 * each page is exported as its own PDF.
                 */

                for (
                    let pageIndex = 0;
                    pageIndex < pageCount;
                    pageIndex++
                ) {

                    const singlePdf =
                        await PDFLib.PDFDocument.create();


                    const [page] =
                        await singlePdf.copyPages(
                            sourcePdf,
                            [pageIndex]
                        );


                    singlePdf.addPage(page);


                    const bytes =
                        await singlePdf.save();


                    const blob =
                        new Blob(
                            [bytes],
                            {
                                type: "application/pdf"
                            }
                        );


                    downloadBlob(
                        blob,
                        `TOOLNEX-Page-${pageIndex + 1}.pdf`
                    );


                    /*
                     * Small pause prevents browsers from
                     * aggressively blocking multiple downloads.
                     */

                    await new Promise(resolve =>
                        setTimeout(resolve, 120)
                    );

                }


                setStatus(
                    splitStatus,
                    `Done — ${pageCount} page PDF file${pageCount === 1 ? "" : "s"} created.`,
                    "success"
                );

            } catch (error) {

                console.error(error);

                setStatus(
                    splitStatus,
                    "Could not split this PDF. Make sure it is valid and not password protected.",
                    "error"
                );

            } finally {

                setButtonLoading(
                    splitButton,
                    false,
                    "Split PDF →"
                );

            }

        });

    }


    /* =====================================================
       COMPRESS PDF
    ===================================================== */

    if (compressButton) {

        compressButton.addEventListener("click", async () => {

            const file =
                compressFile?.files?.[0];

            if (!file) {

                setStatus(
                    compressStatus,
                    "Please choose a PDF file first.",
                    "error"
                );

                return;
            }


            if (!isPDF(file)) {

                setStatus(
                    compressStatus,
                    "Please choose a valid PDF file.",
                    "error"
                );

                return;
            }


            if (!hasPDFLib) {

                setStatus(
                    compressStatus,
                    "PDF engine is not loaded. Please refresh the page.",
                    "error"
                );

                return;
            }


            setButtonLoading(
                compressButton,
                true
            );

            setStatus(
                compressStatus,
                "Optimizing your PDF...",
                "loading"
            );


            try {

                const originalBytes =
                    await file.arrayBuffer();


                const pdf =
                    await PDFLib.PDFDocument.load(
                        originalBytes
                    );


                /*
                 * Browser-side PDF libraries cannot perform
                 * true image recompression like a server-side
                 * PDF optimizer.
                 *
                 * This save operation can remove some
                 * unnecessary document structure, but the
                 * output may sometimes be similar in size.
                 */

                const optimizedBytes =
                    await pdf.save({
                        useObjectStreams: true,
                        addDefaultPage: false
                    });


                const originalSize =
                    file.size;

                const newSize =
                    optimizedBytes.byteLength;


                const blob =
                    new Blob(
                        [optimizedBytes],
                        {
                            type: "application/pdf"
                        }
                    );


                downloadBlob(
                    blob,
                    "TOOLNEX-Compressed.pdf"
                );


                const difference =
                    originalSize - newSize;


                if (difference > 0) {

                    const percent =
                        (
                            difference /
                            originalSize
                        ) * 100;


                    setStatus(
                        compressStatus,
                        `Done — ${formatFileSize(difference)} saved (${percent.toFixed(1)}% smaller).`,
                        "success"
                    );

                } else {

                    setStatus(
                        compressStatus,
                        `Done — optimized copy created (${formatFileSize(newSize)}).`,
                        "success"
                    );

                }

            } catch (error) {

                console.error(error);

                setStatus(
                    compressStatus,
                    "Could not process this PDF. It may be encrypted or damaged.",
                    "error"
                );

            } finally {

                setButtonLoading(
                    compressButton,
                    false,
                    "Compress PDF →"
                );

            }

        });

    }


    /* =====================================================
       PDF TO IMAGE
    ===================================================== */

    if (pdfImageButton) {

        pdfImageButton.addEventListener("click", async () => {

            const file =
                pdfImageFile?.files?.[0];

            if (!file) {

                setStatus(
                    pdfImageStatus,
                    "Please choose a PDF file first.",
                    "error"
                );

                return;
            }


            if (!isPDF(file)) {

                setStatus(
                    pdfImageStatus,
                    "Please choose a valid PDF file.",
                    "error"
                );

                return;
            }


            if (!hasPDFJS) {

                setStatus(
                    pdfImageStatus,
                    "PDF image engine is not loaded. Please refresh the page.",
                    "error"
                );

                return;
            }


            setButtonLoading(
                pdfImageButton,
                true
            );

            setStatus(
                pdfImageStatus,
                "Converting PDF pages into images...",
                "loading"
            );


            try {

                const arrayBuffer =
                    await file.arrayBuffer();


                const pdf =
                    await pdfjsLib.getDocument({
                        data: arrayBuffer
                    }).promise;


                const totalPages =
                    pdf.numPages;


                for (
                    let pageNumber = 1;
                    pageNumber <= totalPages;
                    pageNumber++
                ) {

                    const page =
                        await pdf.getPage(
                            pageNumber
                        );


                    const viewport =
                        page.getViewport({
                            scale: 2
                        });


                    const canvas =
                        document.createElement(
                            "canvas"
                        );


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


                    const blob =
                        await new Promise(resolve => {

                            canvas.toBlob(
                                resolve,
                                "image/png"
                            );

                        });


                    if (!blob) {

                        throw new Error(
                            "Image conversion failed."
                        );

                    }


                    downloadBlob(
                        blob,
                        `TOOLNEX-Page-${pageNumber}.png`
                    );


                    await new Promise(resolve =>
                        setTimeout(resolve, 120)
                    );

                }


                setStatus(
                    pdfImageStatus,
                    `Done — ${totalPages} image${totalPages === 1 ? "" : "s"} created.`,
                    "success"
                );

            } catch (error) {

                console.error(error);

                setStatus(
                    pdfImageStatus,
                    "Could not convert this PDF into images.",
                    "error"
                );

            } finally {

                setButtonLoading(
                    pdfImageButton,
                    false,
                    "Convert to Image →"
                );

            }

        });

    }


    /* =====================================================
       FILE SELECTION FEEDBACK
    ===================================================== */

    function addFileFeedback(input, status, multiple = false) {

        if (!input || !status) return;

        input.addEventListener("change", () => {

            const files = input.files;

            if (!files || files.length === 0) {

                setStatus(
                    status,
                    ""
                );

                return;
            }


            if (multiple) {

                setStatus(
                    status,
                    `${files.length} PDF file${files.length === 1 ? "" : "s"} selected.`
                );

            } else {

                const file =
                    files[0];

                setStatus(
                    status,
                    `${file.name} selected — ${formatFileSize(file.size)}`
                );

            }

        });

    }


    addFileFeedback(
        mergeFiles,
        mergeStatus,
        true
    );

    addFileFeedback(
        splitFile,
        splitStatus
    );

    addFileFeedback(
        compressFile,
        compressStatus
    );

    addFileFeedback(
        pdfImageFile,
        pdfImageStatus
    );


});

