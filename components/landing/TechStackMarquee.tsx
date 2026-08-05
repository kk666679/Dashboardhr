"use client";

/**
 * TechStackMarquee
 * -----------------
 * A premium tech-stack marquee hero section ("Built With Next.js Ecosystem").
 * Renders a seamless, infinitely scrolling marquee of tech logos with inline
 * SVG icons, styled to match the dark, premium aesthetic of the landing page.
 */

const techs = [
  {
    label: "Next.js",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="white"/><path d="M16 7v10h-2V9.5l-4.5 7H8v-10h2v7.5l4.5-7H16z" fill="black"/></svg>`,
    bg: "#ffffff",
  },
  {
    label: "React",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2.5" fill="#61dafb"/><path d="M12 21C17.5228 21 22 16.9706 22 12C22 7.02944 17.5228 3 12 3C6.47715 3 2 7.02944 2 12C2 16.9706 6.47715 21 12 21Z" stroke="#61dafb" stroke-width="1.8" fill="none"/><path d="M5.5 8C9.5 11 14.5 11 18.5 8" stroke="#61dafb" stroke-width="1.8" fill="none"/><path d="M5.5 16C9.5 13 14.5 13 18.5 16" stroke="#61dafb" stroke-width="1.8" fill="none"/><path d="M8 5.5C11 9.5 11 14.5 8 18.5" stroke="#61dafb" stroke-width="1.8" fill="none"/><path d="M16 5.5C13 9.5 13 14.5 16 18.5" stroke="#61dafb" stroke-width="1.8" fill="none"/></svg>`,
    bg: "transparent",
  },
  {
    label: "TypeScript",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="3" fill="#3178c6"/><text x="12" y="17" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="white" text-anchor="middle">TS</text></svg>`,
    bg: "transparent",
  },
  {
    label: "Tailwind CSS",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C9 6 7 8 6 11C7.5 9 9.5 8.5 11 9.5C11.8 9.9 12.4 10.5 13 11.1C14.2 12.3 15.6 13.7 18 13.7C21 13.7 23 11.7 24 8.7C22.5 10.7 20.5 11.2 19 10.2C18.2 9.8 17.6 9.2 17 8.6C15.8 7.4 14.4 6 12 6ZM6 13.7C3 13.7 1 15.7 0 18.7C1.5 16.7 3.5 16.2 5 17.2C5.8 17.6 6.4 18.2 7 18.8C8.2 20 9.6 21.4 12 21.4C15 21.4 17 19.4 18 16.4C16.5 18.4 14.5 18.9 13 17.9C12.2 17.5 11.6 16.9 11 16.3C9.8 15.1 8.4 13.7 6 13.7Z" fill="#38bdf8"/></svg>`,
    bg: "transparent",
  },
  {
    label: "Vercel AI SDK",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 20H22L12 2Z" fill="white"/><circle cx="12" cy="16" r="2" fill="#7c3aed"/><circle cx="8" cy="12" r="1.5" fill="#2563eb" opacity="0.6"/><circle cx="16" cy="12" r="1.5" fill="#2563eb" opacity="0.6"/></svg>`,
    bg: "transparent",
  },
  {
    label: "Prisma",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.4 2.5L5.7 14.2c-.3.5-.3 1.2.1 1.7l4.4 5.4c.4.5 1.1.6 1.6.3l9.3-5.6c.5-.3.7-.9.5-1.4l-4.8-11.6c-.3-.7-1.1-.9-1.7-.5h.1z" fill="#2D3748"/><path d="M13.5 3.5L6.2 15.2c-.3.5-.3 1.2.1 1.7l4.2 5.1c.4.5 1.1.6 1.6.3l8.9-5.3c.5-.3.7-.9.5-1.4l-4.6-11.2c-.3-.7-1.1-.9-1.7-.5h.1z" fill="#2D3748"/><path d="M13.5 4.5L6.2 16.2c-.3.5-.3 1.2.1 1.7l4.2 5.1c.4.5 1.1.6 1.6.3l8.9-5.3c.5-.3.7-.9.5-1.4l-4.6-11.2c-.3-.7-1.1-.9-1.7-.5h.1z" fill="#3B82F6" opacity="0.3"/><path d="M13.5 5.5L6.2 17.2c-.3.5-.3 1.2.1 1.7l4.2 5.1c.4.5 1.1.6 1.6.3l8.9-5.3c.5-.3.7-.9.5-1.4l-4.6-11.2c-.3-.7-1.1-.9-1.7-.5h.1z" fill="#3B82F6" opacity="0.2"/></svg>`,
    bg: "transparent",
  },
  {
    label: "NextAuth",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#000"/><path d="M12 4C7.6 4 4 7.6 4 12s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3.2c1.8 0 3.2 1.4 3.2 3.2 0 1.8-1.4 3.2-3.2 3.2S8.8 12.2 8.8 10.4c0-1.8 1.4-3.2 3.2-3.2zm0 11.2c-2.7 0-5-1.5-6.2-3.7.6-1.8 2.3-3.2 4.4-3.6.5.4 1.1.7 1.8.7s1.3-.3 1.8-.7c2.1.4 3.8 1.8 4.4 3.6-1.2 2.2-3.5 3.7-6.2 3.7z" fill="white"/></svg>`,
    bg: "transparent",
  },
  {
    label: "tRPC",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#3982CE"/><path d="M7 12l5-5 5 5-5 5-5-5z" fill="white"/><path d="M12 7l5 5-5 5-5-5 5-5z" fill="#3982CE" stroke="white" stroke-width="1.5"/></svg>`,
    bg: "transparent",
  },
  {
    label: "Zod",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#3068B7"/><path d="M8 8l8 8M16 8l-8 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="white"/></svg>`,
    bg: "transparent",
  },
  {
    label: "Shadcn UI",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#fff" stroke-width="2"/><path d="M7 12l4 4 6-6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>`,
    bg: "transparent",
  },
  {
    label: "Framer Motion",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 2h16v4H4V2zm0 8h16v4H4v-4zm0 8h16v4H4v-4z" fill="white"/></svg>`,
    bg: "transparent",
  },
  {
    label: "React Hook Form",
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#EC5990"/><path d="M7 9l5 5 5-5" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    bg: "transparent",
  },
];

function MarqueeItems() {
  return (
    <>
      {techs.map((t) => (
        <span className="marquee-item" key={t.label}>
          <span
            className="icon-box"
            style={{ background: `${t.bg}11`, borderColor: `${t.bg}33` }}
            dangerouslySetInnerHTML={{ __html: t.svg }}
          />
          {t.label}
        </span>
      ))}
    </>
  );
}

export default function TechStackMarquee() {
  return (
    <section className="tech-marquee-section py-16 sm:py-24 px-4 sm:px-6">
      <div className="marquee-section">
        <h2 className="title">
          Built With <span>Next.js Ecosystem</span>
        </h2>

        <div className="marquee-wrap">
          <div className="marquee-track">
            <MarqueeItems />
          </div>
          <div className="marquee-track" aria-hidden="true">
            <MarqueeItems />
          </div>
        </div>

        <p className="note">
          ⚡ Next.js • React • TypeScript • Tailwind CSS • Vercel AI SDK • Prisma
          • NextAuth • tRPC • Zod • Shadcn UI • Framer Motion • React Hook Form
        </p>
      </div>

      <style>{`
        .tech-marquee-section {
          width: 100%;
          background: #010103;
        }

        .marquee-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(11, 14, 28, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 24px;
          padding: 48px 32px;
          text-align: center;
        }

        .marquee-section .title {
          font-size: clamp(20px, 2vw, 28px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 28px;
          letter-spacing: -0.02em;
        }

        .marquee-section .title span {
          color: #7dd3fc;
        }

        .marquee-wrap {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          padding: 12px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .marquee-track {
          display: inline-flex;
          align-items: center;
          gap: 56px;
          animation: marqueeScroll 35s linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: #e2e8f0;
          font-weight: 600;
          font-size: 16px;
          padding: 4px 0;
          transition: color 0.3s ease;
        }

        .marquee-item:hover {
          color: #fff;
        }

        .marquee-item .icon-box {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .marquee-item:hover .icon-box {
          transform: scale(1.08);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.04);
        }

        .marquee-item .icon-box svg {
          width: 28px;
          height: 28px;
          display: block;
        }

        .note {
          margin-top: 24px;
          font-size: 13px;
          color: #475569;
          letter-spacing: 0.04em;
        }

        .note a {
          color: #7dd3fc;
          text-decoration: none;
          border-bottom: 1px dotted rgba(125, 211, 252, 0.3);
          transition: color 0.3s;
        }

        .note a:hover {
          color: #93c5fd;
        }

        @media (max-width: 768px) {
          .marquee-section {
            padding: 32px 16px;
          }
          .marquee-track {
            gap: 32px;
          }
          .marquee-item {
            font-size: 14px;
          }
          .marquee-item .icon-box {
            width: 36px;
            height: 36px;
          }
          .marquee-item .icon-box svg {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 480px) {
          .marquee-section {
            padding: 24px 12px;
            border-radius: 16px;
          }
          .marquee-track {
            gap: 24px;
            animation-duration: 28s;
          }
          .marquee-item {
            font-size: 12px;
            gap: 10px;
          }
          .marquee-item .icon-box {
            width: 30px;
            height: 30px;
          }
          .marquee-item .icon-box svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </section>
  );
}
