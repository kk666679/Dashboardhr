// Link checker utility for FWMS homepage
// Ensures all CTAs and navigation links are functional

export const navigationLinks = [
  // Main navigation
  { href: "/dashboard", label: "Dashboard", category: "core" },
  { href: "/dashboard/workers", label: "Workers", category: "core" },
  { href: "/dashboard/permits", label: "Permits", category: "core" },
  { href: "/dashboard/geolocation", label: "Live Tracking", category: "new" },
  { href: "/dashboard/accounting", label: "Payroll", category: "new" },
  { href: "/mobile/worker", label: "Mobile Portal", category: "new" },
  {
    href: "/integrations/government",
    label: "Government APIs",
    category: "integrations",
  },
  {
    href: "/integrations",
    label: "All Integrations",
    category: "integrations",
  },
  { href: "/dashboard/settings", label: "User Settings", category: "settings" },

  // Footer links
  {
    href: "/support/documentation",
    label: "Documentation",
    category: "support",
  },
  { href: "/support/api", label: "API Reference", category: "support" },
  { href: "/support/help", label: "Help Center", category: "support" },
  { href: "/support/contact", label: "Contact Support", category: "support" },
];

export const ctaLinks = [
  // Key CTAs
  {
    href: "/api/reports/lhdn-audit-template",
    label: "Download Audit Report",
    type: "download",
  },
  { href: "tel:+60388863000", label: "Emergency Contact - JTK", type: "phone" },
  { href: "/dashboard", label: "Try Live Demo", type: "demo" },
  { href: "/auth/login", label: "Login", type: "auth" },
];

export const governmentIntegrations = [
  { name: "JTK", status: "Active", endpoint: "/api/integrations/jtk" },
  {
    name: "Immigration",
    status: "Active",
    endpoint: "/api/integrations/immigration",
  },
  { name: "LHDN", status: "Active", endpoint: "/api/integrations/lhdn" },
  { name: "EPF", status: "Active", endpoint: "/api/integrations/epf" },
  { name: "SOCSO", status: "Active", endpoint: "/api/integrations/socso" },
  { name: "FOMEMA", status: "Active", endpoint: "/api/integrations/fomema" },
];

// Function to check if all links are accessible
export async function checkLinks() {
  const results = {
    navigation: [] as any[],
    cta: [] as any[],
    integrations: [] as any[],
    broken: [] as any[],
  };

  // Check navigation links
  for (const link of navigationLinks) {
    try {
      const response = await fetch(link.href, { method: "HEAD" });
      results.navigation.push({
        ...link,
        status: response.status,
        accessible: response.status < 400,
      });
    } catch (error) {
      results.broken.push({
        ...link,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Check CTA links (skip phone and download links)
  for (const link of ctaLinks) {
    if (link.type === "phone" || link.type === "download") {
      results.cta.push({ ...link, status: "skipped", accessible: true });
      continue;
    }

    try {
      const response = await fetch(link.href, { method: "HEAD" });
      results.cta.push({
        ...link,
        status: response.status,
        accessible: response.status < 400,
      });
    } catch (error) {
      results.broken.push({
        ...link,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

// Accessibility checker
export function checkAccessibility() {
  const issues = [];

  // Check for missing alt text on images
  const images = document.querySelectorAll("img:not([alt])");
  if (images.length > 0) {
    issues.push(`${images.length} images missing alt text`);
  }

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      issues.push(`Heading hierarchy skip detected: ${heading.textContent}`);
    }
    previousLevel = level;
  });

  // Check for keyboard navigation
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
  );

  let tabIndexIssues = 0;
  focusableElements.forEach((element) => {
    if (
      !element.hasAttribute("tabindex") &&
      element.tagName !== "A" &&
      element.tagName !== "BUTTON"
    ) {
      tabIndexIssues++;
    }
  });

  if (tabIndexIssues > 0) {
    issues.push(`${tabIndexIssues} elements may not be keyboard accessible`);
  }

  // Check color contrast (basic check)
  const buttons = document.querySelectorAll("button, .btn");
  buttons.forEach((button) => {
    const styles = window.getComputedStyle(button);
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;

    // Basic contrast check (simplified)
    if (bgColor === textColor) {
      issues.push(
        `Poor color contrast detected on button: ${button.textContent}`,
      );
    }
  });

  return {
    totalIssues: issues.length,
    issues,
    wcagCompliant: issues.length === 0,
  };
}

// Mobile responsiveness checker
export function checkMobileResponsiveness() {
  const issues = [];
  const viewportWidth = window.innerWidth;

  // Check if content fits in 320px viewport
  if (viewportWidth >= 320) {
    const overflowElements = document.querySelectorAll("*");
    overflowElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width > viewportWidth) {
        issues.push(`Element overflows viewport: ${element.tagName}`);
      }
    });
  }

  // Check for proper touch targets (minimum 44px)
  const touchTargets = document.querySelectorAll(
    'button, a, input, [role="button"]',
  );
  touchTargets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      issues.push(
        `Touch target too small: ${target.textContent || target.tagName}`,
      );
    }
  });

  // Check for horizontal scrolling
  const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
  if (hasHorizontalScroll) {
    issues.push("Horizontal scrolling detected");
  }

  return {
    totalIssues: issues.length,
    issues,
    mobileOptimized: issues.length === 0,
    viewportWidth,
  };
}

// Performance checker
export function checkPerformance() {
  const metrics = {
    loadTime: 0,
    imageCount: 0,
    largeImages: 0,
    unoptimizedImages: 0,
    recommendations: [] as string[],
  };

  // Check load time (if available)
  if (performance.timing) {
    metrics.loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;
  }

  // Check images
  const images = document.querySelectorAll("img");
  metrics.imageCount = images.length;

  images.forEach((img) => {
    // Check for large images
    if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
      metrics.largeImages++;
    }

    // Check for missing lazy loading
    if (!img.hasAttribute("loading")) {
      metrics.unoptimizedImages++;
    }
  });

  // Recommendations
  if (metrics.loadTime > 3000) {
    metrics.recommendations.push("Page load time exceeds 3 seconds");
  }

  if (metrics.largeImages > 0) {
    metrics.recommendations.push(
      `${metrics.largeImages} images could be optimized`,
    );
  }

  if (metrics.unoptimizedImages > 0) {
    metrics.recommendations.push(
      `${metrics.unoptimizedImages} images missing lazy loading`,
    );
  }

  return metrics;
}
