"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Send,
  Inbox,
  ArrowLeft,
  Search,
  Plus,
  X,
  Loader2,
  User,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MessageUser {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: MessageUser;
  receiver: MessageUser;
}

interface Conversation {
  peerId: string;
  peerName: string;
  peerEmail: string;
  lastMessage: string;
  lastTime: string;
  messages: Message[];
  unreadCount: number;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "sent" | "received">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?type=${typeFilter}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [typeFilter]);

  const conversations = useMemo(() => {
    const map = new Map<string, Conversation>();

    for (const msg of messages) {
      const peerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const peer =
        msg.senderId === userId ? msg.receiver : msg.sender;

      if (!map.has(peerId)) {
        map.set(peerId, {
          peerId,
          peerName: peer.name || peer.email,
          peerEmail: peer.email,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          messages: [],
          unreadCount: 0,
        });
      }

      const conv = map.get(peerId)!;
      conv.messages.push(msg);

      if (msg.receiverId === userId) {
        conv.unreadCount++;
      }

      if (new Date(msg.createdAt) > new Date(conv.lastTime)) {
        conv.lastMessage = msg.content;
        conv.lastTime = msg.createdAt;
      }
    }

    const sorted = Array.from(map.values()).sort(
      (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
    );

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return sorted.filter(
        (c) =>
          c.peerName.toLowerCase().includes(q) ||
          c.peerEmail.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }

    return sorted;
  }, [messages, userId, searchQuery]);

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleSend = async () => {
    if (!composeRecipient.trim() || !composeContent.trim()) return;
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: composeRecipient.trim(),
          content: composeContent.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [data.message, ...prev]);
        setShowCompose(false);
        setComposeRecipient("");
        setComposeContent("");
        setSelectedConversation(null);
      }
    } catch {
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-gray-500">
            {selectedConversation
              ? `Chat with ${selectedConversation.peerName}`
              : "Your conversations"}
            {totalUnread > 0 && !selectedConversation && (
              <Badge className="ml-2" variant="danger">
                {totalUnread} unread
              </Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedConversation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              setShowCompose(!showCompose);
              setSelectedConversation(null);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
      </div>

      {showCompose && (
        <Card className="border-2 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-indigo-600" />
              New Message
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Recipient ID</label>
              <Input
                placeholder="Enter user ID"
                value={composeRecipient}
                onChange={(e) => setComposeRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <Textarea
                placeholder="Write your message..."
                value={composeContent}
                onChange={(e) => setComposeContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowCompose(false)}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!composeRecipient.trim() || !composeContent.trim() || sending}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedConversation && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {(["all", "received", "sent"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  typeFilter === f
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedConversation ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...selectedConversation.messages]
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((msg) => {
                  const isMine = msg.senderId === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          isMine
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            isMine ? "text-indigo-200" : "text-gray-400"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ) : conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchQuery || typeFilter !== "all"
                ? "No conversations found"
                : "No messages yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : "Start a conversation by clicking Compose."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Card
              key={conv.peerId}
              className="cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => setSelectedConversation(conv)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {conv.peerName}
                    </h3>
                    {conv.unreadCount > 0 && (
                      <Badge variant="danger" className="shrink-0">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{conv.peerEmail}</span>
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-600">
                    {conv.lastMessage}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatTime(conv.lastTime)}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
