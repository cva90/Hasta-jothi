"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/* =========================================
   SERVE FRONTEND WEBSITE
========================================= */

const FRONTEND_PATH = __dirname;

app.use(express.static(FRONTEND_PATH));


/* =========================================
   MONGODB CONNECTION
========================================= */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {

    console.error(
        "❌ MONGODB_URI is missing in environment variables."
    );

} else {

    mongoose.connect(MONGODB_URI)
        .then(() => {

            console.log(
                "✅ MongoDB connected successfully! 🍃"
            );

            console.log(
                "📂 Database:",
                mongoose.connection.name
            );

        })
        .catch((error) => {

            console.error(
                "❌ MongoDB connection error:",
                error.message
            );

        });

}


/* =========================================
   BOOKING SCHEMA
========================================= */

const bookingSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    program: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        trim: true,
        default: ""
    },

    status: {
        type: String,

        enum: [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ],

        default: "Pending"
    }

}, {

    timestamps: true

});


/* =========================================
   BOOKING MODEL
========================================= */

const Booking = mongoose.model(
    "Booking",
    bookingSchema
);


/* =========================================
   TEST / STATUS ROUTE
========================================= */

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Hasta Jothi Backend is running! 🍃",

            database:
                mongoose.connection.name,

            mongoState:
                mongoose.connection.readyState

        });

    }
);


/* =========================================
   CREATE BOOKING
========================================= */

app.post(
    "/api/bookings",
    async (req, res) => {

        try {

            console.log(
                "\n=============================="
            );

            console.log(
                "📩 NEW BOOKING RECEIVED"
            );

            console.log(
                "=============================="
            );

            console.log(req.body);


            const {
                name,
                email,
                phone,
                program,
                message
            } = req.body;


            if (
                !name ||
                !email ||
                !phone ||
                !program
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, email, phone and program are required."

                });

            }


            if (
                mongoose.connection.readyState !== 1
            ) {

                return res.status(503).json({

                    success: false,

                    message:
                        "Database is not connected."

                });

            }


            const newBooking =
                await Booking.create({

                    name: name.trim(),

                    email: email.trim(),

                    phone: phone.trim(),

                    program: program.trim(),

                    message:
                        message
                            ? message.trim()
                            : ""

                });


            console.log(
                "✅ BOOKING SAVED SUCCESSFULLY!"
            );

            console.log(
                "🆔 Booking ID:",
                newBooking._id
            );


            res.status(201).json({

                success: true,

                message:
                    "Booking saved successfully!",

                booking:
                    newBooking

            });

        } catch (error) {

            console.error(
                "❌ Booking error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to save booking.",

                error:
                    error.message

            });

        }

    }
);


/* =========================================
   GET ALL BOOKINGS
========================================= */

app.get(
    "/api/bookings",
    async (req, res) => {

        try {

            console.log(
                "📥 Fetching bookings..."
            );


            const bookings =
                await Booking.find()
                    .sort({
                        createdAt: -1
                    })
                    .lean();


            console.log(
                `✅ ${bookings.length} booking(s) found`
            );


            res.status(200).json({

                success: true,

                count:
                    bookings.length,

                bookings:
                    bookings

            });

        } catch (error) {

            console.error(
                "❌ Error fetching bookings:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch bookings.",

                error:
                    error.message

            });

        }

    }
);


/* =========================================
   ADMIN LOGIN
========================================= */

app.post(
    "/api/admin/login",
    (req, res) => {

        const {
            email,
            password
        } = req.body;


        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {

            return res.json({

                success: true,

                message:
                    "Admin login successful"

            });

        }


        res.status(401).json({

            success: false,

            message:
                "Invalid email or password"

        });

    }
);


/* =========================================
   UPDATE BOOKING STATUS
========================================= */

app.put(
    "/api/bookings/:id/status",
    async (req, res) => {

        try {

            const {
                status
            } = req.body;


            const allowedStatus = [

                "Pending",

                "Confirmed",

                "Completed",

                "Cancelled"

            ];


            if (
                !allowedStatus.includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid booking status"

                });

            }


            const booking =
                await Booking.findByIdAndUpdate(

                    req.params.id,

                    {
                        status: status
                    },

                    {
                        new: true
                    }

                );


            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Booking not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Booking status updated",

                booking:
                    booking

            });

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to update booking status"

            });

        }

    }
);


/* =========================================
   DELETE BOOKING
========================================= */

app.delete(
    "/api/bookings/:id",
    async (req, res) => {

        try {

            const booking =
                await Booking.findByIdAndDelete(
                    req.params.id
                );


            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Booking not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Booking deleted successfully"

            });

        } catch (error) {

            console.error(
                "Delete booking error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to delete booking"

            });

        }

    }
);


/* =========================================
   START SERVER
========================================= */

app.listen(
    PORT,
    () => {

        console.log(
            "================================="
        );

        console.log(
            "🚀 Hasta Jothi Backend running!"
        );

        console.log(
            `🌐 Website: http://localhost:${PORT}`
        );

        console.log(
            `📡 API: http://localhost:${PORT}/api/bookings`
        );

        console.log(
            "================================="
        );

    }
);
