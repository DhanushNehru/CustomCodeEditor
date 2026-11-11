/* eslint-env jest */
import i18n from "./i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";

const flatKeys = (messages, prefix = "") =>
  Object.entries(messages).flatMap(([key, value]) =>
    typeof value === "object"
      ? flatKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );

describe("i18n", () => {
  afterEach(() => i18n.changeLanguage("en"));

  it("shows English by default", () => {
    expect(i18n.t("output.title")).toBe("Output");
  });

  it("switches to Spanish", async () => {
    await i18n.changeLanguage("es");
    expect(i18n.t("output.title")).toBe(es.output.title);
  });

  it("falls back to English for a key a language is missing", async () => {
    i18n.addResource("en", "translation", "test.onlyInEnglish", "Only in English");
    await i18n.changeLanguage("es");
    expect(i18n.t("test.onlyInEnglish")).toBe("Only in English");
  });

  it("has no Spanish keys that English lacks", () => {
    const englishKeys = new Set(flatKeys(en));
    // Spanish has an extra plural form (_many) that English doesn't use
    const extra = flatKeys(es).filter(
      (key) => !englishKeys.has(key.replace(/_many$/, "_other"))
    );
    expect(extra).toEqual([]);
  });
});
