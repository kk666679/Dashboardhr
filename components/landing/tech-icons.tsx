import type { SVGProps } from "react";

export function NextjsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <mask
        id="nextjs-mask"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
      >
        <circle cx="90" cy="90" r="90" fill="currentColor" />
      </mask>
      <g mask="url(#nextjs-mask)">
        <circle cx="90" cy="90" r="90" fill="currentColor" />
        <path
          d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.5 90.5 0 0010.509-7.325z"
          fill="url(#nextjs-gradient)"
        />
        <path
          d="M115 54h12.5v72H115z"
          fill="url(#nextjs-gradient)"
        />
      </g>
      <defs>
        <linearGradient
          id="nextjs-gradient"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ReactIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 228" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="128" cy="114" r="18.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="12" fill="none">
        <ellipse rx="115" ry="43" cx="128" cy="50.5" />
        <ellipse rx="115" ry="43" cx="128" cy="177.5" />
        <ellipse rx="113" ry="43" cx="128" cy="114" transform="rotate(60 128 114)" />
        <ellipse rx="113" ry="43" cx="128" cy="114" transform="rotate(-60 128 114)" />
      </g>
    </svg>
  );
}

export function TypescriptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="256" height="256" rx="24" fill="currentColor" />
      <path
        d="M56 128.5h26.5v90h23v-90H132v-20H56v20z"
        fill="#fff"
      />
      <path
        d="M143.4 96.3h27.3v112.8h22.8V96.3h27.3v-19H143.4v19z"
        fill="#fff"
      />
    </svg>
  );
}

export function TailwindIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 154" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M128 0C93.867 0 72 14.933 62.4 44.7c6.4-11.2 14.933-.35 22.05 3.5 11.467 5.6 21.35 19.6 38.35 27.65 14.933 7.467 30.45 9.45 45.5 4.55 12.25-3.733 23.1-15.867 30.45-28.35C197.167 25.083 188.927 0 128 0zM62.4 78.05C28.267 78.05 6.4 92.983 0 122.75c6.4-11.2 14.933-14 22.05-10.15 11.467 5.6 16.45 17.5 33.45 25.55 14.933 7.467 30.45 9.45 45.5 4.55 12.25-3.733 18.9-17.317 26.25-29.8 8.867-13.867 12.25-53.05-64.85-34.85z"
        fill="currentColor"
      />
    </svg>
  );
}

