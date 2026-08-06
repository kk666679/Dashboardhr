import { beforeEach, describe, expect, it, vi } from "vitest";

describe("initClientI18n", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("does not trigger a language change when the instance is already initialized", async () => {
    const changeLanguage = vi.fn().mockResolvedValue(undefined);

    vi.doMock("i18next", () => ({
      default: {
        language: "en",
        use: vi.fn().mockReturnThis(),
        init: vi.fn().mockResolvedValue(undefined),
        changeLanguage,
      },
    }));

    vi.doMock("react-i18next", () => ({
      initReactI18next: {},
    }));

    vi.doMock("i18next-browser-languagedetector", () => ({
      default: {},
    }));

    const { initClientI18n } = await import("./client");

    initClientI18n("en");
    initClientI18n("ms");

    expect(changeLanguage).not.toHaveBeenCalled();
  });
});
