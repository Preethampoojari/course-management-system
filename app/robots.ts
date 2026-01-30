export default function robots() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/course-list"],
        disallow: ["/dashboard", "/roles", "/create-course"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
