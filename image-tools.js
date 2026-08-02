/* =========================================================
   TOOLNEX — IMAGE TOOLS JAVASCRIPT
   IMAGE RESIZER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("resizeImageInput");

    if (!input) return;

    input.addEventListener("change", () => {

        const file = input.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please choose a valid image file.");
            input.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = event => {

            const image = new Image();

            image.onload = () => {

                const width = image.naturalWidth;
                const height = image.naturalHeight;

                const newWidth = prompt(
                    `Original size: ${width} × ${height}px\n\nEnter new width in pixels:`,
                    width
                );

                if (newWidth === null) {
                    input.value = "";
                    return;
                }

                const parsedWidth = Number(newWidth);

                if (
                    !Number.isFinite(parsedWidth) ||
                    parsedWidth <= 0
                ) {
                    alert("Please enter a valid width.");
                    input.value = "";
                    return;
                }

                const ratio = height / width;

                const newHeight =
                    Math.round(parsedWidth * ratio);

                const canvas =
                    document.createElement("canvas");

                canvas.width = Math.round(parsedWidth);
                canvas.height = newHeight;

                const context =
                    canvas.getContext("2d");

                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                canvas.toBlob(
                    blob => {

                        if (!blob) {
                            alert(
                                "Unable to create the resized image."
                            );
                            return;
                        }

                        const url =
                            URL.createObjectURL(blob);

                        const link =
                            document.createElement("a");

                        link.href = url;

                        link.download =
                            "TOOLNEX-Resized-Image.png";

                        document.body.appendChild(link);

                        link.click();

                        link.remove();

                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                        }, 1000);

                        alert(
                            `Image resized successfully!\n\nNew size: ${canvas.width} × ${canvas.height}px`
                        );

                    },
                    "image/png"
                );

            };

            image.onerror = () => {

                alert(
                    "Unable to read this image."
                );

            };

            image.src = event.target.result;

        };

        reader.onerror = () => {

            alert(
                "Unable to load the selected image."
            );

        };

        reader.readAsDataURL(file);

    });

});

