"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { sendForm } from "@emailjs/browser";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface Errors {
  [key: string]: string; // Allow string keys with string values
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const validate: { [key: string]: (value: string) => boolean } = {
    name: (value) => value.trim().length > 0,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: (value) => value.trim().length > 0,
  };

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validate[name](value) ? "" : `Please enter a valid ${name}.`,
    }));
  };

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formErrors = Object.keys(validate).reduce((acc: Errors, key: string) => {
      const value = formData.get(key) as string;
      if (!validate[key](value)) acc[key] = `Please enter a valid ${key}.`;
      return acc;
    }, {});

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await sendForm(
        "service_ldx72vg",
        "template_tionfoh",
        form,
        "4i6NhRQVTAgwoBcc9"
      );
      if (result.status === 200) {
        alert("Email sent successfully!");
        form.reset();
        setErrors({});
      } else {
        throw new Error(`Unexpected status code: ${result.status}`);
      }
    } catch (error) {
      console.error("Detailed error:", error);
      setErrors({ message: "Failed to send email. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h4 className="text-md md:text-xl font-medium mb-4">Contact</h4>
      <Card className="mx-auto">
        <CardHeader className="text-center font-semibold">Get in Touch</CardHeader>
        <CardContent>
          <form onSubmit={sendEmail} className="space-y-4">
            {["name", "email", "message"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                {field !== "message" ? (
                  <Input
                    id={field}
                    name={field}
                    placeholder={`Your ${field}`}
                    onChange={handleChange}
                    type={field === "email" ? "email" : "text"}
                  />
                ) : (
                  <Textarea
                    id={field}
                    name={field}
                    placeholder="Your message"
                    rows={4}
                    onChange={handleChange}
                  />
                )}
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
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
