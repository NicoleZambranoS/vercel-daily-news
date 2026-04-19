import { ContentBlock } from "@/types/article";
import Image from "next/image";
import parseInline from "@/components/ui/parse-inline";

type ArticleContentProps = {
  blocks: ContentBlock[];
};

export default function ArticleContent({ blocks }: ArticleContentProps) {
  return (
    <div className="space-y-5 text-gray-700 leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="text-base sm:text-lg leading-8 text-gray-700"
              >
                {parseInline(block.text)}
              </p>
            );

          case "heading":
            return block.level === 2 ? (
              <h2
                key={i}
                className="text-2xl sm:text-3xl font-bold text-gray-900 mt-10 mb-4"
              >
                {parseInline(block.text)}
              </h2>
            ) : (
              <h3
                key={i}
                className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-3"
              >
                {parseInline(block.text)}
              </h3>
            );

          case "blockquote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-gray-300 pl-5 py-1 text-gray-600 italic text-base sm:text-lg leading-8"
              >
                {parseInline(block.text)}
              </blockquote>
            );

          case "unordered-list":
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-base sm:text-lg leading-7 text-gray-700"
                  >
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                    <span>{parseInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ordered-list":
            return (
              <ol key={i} className="space-y-2.5 pl-1 list-none">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-base sm:text-lg leading-7 text-gray-700"
                  >
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center">
                      {j + 1}
                    </span>
                    <span>{parseInline(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case "image":
            return (
              block.src && (
                <figure key={i} className="my-8">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={block.src}
                      alt={block.alt || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
                  {block.caption && (
                    <figcaption className="mt-3 text-center text-sm text-gray-500">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              )
            );
        }
      })}
    </div>
  );
}
