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
        // Plain text before this match
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        if (match[0].startsWith('**')) {
            // Bold
            nodes.push(<strong key={match.index} className="font-semibold text-gray-900">{match[2]}</strong>);
        } else {
            // Link
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

    // Remaining plain text
    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
}

const headingClass: Record<number, string> = {
    1: 'text-3xl sm:text-4xl font-bold text-gray-900 mt-12 mb-4',
    2: 'text-2xl sm:text-3xl font-bold text-gray-900 mt-10 mb-4',
    3: 'text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-3',
    4: 'text-lg font-semibold text-gray-900 mt-6 mb-2',
};

function HeadingBlock({ text, level = 3 }: { text: string; level?: number }) {
    const cls = headingClass[level] ?? headingClass[3];
    const content = parseInline(text);

    if (level === 1) return <h1 className={cls}>{content}</h1>;
    if (level === 2) return <h2 className={cls}>{content}</h2>;
    if (level === 4) return <h4 className={cls}>{content}</h4>;
    return <h3 className={cls}>{content}</h3>;
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
                        return <HeadingBlock key={i} text={block.text} level={block.level} />;

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
                                <Image
                                    src={block.src}
                                    alt={block.alt ?? ''}
                                    className="w-full rounded-xl object-cover shadow-md"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {block.alt && (
                                    <figcaption className="mt-3 text-center text-sm text-gray-500">{block.alt}</figcaption>
                                )}
                            </figure>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
