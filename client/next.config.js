/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_GOOGLEOAUTH_CLIENT_ID:
      "37823085072-rektm4a1mdj6qs55p0a48dlbs5pohc4j.apps.googleusercontent.com",
    NEXT_PUBLIC_API_BASE_URL: "http://localhost:4000",
    NEXT_PUBLIC_IMGUR_ID: "b99f8ca07deaffe",
  },
};

module.exports = nextConfig;
