import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/design-system/foundations/icon",
        destination: "/design-system/foundations/iconography",
        permanent: false,
      },
      {
        source: "/design-system/components/button",
        destination: "/design-system/components/action-button",
        permanent: false,
      },
      {
        source: "/design-system/components/input",
        destination: "/design-system/components/text-input",
        permanent: false,
      },
      {
        source: "/design-system/components/empty-state",
        destination: "/design-system/components/result-section",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
