"use client";
import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container grid gap-12 py-10 lg:grid-cols-2 lg:items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Get In Touch</p>
        <h1 className="mt-2 text-4xl font-display font-bold">Let&apos;s Build Something Great</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Interested in customizing NovaCart for your business? Connect real APIs, add authentication, integrate payments, or extend the AI assistant.
        </p>
        <div className="mt-8 space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@novacart.ai" },
            { icon: MapPin, label: "Location", value: "Remote · Worldwide" }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-card">
        <h2 className="mb-5 text-lg font-bold">Send a Message</h2>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>First Name</Label><Input required placeholder="John" /></div>
            <div className="space-y-1.5"><Label>Last Name</Label><Input required placeholder="Doe" /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" required placeholder="john@example.com" /></div>
          <div className="space-y-1.5"><Label>Subject</Label><Input placeholder="Ecommerce project, AI integration..." /></div>
          <div className="space-y-1.5"><Label>Message</Label><Textarea required placeholder="Tell me about your project..." className="min-h-32" /></div>
          <Button type="submit" variant="accent" className="w-full">
            <Send className="h-4 w-4" /> Send Message (Demo)
          </Button>
          <p className="text-center text-xs text-muted-foreground">Portfolio demo — no message is actually sent.</p>
        </form>
      </div>
    </div>
  );
}
