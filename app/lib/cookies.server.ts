import { createCookie } from "react-router";

// Define the cart cookie
export const cartCookie = createCookie("cartId", {
  path: "/", // Cookie available across the whole site
  httpOnly: true, // Prevent JavaScript access
  secure: false, // Secure in production
  sameSite: "lax", // Prevent CSRF
  maxAge: 60 * 60 * 24 * 7, // 7 days
});
