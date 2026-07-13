# LocalLoop

CodePath WEB103 Final Project

Designed and developed by: Le Hai Ha Ngo, An Dang, Duc Tran, Kevin Jerome

🔗 Link to deployed app: 

## About

### Description and Purpose

LocalLoop is a hyper-local neighborhood platform designed to foster community resilience, reduce consumer waste, and build stronger neighborhood connections by allowing residents to share physical tools and practical skills. Instead of buying a ladder or a power drill for a one-time home project, or hiring an expensive contractor for a minor repair, neighbors can borrow items or rent skills (like basic plumbing or cooking lessons) from people living right down the street. 

The purpose of the app is to save community members money, minimize individual environmental footprints, and reintroduce mutual aid into modern neighborhood ecosystems.

### Inspiration

We were inspired by the traditional concept of "borrowing a cup of sugar from a neighbor," modernized for today's digital sharing economy. Many households own expensive tools that sit in a garage or closet 99% of the year, while others lack access to those exact items when they need them most. By creating a trusted, organized local network, we want to make sustainable, community-driven resource sharing seamless, transparent, and highly accessible.

## Tech Stack

Frontend: React, React Router, CSS

Backend: Node.js, Express, PostgreSQL, Render

## Features

### User Listings Management (CRUD)

The platform supports a full RESTful API for handling item and skill listings. Users can create a new listing with specific details, view active listings, update their own listing details (such as description or availability parameters), and delete listings they no longer wish to share.

[gif goes here]

### Interactive On-Page Reservations

Borrowers can select available calendar slots and submit a reservation request directly on an item's detail view without navigating away or reloading the page, providing a fluid single-page interaction.

[gif goes here]

### Dynamic Category & Details Routing

Utilizing React Router, the app features dynamic frontend client-side routes that handle viewing specific product descriptions, user profiles, or filtering down into distinct item types without full-page server reloads.

[gif goes here]

### Administrative Database Reset

The application includes a built-in, secure endpoint allowing administrators or graders to instantly reset the PostgreSQL database back to its default seeded state for seamless feature evaluation.

[gif goes here]

### Reservation Date & Availability Validation (Custom Feature 1)

Before saving a new booking to the database, the Express backend cross-references incoming requests to validate that the requested start date is in the future and ensures the item isn't already double-booked for those exact dates.

[gif goes here]

### Smart Client-Side Filtering & Sorting (Custom Feature 2)

Users can instantly filter the main application feed by categories (e.g., Gardening, Power Tools, Automotive, Home Skills) and sort available tools alphabetically or by date posted to quickly locate what they need.

[gif goes here]

## Installation Instructions

[instructions go here - to be completed in a later milestone when repository setup is finished]