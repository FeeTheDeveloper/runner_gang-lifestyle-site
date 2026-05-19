import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function BrandMark({
  className,
  priority = false,
  sizes = "220px"
}: BrandMarkProps) {
  return (
    <Image
      src="/runner-gang-logo.png"
      alt="Runner Gang Lifestyle logo"
      width={1040}
      height={372}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}

