document.addEventListener("DOMContentLoaded", () => {
/* ========================================
   MOBILE SIDEBAR MENU
======================================== */

const menuToggle =
    document.querySelector("#menuToggle");

const adminSidebar =
    document.querySelector("#adminSidebar");


if (menuToggle && adminSidebar) {

    menuToggle.addEventListener("click", () => {

        adminSidebar.classList.toggle("show");

    });

}
    const API_URL = "http://localhost:3000";
    let allBookings = [];
let currentPage = 1;

const bookingsPerPage = 5;

    /* ========================================
       TOAST
    ======================================== */

    function showToast(message, type = "success") {

        let container =
            document.querySelector(".toast-container");

        if (!container) {

            container =
                document.createElement("div");

            container.className =
                "toast-container";

            document.body.appendChild(container);

        }

        const toast =
            document.createElement("div");

        toast.className =
            `toast ${type}`;

        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {

            toast.remove();

        }, 3000);

    }


    /* ========================================
       LOGIN
    ======================================== */

    const loginForm =
        document.querySelector("#adminLoginForm");

    const emailInput =
        document.querySelector("#adminEmail");

    const passwordInput =
        document.querySelector("#adminPassword");

    const togglePassword =
        document.querySelector("#togglePassword");

    const loginMessage =
        document.querySelector("#loginMessage");


    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "👁";

            }

        });

    }


    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();


            loginMessage.textContent =
                "Logging in...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/admin/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (data.success) {

                   localStorage.setItem("adminToken",data.token);
                    


                    loginMessage.textContent =
                        "Login successful!";


                    loginMessage.className =
                        "login-message success";


                    setTimeout(() => {

                        window.location.href =
                            "dashboard.html";

                    }, 800);

                } else {

                    loginMessage.textContent =
                        data.message ||
                        "Invalid email or password";


                    loginMessage.className =
                        "login-message error";

                }


            } catch (error) {

                console.error(error);

                loginMessage.textContent =
                    "Cannot connect to server";


                loginMessage.className =
                    "login-message error";

            }

        });

    }


    /* ========================================
       DASHBOARD PROTECTION
    ======================================== */

    const dashboardPage =
        document.querySelector(".dashboard-page");


    if (dashboardPage) {

        const adminToken =
    localStorage.getItem(
        "adminToken"
    );

if (!adminToken) {

    window.location.replace(
        "admin.html"
    );

    return;
}
    }
    function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.replace(
        "admin.html"
    );

}


    /* ========================================
       DASHBOARD ELEMENTS
    ======================================== */

    const bookingsTableBody =
        document.querySelector(
            "#bookingsTableBody"
        );

    const bookingLoading =
        document.querySelector(
            "#bookingLoading"
        );

    const bookingError =
        document.querySelector(
            "#bookingError"
        );

    const totalBookings =
        document.querySelector(
            "#totalBookings"
        );

    const pendingBookings =
        document.querySelector(
            "#pendingBookings"
        );

    const todayBookings =
        document.querySelector(
            "#todayBookings"
        );

    const refreshBookings =
        document.querySelector(
            "#refreshBookings"
        );

    const logoutButton =
        document.querySelector(
            "#logoutButton"
        );

    const bookingSearch =
        document.querySelector(
            "#bookingSearch"
        );

    const programFilter =
        document.querySelector(
            "#programFilter"
        );

    const statusFilter =
        document.querySelector(
            "#statusFilter"
        );
        const pagination =
    document.querySelector(
        "#pagination"
    );



    /* ========================================
       DATE
    ======================================== */

    const currentDate =
        document.querySelector(
            "#currentDate"
        );


    if (currentDate) {

        currentDate.textContent =
            new Date().toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );

    }


    /* ========================================
       LOGOUT
    ======================================== */

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            localStorage.removeItem(
    "adminToken"
);

            window.location.replace(
                "admin.html"
            );

        });

    }


    /* ========================================
       LOAD BOOKINGS
    ======================================== */

    /* ========================================
   LOAD BOOKINGS
======================================== */

async function loadBookings() {

    if (!bookingsTableBody) return;

    const token =
        localStorage.getItem("adminToken");

    if (!token) {

        window.location.replace("admin.html");

        return;
    }

    bookingLoading.style.display = "block";

    bookingError.textContent = "";

    bookingsTableBody.innerHTML = "";

    try {

        const response = await fetch(
            `${API_URL}/api/bookings`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        /* TOKEN EXPIRED / INVALID */

        if (response.status === 401) {

            localStorage.removeItem(
                "adminToken"
            );

            alert(
                "Admin session expired. Please login again."
            );

            window.location.replace(
                "admin.html"
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "📦 Booking API response:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load bookings"
            );

        }


        allBookings =
            Array.isArray(data.bookings)
                ? data.bookings
                : [];


        console.log(
            "📋 Total bookings:",
            allBookings.length
        );


        /* UPDATE DASHBOARD */

        updateStatistics();

        updateProgramAnalytics();

        displayBookings(
            allBookings
        );


    } catch (error) {

        console.error(
            "❌ Booking loading error:",
            error
        );

        bookingError.textContent =
            "Unable to load bookings.";

    } finally {

        bookingLoading.style.display =
            "none";

    }

}


    /* ========================================
       STATISTICS
    ======================================== */

   /* ========================================
   STATISTICS
======================================== */

function updateStatistics(bookings = allBookings) {

    /* TOTAL BOOKINGS */

    if (totalBookings) {

        totalBookings.textContent =
            bookings.length;

    }


    /* PENDING BOOKINGS */

    const pending =
        bookings.filter(booking => {

            return (
                !booking.status ||
                booking.status === "Pending"
            );

        });


    if (pendingBookings) {

        pendingBookings.textContent =
            pending.length;

    }


    /* TODAY'S BOOKINGS */

    const today =
        new Date().toDateString();


    const todayCount =
        bookings.filter(booking => {

            if (!booking.createdAt) {

                return false;

            }


            return (
                new Date(
                    booking.createdAt
                ).toDateString() === today
            );

        });


    if (todayBookings) {

        todayBookings.textContent =
            todayCount.length;

    }

}
/* ========================================
   PROGRAM ANALYTICS
======================================== */

/* ========================================
   PROGRAM ANALYTICS
======================================== */

function updateProgramAnalytics(bookings = allBookings) {

    const programs = {

        "Mindfulness Meditation":
            "mindfulnessCount",

        "Breathing Meditation":
            "breathingCount",

        "Morning Meditation":
            "morningCount",

        "Stress Relief Meditation":
            "stressCount",

        "Healing Sessions":
            "healingCount",

        "Personal Wellness":
            "wellnessCount"

    };


    /* RESET ALL COUNTS */

    Object.values(programs).forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent = "0";

        }

    });


    /* COUNT FILTERED BOOKINGS */

    bookings.forEach(booking => {

        const programName =
            (booking.program || "").trim();


        const elementId =
            programs[programName];


        if (!elementId) {

            return;

        }


        const element =
            document.getElementById(elementId);


        if (element) {

            element.textContent =
                Number(element.textContent) + 1;

        }

    });

}
    /* ========================================
       DISPLAY BOOKINGS
    ======================================== */

  function displayBookings(bookings) {

    if (!bookingsTableBody) return;

    bookingsTableBody.innerHTML = "";


    if (bookings.length === 0) {

        bookingsTableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:30px;">
                    No bookings found
                </td>
            </tr>
        `;

        if (pagination) {
            pagination.innerHTML = "";
        }

        return;

    }


    /* ========================================
       PAGINATION CALCULATION
    ======================================== */

    const totalPages =
        Math.ceil(
            bookings.length / bookingsPerPage
        );


    if (currentPage > totalPages) {
        currentPage = totalPages;
    }


    const startIndex =
        (currentPage - 1) * bookingsPerPage;

    const endIndex =
        startIndex + bookingsPerPage;


    const pageBookings =
        bookings.slice(
            startIndex,
            endIndex
        );


    /* ========================================
       DISPLAY CURRENT PAGE BOOKINGS
    ======================================== */

    pageBookings.forEach(booking => {

        const row =
            document.createElement("tr");


        const bookingDate =
            booking.createdAt
                ? new Date(
                    booking.createdAt
                ).toLocaleDateString("en-IN")
                : "-";


        const currentStatus =
            booking.status || "Pending";


        row.innerHTML = `

            <td>${escapeHTML(booking.name || "-")}</td>

            <td>${escapeHTML(booking.email || "-")}</td>

            <td>${escapeHTML(booking.phone || "-")}</td>

            <td>${escapeHTML(booking.program || "-")}</td>

            <td>
                ${escapeHTML(
                    booking.message || "-"
                )}
            </td>

            <td>${bookingDate}</td>

            <td>

                <select
                    class="status-select"
                    data-id="${booking._id}"
                >

                    <option value="Pending"
                        ${currentStatus === "Pending"
                            ? "selected"
                            : ""}>
                        Pending
                    </option>

                    <option value="Confirmed"
                        ${currentStatus === "Confirmed"
                            ? "selected"
                            : ""}>
                        Confirmed
                    </option>

                    <option value="Completed"
                        ${currentStatus === "Completed"
                            ? "selected"
                            : ""}>
                        Completed
                    </option>

                    <option value="Cancelled"
                        ${currentStatus === "Cancelled"
                            ? "selected"
                            : ""}>
                        Cancelled
                    </option>

                </select>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="view-button"
                        data-id="${booking._id}"
                    >
                        👁 View
                    </button>

                    <button
                        class="delete-button"
                        data-id="${booking._id}"
                    >
                        🗑 Delete
                    </button>

                </div>

            </td>

        `;


        bookingsTableBody.appendChild(row);

    });


    /* ========================================
       BUTTON EVENTS
    ======================================== */

    addStatusEvents();

    addViewEvents();

    addDeleteEvents();


    /* ========================================
       RENDER PAGINATION
    ======================================== */

    renderPagination(
        totalPages,
        bookings
    );

}
function renderPagination(
    totalPages,
    bookings
) {

    if (!pagination) return;


    pagination.innerHTML = "";


    if (totalPages <= 1) {
        return;
    }


    /* PREVIOUS BUTTON */

    const previousButton =
        document.createElement("button");

    previousButton.textContent =
        "← Previous";

    previousButton.disabled =
        currentPage === 1;


    previousButton.addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                currentPage--;

                displayBookings(
                    bookings
                );

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    /* PAGE NUMBER BUTTONS */

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement("button");


        pageButton.textContent =
            page;


        if (page === currentPage) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.addEventListener(
            "click",
            () => {

                currentPage = page;

                displayBookings(
                    bookings
                );

            }
        );


        pagination.appendChild(
            pageButton
        );

    }


    /* NEXT BUTTON */

    const nextButton =
        document.createElement("button");

    nextButton.textContent =
        "Next →";

    nextButton.disabled =
        currentPage === totalPages;


    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentPage < totalPages
            ) {

                currentPage++;

                displayBookings(
                    bookings
                );

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}
    /* ========================================
       VIEW BOOKING DETAILS
    ======================================== */

   function addViewEvents() {

    const viewButtons =
        document.querySelectorAll(".view-button");

    viewButtons.forEach(button => {

        button.addEventListener("click", function () {

            const bookingId =
                this.getAttribute("data-id");

            console.log("👁 View clicked:", bookingId);

            const booking =
                allBookings.find(
                    item =>
                        String(item._id) ===
                        String(bookingId)
                );

            if (!booking) {

                console.error(
                    "❌ Booking not found:",
                    bookingId
                );

                showToast(
                    "Booking details not found",
                    "error"
                );

                return;
            }

            showBookingDetails(booking);

        });

    });

}

    function showBookingDetails(booking) {

        const oldModal =
            document.querySelector(
                ".booking-modal-overlay"
            );


        if (oldModal) {

            oldModal.remove();

        }


        const date =
            booking.createdAt
                ? new Date(
                    booking.createdAt
                ).toLocaleString("en-IN")
                : "-";


        const modal =
            document.createElement("div");

        modal.className =
            "booking-modal-overlay";


        modal.innerHTML = `

            <div class="booking-modal">

                <button
                    class="modal-close"
                    aria-label="Close"
                >
                    ×
                </button>

                <h2>Booking Details</h2>

                <div class="booking-detail">

                    <strong>Name:</strong>
                    <span>${escapeHTML(booking.name || "-")}</span>

                </div>

                <div class="booking-detail">

                    <strong>Email:</strong>
                    <span>${escapeHTML(booking.email || "-")}</span>

                </div>

                <div class="booking-detail">

                    <strong>Phone:</strong>
                    <span>${escapeHTML(booking.phone || "-")}</span>

                </div>

                <div class="booking-detail">

                    <strong>Program:</strong>
                    <span>${escapeHTML(booking.program || "-")}</span>

                </div>

                <div class="booking-detail">

                    <strong>Status:</strong>
                    <span>${escapeHTML(booking.status || "Pending")}</span>

                </div>

                <div class="booking-detail">

                    <strong>Booking Date:</strong>
                    <span>${date}</span>

                </div>

                <div class="booking-detail message-detail">

                    <strong>Message:</strong>

                    <p>
                        ${escapeHTML(
                            booking.message || "No message"
                        )}
                    </p>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        const closeModal = () => {

            modal.remove();

        };


        modal
            .querySelector(".modal-close")
            .addEventListener(
                "click",
                closeModal
            );


        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {

                    closeModal();

                }

            }
        );

    }


    /* ========================================
       UPDATE STATUS
    ======================================== */

    function addStatusEvents() {

        document
            .querySelectorAll(".status-select")
            .forEach(select => {

                select.addEventListener(
                    "change",
                    async () => {

                        try {

                            const response =
                                await fetch(
                                    `${API_URL}/api/bookings/${select.dataset.id}/status`,
                                    {
                                        method: "PUT",

                                        headers: {
    "Content-Type":
        "application/json",

    "Authorization":
        `Bearer ${localStorage.getItem("adminToken")}`
},
                                        body:
                                            JSON.stringify({
                                                status:
                                                    select.value
                                            })
                                    }
                                );


                            const data =
                                await response.json();


                            if (data.success) {

                                showToast(
                                    "Booking status updated successfully!"
                                );

                                loadBookings();

                            } else {

                                showToast(
                                    data.message ||
                                    "Status update failed",
                                    "error"
                                );

                            }


                        } catch (error) {

                            console.error(error);

                            showToast(
                                "Unable to update status",
                                "error"
                            );

                        }

                    }
                );

            });

    }


    /* ========================================
       DELETE BOOKING
    ======================================== */

    function addDeleteEvents() {

        document
            .querySelectorAll(".delete-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const confirmed =
                            confirm(
                                "Are you sure you want to delete this booking?"
                            );


                        if (!confirmed) return;


                        try {

                            const response =
                               await fetch(
    `${API_URL}/api/bookings/${button.dataset.id}`,
    {
        method: "DELETE",

        headers: {
            "Authorization":
                `Bearer ${localStorage.getItem("adminToken")}`
        }
    }
);


                            const data =
                                await response.json();


                            if (data.success) {

                                showToast(
                                    "Booking deleted successfully!"
                                );

                                loadBookings();

                            } else {

                                showToast(
                                    data.message ||
                                    "Delete failed",
                                    "error"
                                );

                            }


                        } catch (error) {

                            console.error(error);

                            showToast(
                                "Unable to delete booking",
                                "error"
                            );

                        }

                    }
                );

            });

    }


   

  /* ========================================
   SEARCH + FILTER
======================================== */

function filterBookings() {

    currentPage = 1;


    const searchText =
        bookingSearch
            ? bookingSearch.value
                .toLowerCase()
                .trim()
            : "";


    const selectedProgram =
        programFilter
            ? programFilter.value
            : "all";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    /* ========================================
       FILTER ALL BOOKINGS
    ======================================== */

    const filtered =
        allBookings.filter(booking => {


            /* SEARCH */

            const matchesSearch =

                !searchText

                ||

                (booking.name || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (booking.email || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    booking.phone || ""
                ).includes(searchText);


            /* PROGRAM */

            const matchesProgram =

                selectedProgram === "all"

                ||

                (booking.program || "")
                    .trim() ===
                selectedProgram.trim();


            /* STATUS */

            const matchesStatus =

                selectedStatus === "all"

                ||

                (booking.status || "Pending")
                    .trim() ===
                selectedStatus.trim();


            return (
                matchesSearch &&
                matchesProgram &&
                matchesStatus
            );

        });


    /* ========================================
       DISPLAY FILTERED BOOKINGS
    ======================================== */

    displayBookings(filtered);



}


/* ========================================
   APPLY FILTER BUTTON
======================================== */

const applyFilters =
    document.getElementById("applyFilters");


if (applyFilters) {

    applyFilters.addEventListener(
        "click",
        filterBookings
    );

}


/* ========================================
   REFRESH
======================================== */

if (refreshBookings) {

    refreshBookings.addEventListener(
        "click",
        loadBookings
    );

}


/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* ========================================
   START DASHBOARD
======================================== */

if (dashboardPage) {

    loadBookings();

}

});
