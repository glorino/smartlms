"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Send, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  receiverId: string;
  createdAt: string;
}

export default function InstructorMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages");
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  const conversations = messages.reduce((acc: Record<string, Message[]>, msg) => {
    const otherId = msg.senderId === (session?.user as any)?.id ? msg.receiverId : msg.senderId;
    if (!acc[otherId]) acc[otherId] = [];
    acc[otherId].push(msg);
    return acc;
  }, {});

  const sortedConversations = Object.entries(conversations).sort(([, a], [, b]) => {
    return new Date(b[b.length - 1].createdAt).getTime() - new Date(a[a.length - 1].createdAt).getTime();
  });

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedConversation, content: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        const msgRes = await fetch("/api/messages");
        if (msgRes.ok) {
          const data = await msgRes.json();
          setMessages(data.messages || []);
        }
      }
    } catch {
      // handle error
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const activeMessages = selectedConversation ? conversations[selectedConversation] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/instructor" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-gray-600">Communicate with your students</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {sortedConversations.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <MessageSquare className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm">No conversations yet</p>
                </div>
              ) : (
                sortedConversations.map(([userId, convMessages]) => {
                  const lastMsg = convMessages[convMessages.length - 1];
                  return (
                    <button
                      key={userId}
                      onClick={() => setSelectedConversation(userId)}
                      className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                        selectedConversation === userId ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {lastMsg.senderName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{lastMsg.senderName}</p>
                        <p className="truncate text-xs text-gray-500">{lastMsg.content}</p>
                      </div>
                      <span className="shrink-0 text-xs text-gray-400">
                        {new Date(lastMsg.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedConversation ? "Chat" : "Select a conversation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedConversation ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <MessageSquare className="h-12 w-12 text-gray-300" />
                <p className="mt-4">Select a conversation to start messaging</p>
              </div>
            ) : (
              <div className="flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto space-y-4 p-4">
                  {activeMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === (session?.user as any)?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl px-4 py-2 ${
                          msg.senderId === (session?.user as any)?.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`mt-1 text-xs ${msg.senderId === (session?.user as any)?.id ? "text-indigo-200" : "text-gray-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button onClick={handleSend} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
