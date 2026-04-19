import Link from "next/link";

// Parses inline **bold** and [text](url) within a string into React nodes
export default function parseInline(text: string): React.ReactNode[] {
  const pattern = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[0].startsWith("**")) {
      nodes.push(
        <strong key={match.index} className="font-semibold text-gray-900">
          {match[2]}
        </strong>,
      );
    } else {
      const href = match[4];
      const isExternal = href.startsWith("http");
      nodes.push(
        <Link
          key={match.index}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
        >
          {match[3]}
        </Link>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
