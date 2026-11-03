import { encodeUtf8ToBase64, decodeBase64ToUtf8 } from "./base64";

describe("UTF-8 base64 helpers", () => {
  test("round-trips ASCII", () => {
    const text = 'print("hello")';
    expect(decodeBase64ToUtf8(encodeUtf8ToBase64(text))).toBe(text);
  });

  test("round-trips Tamil, emoji, and CJK", () => {
    const text = 'print("வணக்கம் 👋 你好")';
    const encoded = encodeUtf8ToBase64(text);
    expect(encoded).not.toContain("வ");
    expect(decodeBase64ToUtf8(encoded)).toBe(text);
  });

  test("decode empty / falsy returns empty string", () => {
    expect(decodeBase64ToUtf8("")).toBe("");
    expect(decodeBase64ToUtf8(null)).toBe("");
    expect(decodeBase64ToUtf8(undefined)).toBe("");
  });

  test("matches known UTF-8 base64 for emoji", () => {
    // "👋" in UTF-8 is F0 9F 91 8B → 8J+Riw==
    expect(encodeUtf8ToBase64("👋")).toBe("8J+Riw==");
    expect(decodeBase64ToUtf8("8J+Riw==")).toBe("👋");
  });
});
