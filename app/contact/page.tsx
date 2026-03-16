import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/ui/contact-form";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Frances Coronel for speaking, mentoring, or collaboration.",
  path: "/contact",
  ogImage: "/images/og/contact.jpg",
});

export default function ContactPage() {
  return (
    <>
      {/* Section 1: Hero + CTA Cards — light */}
      <PageHeader
        label="Let's Work Together"
        heading="Contact 📨"
        description="I'm available for speaking engagements, mentoring sessions, and collaborations. Let's connect."
        aside={
          <Image
            src="/images/assets/heart-chat-bubble.webp"
            alt=""
            width={256}
            height={256}
            className="h-48 w-48 object-contain drop-shadow-lg md:h-56 md:w-56"
            aria-hidden="true"
          />
        }
      />

      {/* Section 2: Contact Form — dark */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Send me a message 💌
          </h2>
          <ContactForm />
        </div>
      </section>

      {/* CTA Banner */}
      <ConnectCTA variant="contact" />
    </>
  );
}
