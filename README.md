# <div align="center"><b>Book Mate</b></div>

# Under active development

> This project is currently being improved to add more features.


## Table of Contents

- [Overview](#overview)
- [App Architecture](#app-architecture)
- [Hosting](#hosting)
- [Features](#features)
  - [Searching book](#searching-book)
  - [Add book to favorite list](#add-book-to-favorite-list)
  - [ChatGPT Integration](#chatGPT-integration)
  - [Stripe Subscription](#stripe-subscription)
  - [Dark Mode](#dark-mode)
- [Live Demo](#live-demo)

## Overview

This web application is designed for readers to search for books, view book details, save their favorite books, and utilize ChatGPT for any inquiries about the books.

# App Architecture

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: A superset of JavaScript that adds static types to the language.
- **[Next.js](https://nextjs.org/)**: A React framework for building server-side rendered React applications.
- **[Supabase](https://supabase.com/)**: An open-source Firebase alternative. It's a backend-as-a-service to quickly build web and mobile applications without managing infrastructure.
- **[Prisma ORM](https://www.prisma.io/)**: A modern database toolkit for TypeScript and Node.js that makes database access easy with an auto-generated query builder and TypeScript types for your database schema.
- **[Shadcn](https://ui.shadcn.com/)**: Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
- **[TailwindCSS](https://tailwindcss.com/)**: A utility-first CSS framework for building custom designs quickly and easily.
- **[Stripe](https://stripe.com/)**: A payment processing platform that allows businesses to accept payments online and in mobile apps.
- **[Clerk](https://clerk.com/)**: An authentication provider built for the modern web.

### Hosting

- Supabase - Database
- Vercel - Deployment

## Features

### Searching book

- Users can search for books by providing the book title.
- They can select a book to view detailed information about the book, including title, author, description, and more.
  
  > ![Searching book](https://github.com/farism9q/book-mate/blob/dev/gifs/Searching%20book.gif)

---

### Add book to favorite list

- Users can save their favorite books for later reference.
  
  > ![Add book to favorite list](https://github.com/farism9q/book-mate/blob/dev/gifs/Add%20book%20to%20favorite%20list.gif)

---

### ChatGPT Integration

- Users can ask questions about the books using ChatGPT.

  > ![ChatGPT Integration](https://github.com/farism9q/book-mate/blob/dev/gifs/ChatGPT%20Integration.gif)

  <div align="center">
  <h3>This how the receiver will view your email</h3>
  <img src="https://github.com/farism9q/hosting/blob/main/friend-email.png" alt="Receiver email">
</div>

---

### Stripe Subscription

- Users are limited to saving up to 5 favorite books. Additional books can be purchased with Stripe integration.
- Users can ask questions about the books using ChatGPT.
  
  > ![Stripe subscription](https://github.com/farism9q/book-mate/blob/dev/gifs/Stripe%20subscription.gif)

---

### Dark Mode

- Users can toggle the mode to their preference, choosing between dark or light mode.
- The theme preference is saved in the browser's local storage, ensuring the website remembers your preference even after you close and reopen it.
  
  > ![Dark Mode](https://github.com/farism9q/book-mate/blob/dev/gifs/Dark%20mode.gif)

---

## Live Demo

[Give it a try](https://www.book-mate.site)
