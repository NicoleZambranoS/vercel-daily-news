import StatusPage from "@/components/ui/status-page";

export default function ArticleNotFound() {
  return (
    <StatusPage
      code={404}
      message="Article not found. It may have been moved or deleted."
      link={{ href: "/search", label: "Go to all articles" }}
    />
  );
}
