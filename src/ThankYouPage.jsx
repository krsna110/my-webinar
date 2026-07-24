import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';

// ponytail: no router dep — App.jsx switches on pathname

const WHATSAPP_URL = '#'; // TODO: Replace with your actual WhatsApp group invite link

// ── Aurora blobs ─────────────────────────────────────────────────────────────
const AuroraBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div
      className="aurora-blob-1 absolute w-[500px] h-[500px] rounded-full opacity-20"
      style={{
        background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)',
        top: '-10%',
        left: '-5%',
      }}
    />
    <div
      className="aurora-blob-3 absolute w-[400px] h-[400px] rounded-full opacity-15"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
        bottom: '5%',
        right: '-8%',
      }}
    />
    <div
      className="aurora-blob-2 absolute w-[300px] h-[300px] rounded-full opacity-10"
      style={{
        background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)',
        top: '40%',
        right: '20%',
      }}
    />
  </div>
);

// ── Animated check ring ───────────────────────────────────────────────────────
const CheckRing = () => (
  <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-8">
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-blue-400/40"
      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute inset-3 rounded-full border border-blue-500/30"
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    />
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-500/30"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.45 }}
      >
        <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
      </motion.div>
    </motion.div>
  </div>
);

const steps = [
  {
    num: '01',
    text: 'Check your registered email — a confirmation has been sent to you.',
  },
  {
    num: '02',
    text: 'Tap the button below to join the WhatsApp community for your webinar link & all updates.',
  },
  {
    num: '03',
    text: 'Show up live on webinar day — Pranshul will walk you through everything step by step.',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function ThankYouPage() {
  return (
    <div
      id="thank-you-page"
      className="relative min-h-screen bg-[#111111] flex flex-col items-center justify-center px-5 py-16 overflow-hidden"
    >
      <AuroraBlobs />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Payment confirmed · ₹9
          </span>
        </motion.div>

        {/* Check ring */}
        <motion.div variants={itemVariants}>
          <CheckRing />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-black text-white leading-tight"
        >
          You&apos;re{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            in!
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-[#D7E2EA]/70 text-base sm:text-lg leading-relaxed max-w-md mx-auto"
        >
          Welcome aboard. Your seat for{' '}
          <span className="text-white font-semibold">Pranshul&apos;s AI Masterclass</span> is
          reserved. Here&apos;s what to do next:
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="my-8 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent"
        />

        {/* Steps */}
        <motion.ol
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
          className="space-y-4 text-left mb-10"
          aria-label="Next steps"
        >
          {steps.map((s) => (
            <motion.li
              key={s.num}
              variants={itemVariants}
              className="flex items-start gap-4 bg-[#1a1a1a] border border-[#252525] rounded-2xl px-5 py-4"
            >
              <span className="text-3xl font-black text-blue-400/30 leading-none select-none flex-shrink-0 mt-0.5">
                {s.num}
              </span>
              <p className="text-[#D7E2EA]/80 text-sm sm:text-base leading-relaxed">{s.text}</p>
            </motion.li>
          ))}
        </motion.ol>

        {/* Primary CTA — WhatsApp */}
        <motion.div variants={itemVariants}>
          <motion.a
            id="join-whatsapp-btn"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-base sm:text-lg px-8 py-4 rounded-full shadow-lg shadow-[#25D366]/20 transition-colors w-full sm:w-auto justify-center"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Glow pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-[#25D366]/60"
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            Tap to Join WhatsApp Community
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <p className="mt-3 text-[#D7E2EA]/40 text-xs sm:text-sm">
            Join to receive your webinar link &amp; all updates from Pranshul.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="my-8 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent"
        />

        {/* Host credit */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            P
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Pranshul</p>
            <p className="text-[#D7E2EA]/50 text-xs">Founder · TheAdsLancer</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 mt-16 text-[#D7E2EA]/25 text-xs text-center"
      >
        © 2026 TheAdsLancer · All rights reserved.
      </motion.footer>
    </div>
  );
}
