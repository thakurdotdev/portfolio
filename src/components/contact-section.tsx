"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { socialLinks } from "@/constants";
import { CheckCircle, Loader, Mail, Send, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

const highlightColor = "#3B82F6"; // Same blue used in project cards

export default function ContactSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto py-16 md:py-20 px-2 md:px-10 relative">
      {/* Background accents */}
      <div
        className="absolute -z-10 top-20 right-10 w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: highlightColor }}
      />
      <div
        className="absolute -z-10 bottom-10 left-10 w-40 h-40 rounded-full opacity-[0.07] blur-2xl pointer-events-none"
        style={{ background: highlightColor }}
      />

      <div className="mb-12 md:mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 relative">
          <span className="relative z-10">Contact</span>
          <span
            className="absolute -bottom-2 left-0 h-1 w-24 md:w-32 rounded-full opacity-20 -z-10"
            style={{ backgroundColor: highlightColor }}
          ></span>
        </h2>
        <p
          className={`text-base sm:text-lg md:text-xl max-w-2xl ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Have a project idea or want to discuss potential opportunities? Feel
          free to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column - Contact Form */}
        <div className="lg:col-span-7">
          <div
            className="rounded-lg border p-8 transition-all duration-500"
            style={{
              backgroundColor: isDark
                ? "rgba(25, 25, 35, 0.5)"
                : "rgba(250, 250, 255, 0.5)",
              backdropFilter: "blur(10px)",
              borderTop: `1px solid ${highlightColor}15`,
              borderLeft: `1px solid ${highlightColor}15`,
              borderRight: `1px solid ${highlightColor}05`,
              borderBottom: `1px solid ${highlightColor}05`,
              boxShadow: `0 15px 30px -15px ${highlightColor}20`,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  Name
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    placeholder="Your name"
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-offset-0 pr-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    placeholder="Your email address"
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-offset-0 pr-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  Message
                </label>
                <div className="relative">
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus("message")}
                    onBlur={handleBlur}
                    placeholder="Your message"
                    rows={5}
                    required
                    className="min-h-[120px] transition-all duration-300 focus:ring-2 focus:ring-offset-0 pr-7"
                  />
                </div>
              </div>

              {formStatus.message && (
                <div
                  className={`rounded-md p-4 flex items-center gap-2 transition-all duration-300 ${
                    formStatus.type === "success"
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  {formStatus.type === "success" ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden group transition-all duration-300"
                style={{
                  backgroundColor: isSubmitting ? undefined : highlightColor,
                  borderRadius: "4px",
                }}
              >
                <span className="flex items-center gap-2 relative z-10">
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-4 w-4" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Send Message</span>
                    </>
                  )}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                    transform: "translateX(-100%)",
                  }}
                />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          {/* Connect text section */}
          <div
            className="rounded-lg border p-8 transition-all duration-500"
            style={{
              backgroundColor: isDark
                ? "rgba(25, 25, 35, 0.5)"
                : "rgba(250, 250, 255, 0.5)",
              backdropFilter: "blur(10px)",
              borderTop: `1px solid ${highlightColor}15`,
              borderLeft: `1px solid ${highlightColor}15`,
              borderRight: `1px solid ${highlightColor}05`,
              borderBottom: `1px solid ${highlightColor}05`,
            }}
          >
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              <span
                style={{ color: highlightColor }}
                className="relative inline-block after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:rounded-full after:transition-all after:duration-700 hover:after:w-full after:bg-current"
              >
                Let's Connect
              </span>
            </h3>
            <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              I'm currently available for freelance projects, collaboration
              opportunities, or full-time positions. Feel free to reach out if
              you have any questions.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: `${highlightColor}15`,
                  }}
                >
                  <Mail className="size-4" style={{ color: highlightColor }} />
                </div>
                <Link
                  href="mailto:pankaj@thakur.dev"
                  className="text-sm relative inline-block"
                >
                  <span className="relative inline-block">
                    pankaj@thakur.dev
                    <span
                      className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ease-in-out"
                      style={{ backgroundColor: highlightColor }}
                    />
                  </span>
                </Link>
              </div>
              <div className="flex items-start gap-3 group">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300"
                  style={{
                    backgroundColor: `${highlightColor}15`,
                  }}
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: highlightColor }}
                  ></span>
                </div>
                <span className="text-sm">
                  Response time: Within 24-48 hours
                </span>
              </div>
              <div className="flex items-start gap-3 group">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300"
                  style={{
                    backgroundColor: `${highlightColor}15`,
                  }}
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: highlightColor }}
                  ></span>
                </div>
                <span className="text-sm">
                  Available for projects starting May 2025
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-6 relative inline-block">
                <span
                  className="relative inline-block after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:rounded-full after:transition-all after:duration-700 hover:after:w-full after:bg-current"
                  style={{ color: isDark ? "white" : "black" }}
                >
                  Find me on
                </span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-md transition-all duration-300"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(35, 35, 45, 0.3)"
                        : "rgba(255, 255, 255, 0.5)",
                      border: `1px solid ${highlightColor}20`,
                    }}
                  >
                    <span className="relative z-10 transition-all duration-300 group-hover:text-white flex items-center gap-2">
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        {social.icon}
                      </span>
                      {/* {social.name} */}
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-0"
                      style={{
                        backgroundColor: highlightColor,
                        transform: "translateY(100%)",
                        transitionProperty: "transform, opacity",
                      }}
                      onMouseEnter={(e) => {
                        const target = e.currentTarget as HTMLDivElement;
                        target.style.transform = "translateY(0)";
                      }}
                      onMouseLeave={(e) => {
                        const target = e.currentTarget as HTMLDivElement;
                        target.style.transform = "translateY(100%)";
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
