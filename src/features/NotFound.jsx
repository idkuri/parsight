import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-[100vh] text-center">
    <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p className="mb-6 text-muted-foreground">
      Sorry, the page you are looking for does not exist.
    </p>
    <Link
      to="/"
      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;