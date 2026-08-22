"use client";

import { useState } from "react";
import { Send, Mail, Phone, MapPin, MessageSquare, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-3 text-lg text-gray-500">
              Have a question? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <Mail className="h-6 w-6 text-indigo-600" />
                <h3 className="mt-3 font-semibold text-gray-900">Email</h3>
                <p className="text-sm text-gray-500">support@smartlms.com</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <Phone className="h-6 w-6 text-indigo-600" />
                <h3 className="mt-3 font-semibold text-gray-900">Phone</h3>
                <p className="text-sm text-gray-500">+234 800 SMART LMS</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <MapPin className="h-6 w-6 text-indigo-600" />
                <h3 className="mt-3 font-semibold text-gray-900">Office</h3>
                <p className="text-sm text-gray-500">
                  123 Learning Street<br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="mt-2 text-gray-500">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Tell us more..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-xl disabled:opacity-50"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
