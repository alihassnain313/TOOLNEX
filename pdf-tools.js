/* =========================================================
TOOLNEX — PDF TOOLS JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
   MERGE PDF
===================================================== */

const mergeFiles = document.getElementById("mergeFiles");
const mergeButton = document.querySelector('[data-action="merge"]');
const mergeStatus = document.getElementById("mergeStatus");


if (mergeFiles && mergeButton) {

    mergeButton.addEventListener("click", async () => {

        const files = Array.from(mergeFiles.files || []);


        /* No files selected */

        if (files.length === 0) {

            if (mergeStatus) {
                mergeStatus.textContent =
                    "Please choose at least 2 PDF files.";
            }

            return;
        }


        /* Only one PDF */

        if (files.length < 2) {

            if (mergeStatus) {
                mergeStatus.textContent =
                    "Please choose at least 2 PDF files to merge.";
            }

            return;
        }


        /* Check PDF library */

        if (typeof PDFLib === "undefined") {

            if (mergeStatus) {
                mergeStatus.textContent =
                    "PDF engine could not load. Please refresh the page.";
            }

            return;
        }


        try {

            mergeButton.disabled = true;

            mergeButton.textContent =
                "Merging...";


            if (mergeStatus) {
                mergeStatus.textContent =
                    "Processing your PDF files...";
            }


            const mergedPdf =
                await PDFLib.PDFDocument.create();


            /* Process every selected PDF */

            for (const file of files) {

                const arrayBuffer =
                    await file.arrayBuffer();


                const sourcePdf =
                    await PDFLib.PDFDocument.load(arrayBuffer);


                const pageIndices =
                    sourcePdf
                        .getPageIndices();


                const copiedPages =
                    await mergedPdf.copyPages(
                        sourcePdf,
                        pageIndices
                    );


                copiedPages.forEach(page => {

                    mergedPdf.addPage(page);

                });

            }


            /* Create merged PDF */

            const mergedPdfBytes =
                await mergedPdf.save();


            const blob =
                new Blob(
                    [mergedPdfBytes],
                    {
                        type: "application/pdf"
                    }
                );


            const downloadUrl =
                URL.createObjectURL(blob);


            const downloadLink =
                document.createElement("a");


            downloadLink.href =
                downloadUrl;


            downloadLink.download =
                "TOOLNEX-Merged-PDF.pdf";


            document.body.appendChild(
                downloadLink
            );


            downloadLink.click();


            downloadLink.remove();


            URL.revokeObjectURL(
                downloadUrl
            );


            /* Success message */

            if (mergeStatus) {

                mergeStatus.textContent =
                    `${files.length} PDF files merged successfully. Download started.`;

            }


        } catch (error) {

            console.error(
                "TOOLNEX PDF Merge Error:",
                error
            );


            if (mergeStatus) {

                mergeStatus.textContent =
                    "Unable to merge these PDF files. Please try again.";

            }

        } finally {

            mergeButton.disabled = false;

            mergeButton.textContent =
                "Merge PDFs →";

        }

    });

}


});
