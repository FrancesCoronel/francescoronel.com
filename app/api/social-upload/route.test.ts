import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { put } from "@vercel/blob";
import { POST } from "./route";

vi.mock("@vercel/blob", () => ({ put: vi.fn() }));
const putMock = vi.mocked(put);

const TOKEN = "test-upload-token";
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0];
const JPEG = [0xff, 0xd8, 0xff, 0xe0, 0, 0];
const GIF = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
const WEBP = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];

function uploadRequest(
  body: number[] | Uint8Array,
  { token = TOKEN, name, headers = {} }: { token?: string | null; name?: string; headers?: Record<string, string> } = {}
) {
  const url = new URL("https://francescoronel.com/api/social-upload");
  if (name !== undefined) url.searchParams.set("name", name);
  return new Request(url, {
    method: "POST",
    headers: { ...(token ? { "x-upload-token": token } : {}), ...headers },
    body: new Uint8Array(body),
  });
}

beforeEach(() => {
  vi.stubEnv("SOCIAL_UPLOAD_TOKEN", TOKEN);
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "blob-token");
  vi.useFakeTimers({ now: new Date("2026-11-10T12:00:00Z") });
  putMock.mockImplementation(
    async (pathname) =>
      ({ url: `https://store.public.blob.vercel-storage.com/${pathname}`, pathname }) as Awaited<ReturnType<typeof put>>
  );
});

afterEach(() => {
  vi.useRealTimers();
  putMock.mockReset();
});

describe("POST /api/social-upload", () => {
  it("returns 503 when either secret is missing", async () => {
    for (const missing of ["SOCIAL_UPLOAD_TOKEN", "BLOB_READ_WRITE_TOKEN"]) {
      vi.stubEnv("SOCIAL_UPLOAD_TOKEN", TOKEN);
      vi.stubEnv("BLOB_READ_WRITE_TOKEN", "blob-token");
      vi.stubEnv(missing, "");
      const res = await POST(uploadRequest(PNG));
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ error: "Social upload not configured" });
    }
    expect(putMock).not.toHaveBeenCalled();
  });

  it("rejects a missing or wrong token", async () => {
    for (const token of [null, "wrong", `${TOKEN}x`]) {
      const res = await POST(uploadRequest(PNG, { token }));
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Unauthorized" });
    }
    expect(putMock).not.toHaveBeenCalled();
  });

  it("rejects bodies over 4 MB, by header or by actual size", async () => {
    const declared = await POST(uploadRequest(PNG, { headers: { "content-length": String(5 * 1024 * 1024) } }));
    expect(declared.status).toBe(413);

    const big = new Uint8Array(4 * 1024 * 1024 + 1);
    big.set(PNG);
    const actual = await POST(uploadRequest(big));
    expect(actual.status).toBe(413);
    expect(await actual.json()).toEqual({ error: "Image must be 4 MB or smaller" });
    expect(putMock).not.toHaveBeenCalled();
  });

  it("rejects anything that is not an image, whatever its content type says", async () => {
    const html = Array.from(new TextEncoder().encode("<html><script>alert(1)</script></html>"));
    for (const body of [html, [], [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45]]) {
      const res = await POST(uploadRequest(body, { headers: { "content-type": "image/png" } }));
      expect(res.status).toBe(415);
      expect(await res.json()).toEqual({ error: "Body must be a PNG, JPEG, GIF or WebP image" });
    }
    expect(putMock).not.toHaveBeenCalled();
  });

  it("uploads a PNG under social/ with a dated, slugged name and returns the Blob URL", async () => {
    const res = await POST(uploadRequest(PNG, { name: "My Graphic (final).PNG" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      url: "https://store.public.blob.vercel-storage.com/social/2026-11-10-my-graphic-final.png",
      pathname: "social/2026-11-10-my-graphic-final.png",
      contentType: "image/png",
      size: PNG.length,
    });
    expect(putMock).toHaveBeenCalledWith("social/2026-11-10-my-graphic-final.png", Buffer.from(PNG), {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: true,
    });
  });

  it("takes the extension and content type from the bytes for every supported format", async () => {
    const cases: [number[], string, string][] = [
      [JPEG, "jpg", "image/jpeg"],
      [GIF, "gif", "image/gif"],
      [WEBP, "webp", "image/webp"],
    ];
    for (const [body, ext, contentType] of cases) {
      const res = await POST(uploadRequest(body, { name: "launch.png" }));
      expect(await res.json()).toMatchObject({ pathname: `social/2026-11-10-launch.${ext}`, contentType });
    }
  });

  it("keeps the path inside social/ and falls back to a default name", async () => {
    const traversal = await POST(uploadRequest(PNG, { name: "../../static/headshot" }));
    expect((await traversal.json()).pathname).toBe("social/2026-11-10-static-headshot.png");

    for (const name of [undefined, "", "!!!"]) {
      const res = await POST(uploadRequest(PNG, { name }));
      expect((await res.json()).pathname).toBe("social/2026-11-10-graphic.png");
    }
  });

  it("returns 502 when Blob storage fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    putMock.mockRejectedValueOnce(new Error("blob down"));
    const res = await POST(uploadRequest(PNG));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Upload to Blob storage failed" });
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
