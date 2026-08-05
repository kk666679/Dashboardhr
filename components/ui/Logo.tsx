import Image, { type ImageProps } from "next/image";

export type LogoProps = {
  /** Render width in px. Defaults to 120. */
  width?: number;
  /** Render height in px. Defaults to 120. */
  height?: number;
  /** Accessible text. Defaults to "FWMS logo". */
  alt?: string;
  /** If provided, sets the underlying alt attribute to an ARIA-friendly label. */
  ariaLabel?: string;
  /** Optional className for sizing/positioning */
  className?: string;
} & Omit<ImageProps, "src" | "alt" | "width" | "height">;

export function Logo({
  width = 120,
  height = 120,
  alt,
  ariaLabel,
  className,
  ...rest
}: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      width={width}
      height={height}
      alt={ariaLabel ?? alt ?? "AiFWMS logo"}
      className={className}
      priority={rest.priority ?? false}
      {...rest}
    />
  );
}

