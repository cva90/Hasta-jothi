"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       ELEMENTS
    ================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const header = document.querySelector("header");
    const themeToggle = document.querySelector(".theme-toggle");
    const bookingForm = document.querySelector("#bookingForm");


    /* ================================
       MOBILE MENU
    ================================= */

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* ================================
       SMOOTH SCROLL
    ================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const target = document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* ================================
       HEADER SCROLL
    ================================= */

    function updateHeader() {

        if (!header) {
            return;
        }

        header.classList.toggle(
            "scrolled",
            window.scrollY > 80
        );

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* ================================
       DARK MODE
    ================================= */

    if (themeToggle) {

        const savedTheme =
            localStorage.getItem("hastaJothiTheme");

        if (savedTheme === "dark") {

            document.body.classList.add("dark-mode");

            themeToggle.textContent = "☀️";

        } else {

            document.body.classList.remove("dark-mode");

            themeToggle.textContent = "🌙";

        }


        themeToggle.addEventListener("click", () => {

            const isDark =
                document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "hastaJothiTheme",
                isDark ? "dark" : "light"
            );

            themeToggle.textContent =
                isDark ? "☀️" : "🌙";

        });

    }


    /* ================================
       PROGRAM SEARCH / FILTER
    ================================= */

    const programSearch =
        document.querySelector("#programSearch");

    const programCategory =
        document.querySelector("#programCategory");

    const programCards =
        document.querySelectorAll(
            "#programs .card, .program-card"
        );

    const programResult =
        document.querySelector("#programResult");


    function filterPrograms() {

        const searchText =
            programSearch
                ? programSearch.value.toLowerCase().trim()
                : "";

        const category =
            programCategory
                ? programCategory.value.toLowerCase()
                : "all";

        let count = 0;

        programCards.forEach(card => {

            const text =
                card.textContent.toLowerCase();

            const cardCategory =
                (card.dataset.category || "")
                    .toLowerCase();

            const matchesSearch =
                text.includes(searchText);

            const matchesCategory =
                category === "all" ||
                cardCategory === category;

            const show =
                matchesSearch && matchesCategory;

            card.style.display =
                show ? "" : "none";

            if (show) {
                count++;
            }

        });

        if (programResult) {

            programResult.textContent =
                count === 0
                    ? "No programs found."
                    : `${count} program(s) found.`;

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


    /* ================================
       BOOKING FORM
    ================================= */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const name =
                    document.querySelector("#name");

                const email =
                    document.querySelector("#email");

                const phone =
                    document.querySelector("#phone");

                const program =
                    document.querySelector("#program");

                const message =
                    document.querySelector("#message");

                const submitButton =
                    bookingForm.querySelector(
                        'button[type="submit"]'
                    );


                if (
                    !name ||
                    name.value.trim().length < 2
                ) {

                    alert(
                        "Please enter your full name."
                    );

                    return;

                }


                if (
                    !email ||
                    !email.value.includes("@")
                ) {

                    alert(
                        "Please enter a valid email."
                    );

                    return;

                }


                if (
                    !program ||
                    !program.value
                ) {

                    alert(
                        "Please select a program."
                    );

                    return;

                }


                const bookingData = {

                    name:
                        name.value.trim(),

                    email:
                        email.value.trim(),

                    phone:
                        phone
                            ? phone.value.trim()
                            : "",

                    program:
                        program.value,

                    message:
                        message
                            ? message.value.trim()
                            : ""

                };


                try {

                    if (submitButton) {

                        submitButton.disabled = true;

                        submitButton.textContent =
                            "BOOKING...";

                    }


                    const response =
                        await fetch(
                            "https://hasta-jothi.onrender.com/api/bookings",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        bookingData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    if (
                        response.ok &&
                        result.success
                    ) {

                        alert(
                            "Booking saved successfully! 🍃"
                        );

                        bookingForm.reset();

                    } else {

                        alert(
                            result.message ||
                            "Booking failed."
                        );

                    }

                } catch (error) {

                    console.error(error);

                    alert(
                        "Unable to connect to booking server."
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "BOOK NOW";

                    }

                }

            }
        );

    }


    /* ================================
       BACK TO TOP
    ================================= */

    const backToTop =
        document.querySelector(".back-to-top");

    if (backToTop) {

        window.addEventListener(
            "scroll",
            () => {

                backToTop.classList.toggle(
                    "show",
                    window.scrollY > 500
                );

            },
            { passive: true }
        );

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


    console.log(
        "Hasta Jothi JavaScript working successfully!"
    );

});
