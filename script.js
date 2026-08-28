"use strict";

/* =========================================================
   HASTA JOTHI MEDITATION & HEALING CENTRE
   FINAL COMPLETE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Hasta Jothi website loaded successfully!");

    /* =====================================================
       01. ELEMENT SELECTORS
    ===================================================== */

    const body = document.body;
    const header = document.querySelector("header");

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    const themeToggle = document.querySelector(".theme-toggle");

    const bookingForm = document.querySelector(".booking-form");

    const backToTop = document.querySelector(".back-to-top");

    const programSearch =
        document.querySelector("#programSearch");

    const programCategory =
        document.querySelector("#programCategory");

    const programCards =
        document.querySelectorAll(".card[data-category]");

    const programResult =
        document.querySelector("#programResult");

    const modal =
        document.querySelector(".program-modal");

    const modalClose =
        document.querySelector(".modal-close");

    const modalTitle =
        document.querySelector(".modal-title");

    const modalDescription =
        document.querySelector(".modal-description");

    const modalNumber =
        document.querySelector(".modal-number");

    const modalDuration =
        document.querySelector(".modal-duration");

    const modalLevel =
        document.querySelector(".modal-level");

    const modalBook =
        document.querySelector(".modal-book");


    /* =====================================================
       02. MOBILE MENU
    ===================================================== */

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        const mobileLinks =
            navLinks.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =====================================================
       03. DARK / LIGHT MODE
    ===================================================== */

    const savedTheme =
        localStorage.getItem("hastaJothiTheme");


    if (savedTheme === "dark") {

        body.classList.add("dark-mode");

    }


    function updateThemeButton() {

        if (!themeToggle) return;

        const isDark =
            body.classList.contains("dark-mode");

        themeToggle.textContent =
            isDark ? "☀️" : "🌙";

        themeToggle.setAttribute(
            "aria-pressed",
            isDark ? "true" : "false"
        );

        themeToggle.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

    }


    updateThemeButton();


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            body.classList.toggle("dark-mode");

            const isDark =
                body.classList.contains("dark-mode");

            localStorage.setItem(
                "hastaJothiTheme",
                isDark ? "dark" : "light"
            );

            updateThemeButton();

        });

    }


    /* =====================================================
       04. HEADER SCROLL EFFECT
    ===================================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       05. SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

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

            });

        });


    /* =====================================================
       06. PROGRAM SEARCH & FILTER
    ===================================================== */

    function filterPrograms() {

        if (!programCards.length) return;

        const searchText =
            programSearch
                ? programSearch.value
                    .toLowerCase()
                    .trim()
                : "";

        const selectedCategory =
            programCategory
                ? programCategory.value
                    .toLowerCase()
                    .trim()
                : "all";


        let visibleCount = 0;


        programCards.forEach(card => {

            const title =
                card.querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";

            const description =
                card.querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";

            const category =
                card.dataset.category
                    ?.toLowerCase() || "";


            const matchesSearch =

                title.includes(searchText) ||

                description.includes(searchText);


            const matchesCategory =

                selectedCategory === "all" ||

                category === selectedCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                card.classList.remove(
                    "filter-hidden"
                );

                visibleCount++;

            } else {

                card.classList.add(
                    "filter-hidden"
                );

            }

        });


        if (programResult) {

            if (visibleCount === 0) {

                programResult.textContent =
                    "No programs found.";

            }

            else if (visibleCount === 1) {

                programResult.textContent =
                    "1 program found.";

            }

            else {

                programResult.textContent =
                    `${visibleCount} programs found.`;

            }

        }

    }


    if (programSearch) {

        programSearch.addEventListener(
            "input",
            filterPrograms
        );

    }


    if (programCategory) {

        programCategory.addEventListener(
            "change",
            filterPrograms
        );

    }


    if (
        programCards.length &&
        (programSearch || programCategory)
    ) {

        filterPrograms();

    }


    /* =====================================================
       07. PROGRAM MODAL
    ===================================================== */

    const programDetails = {

        "mindfulness": {

            title:
                "Mindfulness Meditation",

            description:
                "A peaceful guided meditation practice designed to help you stay present, improve awareness and develop a calm and balanced mind.",

            duration:
                "60 Minutes",

            level:
                "Beginner Friendly"

        },


        "breathing": {

            title:
                "Breathing Meditation",

            description:
                "A guided breathing practice that helps calm the nervous system, improve focus and create a deeper sense of relaxation.",

            duration:
                "45 Minutes",

            level:
                "All Levels"

        },


        "morning": {

            title:
                "Morning Meditation",

            description:
                "Begin your day with positive energy, calm awareness and a peaceful mindset through a simple guided morning meditation.",

            duration:
                "45 Minutes",

            level:
                "All Levels"

        },


        "stress": {

            title:
                "Stress Relief Meditation",

            description:
                "A calming meditation practice focused on relaxation, emotional balance and releasing everyday stress and tension.",

            duration:
                "60 Minutes",

            level:
                "Beginner Friendly"

        },


        "healing": {

            title:
                "Healing Session",

            description:
                "A peaceful wellness session focused on relaxation, inner balance and personal healing through mindful practice.",

            duration:
                "60 Minutes",

            level:
                "Personal Session"

        },


        "wellness": {

            title:
                "Personal Wellness",

            description:
                "A personalised wellness practice designed to support your individual goals, balance and overall wellbeing.",

            duration:
                "Custom Session",

            level:
                "Personalised"

        }

    };


    const programButtons =
        document.querySelectorAll(
            "[data-program]"
        );


    function openProgramModal(
        programKey
    ) {

        if (
            !modal ||
            !programDetails[programKey]
        ) {
            return;
        }


        const program =
            programDetails[programKey];


        if (modalTitle) {

            modalTitle.textContent =
                program.title;

        }


        if (modalDescription) {

            modalDescription.textContent =
                program.description;

        }


        if (modalDuration) {

            modalDuration.textContent =
                `Duration: ${program.duration}`;

        }


        if (modalLevel) {

            modalLevel.textContent =
                `Level: ${program.level}`;

        }


        if (modalBook) {

            modalBook.href =
                "#booking";

        }


        modal.classList.add("active");

        body.style.overflow =
            "hidden";

    }


    function closeProgramModal() {

        if (!modal) return;

        modal.classList.remove("active");

        body.style.overflow = "";

    }


    programButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const programKey =
                    button.dataset.program;

                openProgramModal(
                    programKey
                );

            }
        );

    });


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeProgramModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeProgramModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains(
                    "active"
                )
            ) {

                closeProgramModal();

            }

        }
    );


    if (modalBook) {

        modalBook.addEventListener(
            "click",
            () => {

                closeProgramModal();

            }
        );

    }


    /* =====================================================
       08. FAQ
    ===================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq details"
        );


    faqItems.forEach(item => {

        item.addEventListener(
            "toggle",
            () => {

                if (!item.open) return;

                faqItems.forEach(other => {

                    if (
                        other !== item
                    ) {

                        other.open = false;

                    }

                });

            }
        );

    });


    /* =====================================================
       09. SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("visible");

                            revealObserver
                                .unobserve(
                                    entry.target
                                );

                        }

                    });

                },

                {

                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -50px 0px"

                }

            );


        revealElements.forEach(element => {

            revealObserver.observe(
                element
            );

        });

    }

    else {

        revealElements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

    }


    /* =====================================================
       10. BACK TO TOP
    ===================================================== */

    function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > 500) {

            backToTop.classList.add(
                "show"
            );

        }

        else {

            backToTop.classList.remove(
                "show"
            );

        }

    }


    updateBackToTop();


    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =====================================================
       11. GALLERY LIGHTBOX
    ===================================================== */

    const galleryImages =
        document.querySelectorAll(
            ".gallery-grid img"
        );


    let lightbox =
        document.querySelector(".lightbox");


    if (
        galleryImages.length &&
        !lightbox
    ) {

        lightbox =
            document.createElement("div");

        lightbox.className =
            "lightbox";

        lightbox.innerHTML = `

            <button
                class="lightbox-close"
                type="button"
                aria-label="Close image">

                ×

            </button>

            <img
                class="lightbox-image"
                src=""
                alt="Gallery image">

        `;


        document.body.appendChild(
            lightbox
        );

    }


    if (lightbox) {

        const lightboxImage =
            lightbox.querySelector(
                ".lightbox-image"
            );

        const lightboxClose =
            lightbox.querySelector(
                ".lightbox-close"
            );


        galleryImages.forEach(image => {

            image.style.cursor =
                "pointer";


            image.addEventListener(
                "click",
                () => {

                    if (!lightboxImage) return;

                    lightboxImage.src =
                        image.src;

                    lightboxImage.alt =
                        image.alt ||
                        "Gallery image";


                    lightbox.classList.add(
                        "active"
                    );

                    body.style.overflow =
                        "hidden";

                }
            );

        });


        if (lightboxClose) {

            lightboxClose.addEventListener(
                "click",
                () => {

                    lightbox.classList.remove(
                        "active"
                    );

                    body.style.overflow = "";

                }
            );

        }


        lightbox.addEventListener(
            "click",
            event => {

                if (
                    event.target === lightbox
                ) {

                    lightbox.classList.remove(
                        "active"
                    );

                    body.style.overflow = "";

                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    lightbox.classList.contains(
                        "active"
                    )
                ) {

                    lightbox.classList.remove(
                        "active"
                    );

                    body.style.overflow = "";

                }

            }
        );

    }


    /* =====================================================
       12. BOOKING FORM
    ===================================================== */

    /* =====================================================
   12. BOOKING FORM + MONGODB
===================================================== */

if (bookingForm) {

    bookingForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        console.log("📤 Booking form submitted");

        const bookingData = {
            name: document.querySelector("#name").value.trim(),
            email: document.querySelector("#email").value.trim(),
            phone: document.querySelector("#phone").value.trim(),
            program: document.querySelector("#program").value,
            message: document.querySelector("#message").value.trim()
        };

        console.log("📦 Sending booking data:", bookingData);

        if (
            !bookingData.name ||
            !bookingData.email ||
            !bookingData.phone ||
            !bookingData.program
        ) {

            alert("Please fill all required fields.");

            return;
        }

        const submitButton =
            bookingForm.querySelector(
                'button[type="submit"]'
            );

        const originalText =
            submitButton.textContent;

        try {

            submitButton.disabled = true;

            submitButton.textContent =
                "Submitting...";

            const response = await fetch(
                "http://localhost:3000/api/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(bookingData)
                }
            );

            console.log(
                "📡 Response status:",
                response.status
            );

            const result =
                await response.json();

            console.log(
                "📥 Server response:",
                result
            );

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Booking failed."
                );

            }

            alert(
                "Thank you, " +
                bookingData.name +
                "! Your booking has been received successfully."
            );

            bookingForm.reset();

        } catch (error) {

            console.error(
                "❌ Booking error:",
                error
            );

            alert(
                "Booking failed: " +
                error.message
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                originalText;

        }

    });

}

    /* =====================================================
       13. INITIAL PAGE SETUP
    ===================================================== */

    console.log(
        "All Hasta Jothi features initialized successfully!"
    );

});
