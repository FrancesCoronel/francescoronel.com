// next-env.d.ts is gitignored and only exists after a build, so typecheck
// in CI needs this to understand static image imports like "@/app/icon.png"
/// <reference types="next/image-types/global" />
