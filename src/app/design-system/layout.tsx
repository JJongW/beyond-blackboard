import DesignSystemLayout from "@/components/design-system/DesignSystemLayout";

export default function DesignSystemRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DesignSystemLayout>{children}</DesignSystemLayout>;
}
