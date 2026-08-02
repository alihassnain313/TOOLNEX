/* =========================================================
   TOOLNEX — IMAGE TOOLS JAVASCRIPT
   RESIZER • COMPRESSOR • CONVERTER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HELPERS
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


    function showStatus(container, message, type = "normal") {

        if (!container) return;

        let status =
            container.querySelector(".image-tool-status");

        if (!status) {

            status =
                document.createElement("div");

            status.className =
                "image-tool-status";

            container.appendChild(status);

        }

        status.textContent = message;

        status.dataset.status = type;
    }


    function loadImage(file) {

        return new Promise((resolve, reject) => {

            const image =
                new Image();

            const url =
                URL.createObjectURL(file);

            image.onload = () => {

                URL.revokeObjectURL(url);

                resolve(image);

            };

            image.onerror = () => {

                URL.revokeObjectURL(url);

                reject(
                    new Error("Could not load image.")
                );

            };

            image.src = url;

        });

    }


    function canvasToBlob(
        canvas,
        type = "image/png",
        quality = 0.9
    ) {

        return new Promise((resolve, reject) => {

            canvas.toBlob(
                blob => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Could not create image file."
                            )
                        );

                        return;
                    }

                    resolve(blob);

                },
                type,
                quality
            );

        });

    }


    function createButton(
        text,
        className = "btn btn-primary"
    ) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            className;

        button.textContent =
            text;

        return button;

    }


    /* =====================================================
       1. IMAGE RESIZER
    ===================================================== */

    const resizeInput =
        document.getElementById(
            "resizeImageInput"
        );


    if (resizeInput) {

        resizeInput.addEventListener(
            "change",
            async () => {

                const file =
                    resizeInput.files?.[0];

                if (!file) return;


                const workspace =
                    resizeInput.closest(
                        ".tool-workspace"
                    );


                if (!workspace) return;


                try {

                    const image =
                        await loadImage(file);


                    let controls =
                        workspace.querySelector(
                            ".image-resize-controls"
                        );


                    if (!controls) {

                        controls =
                            document.createElement("div");

                        controls.className =
                            "image-resize-controls";

                        controls.style.width =
                            "100%";

                        controls.style.display =
                            "grid";

                        controls.style.gridTemplateColumns =
                            "1fr 1fr";

                        controls.style.gap =
                            "12px";

                        controls.style.marginTop =
                            "18px";


                        controls.innerHTML = `

                            <label>
                                Width
                                <input
                                    type="number"
                                    class="resize-width"
                                    min="1"
                                >
                            </label>

                            <label>
                                Height
                                <input
                                    type="number"
                                    class="resize-height"
                                    min="1"
                                >
                            </label>

                        `;


                        workspace.appendChild(
                            controls
                        );

                    }


                    const widthInput =
                        controls.querySelector(
                            ".resize-width"
                        );

                    const heightInput =
                        controls.querySelector(
                            ".resize-height"
                        );


                    widthInput.value =
                        image.naturalWidth;

                    heightInput.value =
                        image.naturalHeight;


                    let resizeButton =
                        workspace.querySelector(
                            ".resize-image-button"
                        );


                    if (!resizeButton) {

                        resizeButton =
                            createButton(
                                "Resize & Download →"
                            );

                        resizeButton.classList.add(
                            "resize-image-button"
                        );

                        resizeButton.style.width =
                            "100%";

                        resizeButton.style.marginTop =
                            "14px";


                        workspace.appendChild(
                            resizeButton
                        );

                    }


                    showStatus(
                        workspace,
                        `Image loaded: ${image.naturalWidth} × ${image.naturalHeight}px`,
                        "success"
                    );


                    resizeButton.onclick =
                        async () => {

                            const width =
                                parseInt(
                                    widthInput.value,
                                    10
                                );

                            const height =
                                parseInt(
                                    heightInput.value,
                                    10
                                );


                            if (
                                !width ||
                                !height ||
                                width < 1 ||
                                height < 1
                            ) {

                                showStatus(
                                    workspace,
                                    "Please enter valid width and height.",
                                    "error"
                                );

                                return;

                            }


                            try {

                                resizeButton.disabled =
                                    true;

                                resizeButton.textContent =
                                    "Resizing...";


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


                                context.drawImage(
                                    image,
                                    0,
                                    0,
                                    width,
                                    height
                                );


                                const blob =
                                    await canvasToBlob(
                                        canvas,
                                        file.type ===
                                            "image/jpeg"
                                            ? "image/jpeg"
                                            : "image/png",
                                        0.92
                                    );


                                downloadBlob(
                                    blob,
                                    "TOOLNEX-Resized-Image" +
                                    (
                                        file.type ===
                                        "image/jpeg"
                                            ? ".jpg"
                                            : ".png"
                                    )
                                );


                                showStatus(
                                    workspace,
                                    `Image resized to ${width} × ${height}px. Download started.`,
                                    "success"
                                );


                            } catch (error) {

                                console.error(
                                    "TOOLNEX Resize Error:",
                                    error
                                );


                                showStatus(
                                    workspace,
                                    "Unable to resize this image.",
                                    "error"
                                );

                            }


                            resizeButton.disabled =
                                false;

                            resizeButton.textContent =
                                "Resize & Download →";

                        };


                } catch (error) {

                    console.error(
                        "TOOLNEX Image Load Error:",
                        error
                    );


                    showStatus(
                        workspace,
                        "Unable to load this image.",
                        "error"
                    );

                }

            }
        );

    }


    /* =====================================================
       2. IMAGE COMPRESSOR
    ===================================================== */

    const compressInput =
        document.getElementById(
            "compressImageInput"
        );


    if (compressInput) {

        compressInput.addEventListener(
            "change",
            async () => {

                const file =
                    compressInput.files?.[0];

                if (!file) return;


                const workspace =
                    compressInput.closest(
                        ".tool-workspace"
                    );


                if (!workspace) return;


                try {

                    const image =
                        await loadImage(file);


                    let controls =
                        workspace.querySelector(
                            ".image-compress-controls"
                        );


                    if (!controls) {

                        controls =
                            document.createElement("div");

                        controls.className =
                            "image-compress-controls";

                        controls.style.width =
                            "100%";

                        controls.style.marginTop =
                            "18px";


                        controls.innerHTML = `

                            <label>
                                Quality
                                <input
                                    type="range"
                                    class="compress-quality"
                                    min="10"
                                    max="100"
                                    value="75"
                                >

                                <span
                                    class="quality-value"
                                >
                                    75%
                                </span>

                            </label>

                        `;


                        workspace.appendChild(
                            controls
                        );

                    }


                    const qualitySlider =
                        controls.querySelector(
                            ".compress-quality"
                        );


                    const qualityValue =
                        controls.querySelector(
                            ".quality-value"
                        );


                    qualitySlider.addEventListener(
                        "input",
                        () => {

                            qualityValue.textContent =
                                qualitySlider.value +
                                "%";

                        }
                    );


                    let compressButton =
                        workspace.querySelector(
                            ".compress-image-button"
                        );


                    if (!compressButton) {

                        compressButton =
                            createButton(
                                "Compress & Download →"
                            );

                        compressButton.classList.add(
                            "compress-image-button"
                        );

                        compressButton.style.width =
                            "100%";

                        compressButton.style.marginTop =
                            "14px";


                        workspace.appendChild(
                            compressButton
                        );

                    }


                    showStatus(
                        workspace,
                        `Image loaded: ${(file.size / 1024).toFixed(1)} KB`,
                        "success"
                    );


                    compressButton.onclick =
                        async () => {

                            try {

                                compressButton.disabled =
                                    true;

                                compressButton.textContent =
                                    "Compressing...";


                                const quality =
                                    parseInt(
                                        qualitySlider.value,
                                        10
                                    ) / 100;


                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );


                                canvas.width =
                                    image.naturalWidth;

                                canvas.height =
                                    image.naturalHeight;


                                const context =
                                    canvas.getContext(
                                        "2d"
                                    );


                                context.drawImage(
                                    image,
                                    0,
                                    0
                                );


                                const blob =
                                    await canvasToBlob(
                                        canvas,
                                        "image/jpeg",
                                        quality
                                    );


                                downloadBlob(
                                    blob,
                                    "TOOLNEX-Compressed-Image.jpg"
                                );


                                const oldSize =
                                    (
                                        file.size /
                                        1024
                                    ).toFixed(1);


                                const newSize =
                                    (
                                        blob.size /
                                        1024
                                    ).toFixed(1);


                                showStatus(
                                    workspace,
                                    `Compression complete: ${oldSize} KB → ${newSize} KB. Download started.`,
                                    "success"
                                );


                            } catch (error) {

                                console.error(
                                    "TOOLNEX Compression Error:",
                                    error
                                );


                                showStatus(
                                    workspace,
                                    "Unable to compress this image.",
                                    "error"
                                );

                            }


                            compressButton.disabled =
                                false;

                            compressButton.textContent =
                                "Compress & Download →";

                        };


                } catch (error) {

                    console.error(
                        "TOOLNEX Image Load Error:",
                        error
                    );


                    showStatus(
                        workspace,
                        "Unable to load this image.",
                        "error"
                    );

                }

            }
        );

    }


    /* =====================================================
       3. IMAGE CONVERTER
    ===================================================== */

    const convertInput =
        document.getElementById(
            "convertImageInput"
        );


    if (convertInput) {

        convertInput.addEventListener(
            "change",
            async () => {

                const file =
                    convertInput.files?.[0];

                if (!file) return;


                const workspace =
                    convertInput.closest(
                        ".tool-workspace"
                    );


                if (!workspace) return;


                try {

                    const image =
                        await loadImage(file);


                    let controls =
                        workspace.querySelector(
                            ".image-converter-controls"
                        );


                    if (!controls) {

                        controls =
                            document.createElement("div");

                        controls.className =
                            "image-converter-controls";

                        controls.style.width =
                            "100%";

                        controls.style.marginTop =
                            "18px";


                        controls.innerHTML = `

                            <label>
                                Convert to

                                <select
                                    class="convert-format"
                                >
                                    <option value="image/png">
                                        PNG
                                    </option>

                                    <option value="image/jpeg">
                                        JPG
                                    </option>

                                    <option value="image/webp">
                                        WEBP
                                    </option>
                                </select>

                            </label>

                        `;


                        workspace.appendChild(
                            controls
                        );

                    }


                    const formatSelect =
                        controls.querySelector(
                            ".convert-format"
                        );


                    let convertButton =
                        workspace.querySelector(
                            ".convert-image-button"
                        );


                    if (!convertButton) {

                        convertButton =
                            createButton(
                                "Convert & Download →"
                            );

                        convertButton.classList.add(
                            "convert-image-button"
                        );

                        convertButton.style.width =
                            "100%";

                        convertButton.style.marginTop =
                            "14px";


                        workspace.appendChild(
                            convertButton
                        );

                    }


                    showStatus(
                        workspace,
                        `Image loaded: ${image.naturalWidth} × ${image.naturalHeight}px`,
                        "success"
                    );


                    convertButton.onclick =
                        async () => {

                            try {

                                convertButton.disabled =
                                    true;

                                convertButton.textContent =
                                    "Converting...";


                                const format =
                                    formatSelect.value;


                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );


                                canvas.width =
                                    image.naturalWidth;

                                canvas.height =
                                    image.naturalHeight;


                                const context =
                                    canvas.getContext(
                                        "2d"
                                    );


                                context.drawImage(
                                    image,
                                    0,
                                    0
                                );


                                const blob =
                                    await canvasToBlob(
                                        canvas,
                                        format,
                                        format ===
                                            "image/png"
                                            ? undefined
                                            : 0.92
                                    );


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


                                downloadBlob(
                                    blob,
                                    `TOOLNEX-Converted-Image.${extension}`
                                );


                                showStatus(
                                    workspace,
                                    `Image converted to ${extension.toUpperCase()}. Download started.`,
                                    "success"
                                );


                            } catch (error) {

                                console.error(
                                    "TOOLNEX Converter Error:",
                                    error
                                );


                                showStatus(
                                    workspace,
                                    "Unable to convert this image.",
                                    "error"
                                );

                            }


                            convertButton.disabled =
                                false;

                            convertButton.textContent =
                                "Convert & Download →";

                        };


                } catch (error) {

                    console.error(
                        "TOOLNEX Converter Load Error:",
                        error
                    );


                    showStatus(
                        workspace,
                        "Unable to load this image.",
                        "error"
                    );

                }

            }
        );

    }


    /* =====================================================
       4. IMAGE INFORMATION
    ===================================================== */

    const informationCard =
        document.querySelector(
            '[data-tool*="information"]'
        );


    if (informationCard) {

        informationCard.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest("a")
                ) return;

            }
        );

    }


    console.log(
        "TOOLNEX Image Tools loaded successfully."
    );

});

