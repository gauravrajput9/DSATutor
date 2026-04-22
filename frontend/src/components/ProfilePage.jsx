import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Mail, MessageSquare, User2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "./Navbar";

const formatJoinedDate = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not load profile.");
        }

        setProfile(data.user);
      } catch (error) {
        toast.error(error.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "AM";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0a0a0f] text-white"
    >
      <Navbar />

      <main className="relative overflow-hidden px-6 pb-16 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-16 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[110px]" />
          <div className="absolute right-12 top-40 h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-violet-500/15 px-8 py-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/10 text-3xl font-semibold text-cyan-200 ring-1 ring-white/10">
                    {initials}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                      Profile
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                      {loading ? "Loading profile..." : profile?.name || "AlgoMind User"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-300">
                      Your learning identity, account details, and chat activity in
                      one place.
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/20 px-5 py-4 text-sm text-slate-300">
                  Joined on {loading ? "..." : formatJoinedDate(profile?.createdAt)}
                </div>
              </div>
            </div>

            <div className="grid gap-6 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                <h2 className="text-lg font-semibold text-white">Account details</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-cyan-200">
                      <User2 size={16} />
                      Full name
                    </div>
                    <p className="text-base text-white">
                      {loading ? "Loading..." : profile?.name || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-cyan-200">
                      <Mail size={16} />
                      Email
                    </div>
                    <p className="break-all text-base text-white">
                      {loading ? "Loading..." : profile?.email || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 sm:col-span-2">
                    <div className="mb-3 flex items-center gap-2 text-sm text-cyan-200">
                      <CalendarDays size={16} />
                      Membership
                    </div>
                    <p className="text-base text-white">
                      {loading ? "Loading..." : `Member since ${formatJoinedDate(profile?.createdAt)}`}
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                  <h2 className="text-lg font-semibold text-white">Chat activity</h2>
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-cyan-200">
                          <MessageSquare size={16} />
                          Saved chats
                        </div>
                        <span className="text-2xl font-semibold text-white">
                          {loading ? "..." : profile?.totalChats ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-cyan-200">
                          <MessageSquare size={16} />
                          Messages exchanged
                        </div>
                        <span className="text-2xl font-semibold text-white">
                          {loading ? "..." : profile?.totalMessages ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6 text-sm leading-7 text-slate-300">
                  This page is connected to your live account data, so it updates from
                  the backend instead of using placeholder values.
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </motion.div>
  );
}
