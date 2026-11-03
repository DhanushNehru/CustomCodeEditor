/**
 * UTF-8-safe Base64 helpers.
 * Window btoa/atob only handle Latin1; emoji and non-Latin scripts need
 * TextEncoder/TextDecoder (or a Buffer-compatible path in Node tests).
 */

function bytesToBinaryString(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return binary;
}

export function encodeUtf8ToBase64(text) {
  const bytes =
    typeof TextEncoder !== "undefined"
      ? new TextEncoder().encode(text)
      : Buffer.from(text, "utf8");
  if (typeof btoa === "function") {
    return btoa(bytesToBinaryString(bytes));
  }
  return Buffer.from(bytes).toString("base64");
}

export function decodeBase64ToUtf8(encoded) {
  if (!encoded) {
    return "";
  }
  let bytes;
  if (typeof atob === "function") {
    const binary = atob(encoded);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
  } else {
    bytes = new Uint8Array(Buffer.from(encoded, "base64"));
  }
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder("utf-8").decode(bytes);
  }
  return Buffer.from(bytes).toString("utf8");
}
