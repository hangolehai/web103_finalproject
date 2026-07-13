# Milestone 2

This document should be completed and submitted during **Unit 6** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
  - [x] Include a list of pages in your app
- [x] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
  - [x] Your entity relationship diagram should include the tables in your database.
- [x] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
  - [x] You do **not** need to submit any materials in advance of your pitch.
- [x] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

Designing the wireframes went exceptionally well. Having a visual reference early on clarified how users will list tools and skills, request reservations, and manage listings on their dashboards. Building the ERD helped us clearly define key relationships (e.g., tracking who borrows what and ensuring no overlapping dates), saving us time when we start writing code.

### 2. What were some challenges your group faced in this unit?

Our primary challenge was designing the reservation schema to cleanly support the double-booking validation custom feature. We had to decide on the best way to handle start/end dates in PostgreSQL and design queries that will prevent duplicate bookings for the same dates.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

As we begin setting up the database and Express REST API endpoints in the next milestones, having extra resources on constructing date range queries in SQL and handling secure user authentication would be very helpful.

