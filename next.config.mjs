/** @type {import('next').NextConfig} */
export default {
  experimental: {
    // Needed for src/app/global-not-found.jsx: the app has two root layouts.
    globalNotFound: true,
  },
};
