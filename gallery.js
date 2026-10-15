
document.addEventListener("DOMContentLoaded", () => {
    const garden = document.getElementById("garden");
    const bloomButton = document.getElementById("bloomButton");
    const flowerCaption = document.getElementById("flowerCaption");
    const photoSection = document.getElementById("photoSection");

    const photoCards = Array.from(
        document.querySelectorAll(".photo-card")
    );

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    if (
        !garden ||
        !bloomButton ||
        !flowerCaption ||
        !photoSection
    ) {
        console.error("Gallery: Required flower or gallery elements are missing.");
        return;
    }

    // Start with the gallery hidden and ready for its entrance animation.
    photoSection.hidden = true;
    photoSection.classList.remove("is-visible");

    // Give each picture a small, progressive entrance delay.
    photoCards.forEach((card, index) => {
        card.style.setProperty("--photo-index", index);
    });

    let bloomStarted = false;

    // FLOWER BLOOM AND GALLERY REVEAL
    bloomButton.addEventListener("click", () => {
        if (bloomStarted) {
            if (!photoSection.hidden) {
                photoSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
            return;
        }

        bloomStarted = true;
        bloomButton.disabled = true;

        garden.classList.add("is-bloomed");

        flowerCaption.textContent =
            "A little colour can change the day.";

        bloomButton.textContent = "Look what bloomed ✿";
        bloomButton.setAttribute("aria-expanded", "true");

        // Let the flower bloom before revealing the gallery.
        window.setTimeout(() => {
            photoSection.hidden = false;

            // Wait for the browser to register the section's initial state.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    photoSection.classList.add("is-visible");

                    // Start scrolling after the gallery begins appearing.
                    window.setTimeout(() => {
                        photoSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }, 250);
                });
            });

            bloomButton.disabled = false;
        }, 1100);
    });

    // LIGHTBOX VALIDATION
    if (
        !lightbox ||
        !lightboxImage ||
        !lightboxCounter ||
        !closeButton ||
        !previousButton ||
        !nextButton
    ) {
        console.error("Gallery: One or more lightbox elements are missing.");
        return;
    }

    const photos = photoCards.map((card) => {
        const image = card.querySelector("img");

        return {
            src: image ? image.getAttribute("src") : "",
            alt: image ? image.alt : "Photo"
        };
    });

    let currentPhoto = 0;
    let previousFocus = null;
    let touchStartX = 0;

    // SHOW A PHOTO IN THE LIGHTBOX
    function showPhoto(index) {
        if (photos.length === 0) return;

        currentPhoto =
            ((index % photos.length) + photos.length) % photos.length;

        lightboxImage.src = photos[currentPhoto].src;
        lightboxImage.alt = photos[currentPhoto].alt;

        lightboxCounter.textContent =
            `${String(currentPhoto + 1).padStart(2, "0")} / ` +
            `${String(photos.length).padStart(2, "0")}`;
    }

    // OPEN LIGHTBOX
    function openPhoto(index) {
        previousFocus = document.activeElement;

        showPhoto(index);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");

        closeButton.focus();
    }

    // CLOSE LIGHTBOX
    function closePhoto() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");

        lightboxImage.removeAttribute("src");

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    // CLICK A GALLERY PICTURE
    photoCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            openPhoto(index);
        });
    });

    // LIGHTBOX CONTROLS
    closeButton.addEventListener("click", closePhoto);

    previousButton.addEventListener("click", () => {
        showPhoto(currentPhoto - 1);
    });

    nextButton.addEventListener("click", () => {
        showPhoto(currentPhoto + 1);
    });

    // CLOSE WHEN CLICKING THE BACKGROUND
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closePhoto();
        }
    });

    // KEYBOARD CONTROLS
    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closePhoto();
        } else if (event.key === "ArrowLeft") {
            showPhoto(currentPhoto - 1);
        } else if (event.key === "ArrowRight") {
            showPhoto(currentPhoto + 1);
        }
    });

    // MOBILE SWIPE CONTROLS
    lightbox.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0].screenX;
        const difference = touchEndX - touchStartX;

        if (Math.abs(difference) > 50) {
            showPhoto(currentPhoto + (difference < 0 ? 1 : -1));
        }
    }, { passive: true });
});
