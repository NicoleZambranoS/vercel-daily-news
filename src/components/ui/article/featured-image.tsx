import Image from "next/image";

type FeaturedImageProps = {
  src: string;
  alt: string;
};

export default function FeaturedImage({ src, alt }: FeaturedImageProps) {
  return (
    <div className="relative mb-16 h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 896px"
        className="object-cover"
        priority
      />
    </div>
  );
}
