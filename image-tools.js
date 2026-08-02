/* =========================================================
   TOOLNEX — IMAGE TOOLS JAVASCRIPT
   PROFESSIONAL LIVE IMAGE RESIZER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("resizeImageInput");

    const previewArea =
        document.getElementById("resizePreviewArea");

    const preview =
        document.getElementById("resizePreview");

    const previewStatus =
        document.getElementById("resizePreviewStatus");

    const originalInfo =
        document.getElementById("resizeOriginalInfo");

    const newInfo =
        document.getElementById("resizeNewInfo");

    const controls =
        document.getElementById("resizeControls");

    const widthInput =
        document.getElementById("resizeWidth");

    const heightInput =
        document.getElementById("resizeHeight");

    const aspectRatio =
        document.getElementById("keepAspectRatio");

    const formatSelect =
        document.getElementById("resizeFormat");

    const qualityInput =
        document.getElementById("resizeQuality");

    const qualityValue =
        document.getElementById("resizeQualityValue");

    const applyButton =
        document.getElementById("applyResizeButton");

    const downloadButton =
        document.getElementById("downloadResizeButton");

    const status =
        document.getElementById("resizeStatus");


    let selectedImage = null;

    let originalWidth = 0;
    let originalHeight = 0;

    let ratio = 1;

    let resizedBlob = null;

    let resizedWidth = 0;
    let resizedHeight = 0;


    /* =====================================================
       STATUS
    ===================================================== */

    function setStatus(message, type = "normal") {

        if (!status) return;

        status.textContent = message;
        status.dataset.status = type;

    }


    /* =====================================================
       QUALITY
    ===================================================== */

    function updateQualityText() {

        if (!qualityInput || !qualityValue) return;

        qualityValue.textContent =
            `${qualityInput.value}%`;

    }


    if (qualityInput) {

        qualityInput.addEventListener(
            "input",
            () => {

                updateQualityText();

                invalidateResize();

            }
        );

    }


    /* =====================================================
       INVALIDATE PREVIOUS RESIZE
    ===================================================== */

    function invalidateResize() {

        resizedBlob = null;

        resizedWidth = 0;
        resizedHeight = 0;

        if (downloadButton) {

            downloadButton.disabled = true;

        }

        if (previewStatus) {

            previewStatus.textContent =
                "Preview";

        }

    }


    /* =====================================================
       VALID DIMENSIONS
    ===================================================== */

    function getDimensions() {

        const width =
            Number(widthInput?.value);

        const height =
            Number(heightInput?.value);


        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            width <= 0 ||
            height <= 0
        ) {

            return null;

        }


        if (
            width > 10000 ||
            height > 10000
        ) {

            return null;

        }


        return {
            width: Math.round(width),
            height: Math.round(height)
        };

    }


    /* =====================================================
       UPDATE LIVE PREVIEW
    ===================================================== */

    function updateLivePreview() {

        if (!selectedImage) return;


        const dimensions =
            getDimensions();


        if (!dimensions) {

            if (newInfo) {

                newInfo.textContent =
                    "Invalid size";

            }

            if (previewStatus) {

                previewStatus.textContent =
                    "Invalid";

            }

            setStatus(
                "Enter a valid width and height.",
                "error"
            );

            invalidateResize();

            return;

        }


        const {
            width,
            height
        } = dimensions;


        if (newInfo) {

            newInfo.textContent =
                `${width} × ${height}px`;

        }


        /*
         * Live preview uses CSS dimensions.
         * The actual high-quality resize happens
         * when Apply Resize is pressed.
         */

        if (preview) {

            preview.style.width =
                `${Math.min(width, 900)}px`;

            preview.style.height =
                "auto";

            preview.style.maxWidth =
                "100%";

            preview.style.aspectRatio =
                `${width} / ${height}`;

            preview.style.objectFit =
                "contain";

        }


        if (previewStatus) {

            previewStatus.textContent =
                "Live Preview";

        }


        invalidateResize();


        setStatus(
            `${width} × ${height}px preview ready. Click Apply Resize to create it.`,
            "normal"
        );

    }


    /* =====================================================
       WIDTH → HEIGHT
    ===================================================== */

    if (widthInput) {

        widthInput.addEventListener(
            "input",
            () => {

                const width =
                    Number(widthInput.value);


                if (
                    aspectRatio?.checked &&
                    Number.isFinite(width) &&
                    width > 0 &&
                    ratio > 0
                ) {

                    heightInput.value =
                        Math.round(
                            width / ratio
                        );

                }


                updateLivePreview();

            }
        );

    }


    /* =====================================================
       HEIGHT → WIDTH
    ===================================================== */

    if (heightInput) {

        heightInput.addEventListener(
            "input",
            () => {

                const height =
                    Number(heightInput.value);


                if (
                    aspectRatio?.checked &&
                    Number.isFinite(height) &&
                    height > 0 &&
                    ratio > 0
                ) {

                    widthInput.value =
                        Math.round(
                            height * ratio
                        );

                }


                updateLivePreview();

            }
        );

    }


    /* =====================================================
       ASPECT RATIO
    ===================================================== */

    if (aspectRatio) {

        aspectRatio.addEventListener(
            "change",
            () => {

                if (
                    aspectRatio.checked &&
                    widthInput &&
                    heightInput
                ) {

                    const width =
                        Number(widthInput.value);


                    if (
                        Number.isFinite(width) &&
                        width > 0
                    ) {

                        heightInput.value =
                            Math.round(
                                width / ratio
                            );

                    }

                }


                updateLivePreview();

            }
        );

    }


    /* =====================================================
       FORMAT CHANGE
    ===================================================== */

    if (formatSelect) {

        formatSelect.addEventListener(
            "change",
            () => {

                invalidateResize();

                updateLivePreview();

            }
        );

    }


    /* =====================================================
       LOAD IMAGE
    ===================================================== */

    if (input) {

        input.addEventListener(
            "change",
            () => {

                const file =
                    input.files?.[0];


                if (!file) return;


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    setStatus(
                        "Please choose a valid image file.",
                        "error"
                    );

                    input.value = "";

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    event => {

                        const image =
                            new Image();


                        image.onload =
                            () => {

                                selectedImage =
                                    image;


                                originalWidth =
                                    image.naturalWidth;


                                originalHeight =
                                    image.naturalHeight;


                                ratio =
                                    originalWidth /
                                    originalHeight;


                                /* Preview */

                                if (preview) {

                                    preview.src =
                                        event.target.result;

                                    preview.style.width =
                                        "auto";

                                    preview.style.height =
                                        "auto";

                                    preview.style.aspectRatio =
                                        "auto";

                                }


                                /* Original size */

                                if (originalInfo) {

                                    originalInfo.textContent =
                                        `${originalWidth} × ${originalHeight}px`;

                                }


                                /* Default dimensions */

                                if (widthInput) {

                                    widthInput.value =
                                        originalWidth;

                                }


                                if (heightInput) {

                                    heightInput.value =
                                        originalHeight;

                                }


                                if (previewArea) {

                                    previewArea.hidden =
                                        false;

                                }


                                if (controls) {

                                    controls.hidden =
                                        false;

                                }


                                invalidateResize();

                                updateQualityText();


                                setStatus(
                                    "Image loaded. Adjust the dimensions to preview your resize.",
                                    "success"
                                );

                            };


                        image.onerror =
                            () => {

                                setStatus(
                                    "Unable to read this image.",
                                    "error"
                                );

                            };


                        image.src =
                            event.target.result;

                    };


                reader.onerror =
                    () => {

                        setStatus(
                            "Unable to load the selected image.",
                            "error"
                        );

                    };


                reader.readAsDataURL(file);

            }
        );

    }


    /* =====================================================
       APPLY RESIZE
    ===================================================== */

    if (applyButton) {

        applyButton.addEventListener(
            "click",
            () => {

                if (!selectedImage) {

                    setStatus(
                        "Please choose an image first.",
                        "error"
                    );

                    return;

                }


                const dimensions =
                    getDimensions();


                if (!dimensions) {

                    setStatus(
                        "Please enter valid dimensions between 1 and 10000 pixels.",
                        "error"
                    );

                    return;

                }


                const {
                    width,
                    height
                } = dimensions;


                applyButton.disabled =
                    true;

                applyButton.textContent =
                    "Resizing...";


                setStatus(
                    "Creating your resized image...",
                    "loading"
                );


                try {

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    if (!context) {

                        throw new Error(
                            "Canvas is not supported."
                        );

                    }


                    context.imageSmoothingEnabled =
                        true;

                    context.imageSmoothingQuality =
                        "high";


                    const format =
                        formatSelect?.value ||
                        "image/png";


                    /*
                     * JPG does not support transparency.
                     */

                    if (
                        format ===
                        "image/jpeg"
                    ) {

                        context.fillStyle =
                            "#ffffff";

                        context.fillRect(
                            0,
                            0,
                            width,
                            height
                        );

                    }


                    context.drawImage(
                        selectedImage,
                        0,
                        0,
                        width,
                        height
                    );


                    const quality =
                        Number(
                            qualityInput?.value || 90
                        ) / 100;


                    canvas.toBlob(
                        blob => {

                            if (!blob) {

                                setStatus(
                                    "Unable to create the resized image.",
                                    "error"
                                );

                                return;

                            }


                            resizedBlob =
                                blob;

                            resizedWidth =
                                width;

                            resizedHeight =
                                height;


                            if (downloadButton) {

                                downloadButton.disabled =
                                    false;

                            }


                            if (previewStatus) {

                                previewStatus.textContent =
                                    "Resized ✓";

                            }


                            setStatus(
                                "Resize complete. Check the preview, then download your image.",
                                "success"
                            );


                            applyButton.disabled =
                                false;

                            applyButton.textContent =
                                "Apply Resize ✓";

                        },
                        format,
                        format === "image/png"
                            ? undefined
                            : quality
                    );


                } catch (error) {

                    console.error(
                        "TOOLNEX Resize Error:",
                        error
                    );


                    setStatus(
                        "Unable to resize this image.",
                        "error"
                    );


                    applyButton.disabled =
                        false;

                    applyButton.textContent =
                        "Apply Resize ✓";

                }

            }
        );

    }


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            () => {

                if (!resizedBlob) {

                    setStatus(
                        "Please apply the resize first.",
                        "error"
                    );

                    return;

                }


                const format =
                    formatSelect?.value ||
                    "image/png";


                let extension =
                    "png";


                if (
                    format ===
                    "image/jpeg"
                ) {

                    extension =
                        "jpg";

                }


                if (
                    format ===
                    "image/webp"
                ) {

                    extension =
                        "webp";

                }


                const url =
                    URL.createObjectURL(
                        resizedBlob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    url;


                link.download =
                    `TOOLNEX-Resized-${resizedWidth}x${resizedHeight}.${extension}`;


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                setTimeout(
                    () => {
                        URL.revokeObjectURL(url);
                    },
                    1000
                );


                const sizeKB =
                    (
                        resizedBlob.size /
                        1024
                    ).toFixed(1);


                setStatus(
                    `Download started — ${resizedWidth} × ${resizedHeight}px, ${extension.toUpperCase()}, ${sizeKB} KB.`,
                    "success"
                );

            }
        );

    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateQualityText();

});

