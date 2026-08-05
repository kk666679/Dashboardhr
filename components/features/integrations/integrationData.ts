export interface Platform {
  value: string;
  label: string;
  logo: string;
}

export const platforms: Platform[] = [
  { value: "slack", label: "Slack", logo: "slack.svg" },
  { value: "google", label: "Google Workspace", logo: "google.svg" },
  { value: "microsoft", label: "Microsoft Teams", logo: "microsoft.svg" },
  { value: "custom", label: "Custom", logo: "sample-logo.svg" },
];

export const getAvailablePlatforms = () => platforms;
export const getPlatformLogo = (value: string) => {
  const platform = platforms.find(p => p.value === value);
  return platform ? platform.logo : "sample-logo.svg";
};
