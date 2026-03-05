import { ContentBlock } from '@/types/article';
import Image from 'next/image';
import Link from 'next/link';

// Parses inline **bold** and [text](url) within a string into React nodes
function parseInline(text: string): React.ReactNode[] {
    const pattern = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        if (match[0].startsWith('**')) {
            nodes.push(<strong key={match.index} className="font-semibold text-gray-900">{match[2]}</strong>);
        } else {
            const href = match[4];
            const isExternal = href.startsWith('http');
            nodes.push(
                <Link
                    key={match.index}
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
                >
                    {match[3]}
                </Link>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
}

type ContentRendererProps = {
    blocks: ContentBlock[];
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
    return (
        <div className="space-y-5 text-gray-700 leading-relaxed">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case 'paragraph':
                        return (
                            <p key={i} className="text-base sm:text-lg leading-8 text-gray-700">
                                {parseInline(block.text)}
                            </p>
                        );

                    case 'heading':
                        return block.level === 2
                            ? <h2 key={i} className="text-2xl sm:text-3xl font-bold text-gray-900 mt-10 mb-4">{parseInline(block.text)}</h2>
                            : <h3 key={i} className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-3">{parseInline(block.text)}</h3>;

                    case 'blockquote':
                        return (
                            <blockquote key={i} className="border-l-4 border-gray-300 pl-5 py-1 text-gray-600 italic text-base sm:text-lg leading-8">
                                {parseInline(block.text)}
                            </blockquote>
                        );

                    case 'unordered-list':
                        return (
                            <ul key={i} className="space-y-2.5 pl-1">
                                {block.items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-3 text-base sm:text-lg leading-7 text-gray-700">
                                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                        <span>{parseInline(item)}</span>
                                    </li>
                                ))}
                            </ul>
                        );

                    case 'ordered-list':
                        return (
                            <ol key={i} className="space-y-2.5 pl-1 list-none">
                                {block.items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-3 text-base sm:text-lg leading-7 text-gray-700">
                                        <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center">
                                            {j + 1}
                                        </span>
                                        <span>{parseInline(item)}</span>
                                    </li>
                                ))}
                            </ol>
                        );

                    case 'image':
                        return (
                            <figure key={i} className="my-8">
                                <Image src={block.src} alt={block.alt || ''} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" priority />
                                {block.caption && <figcaption className="mt-3 text-center text-sm text-gray-500">{block.caption}</figcaption>}
                            </figure>
                        );
                }
            })}
        </div>
    );
}
