import StatusPage from "@/components/ui/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code={404}
      message="This page could not be found. It may have been moved or deleted."
      link={{ href: "/", label: "Back to Home" }}
    />
  );
}
