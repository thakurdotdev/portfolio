"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validateName = (name: string): boolean => {
    return name.trim().length > 0;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMessage = (message: string): boolean => {
    return message.trim().length > 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let newErrors = { ...errors };

    switch (name) {
      case "name":
        if (validateName(value)) {
          delete newErrors.name;
        } else {
          newErrors.name = "Please enter a valid name.";
        }
        break;
      case "email":
        if (validateEmail(value)) {
          delete newErrors.email;
        } else {
          newErrors.email = "Please enter a valid email.";
        }
        break;
      case "message":
        if (validateMessage(value)) {
          delete newErrors.message;
        } else {
          newErrors.message = "Please enter a message.";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!validateName(name)) {
      newErrors.name = "Please enter a valid name.";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!validateMessage(message)) {
      newErrors.message = "Please enter a message.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.sendForm(
        "service_ldx72vg",
        "template_tionfoh",
        e.currentTarget,
        "4i6NhRQVTAgwoBcc9"
      );
      e.currentTarget.reset();
      setErrors({});
    } catch (error) {
      console.error(error);
      setErrors({ message: "Failed to send email." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-xl font-bold">Contact Us</h1>
      <p className="text-gray-600">
        Feel free to reach out to me for any queries or just to say hi.
      </p>
      <div className="h-[1px] w-[50%] bg-slate-300/40 rounded-full mb-4"></div>
      <Card className="mx-auto">
        <CardHeader className="text-center font-semibold">
          Get in Touch
        </CardHeader>
        <CardContent>
          <form onSubmit={sendEmail} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Your message"
                rows={4}
                onChange={handleChange}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>
            <Button
              variant="secondary"
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
