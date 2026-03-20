"use client"

import { motion, type Transition, type Variants } from "motion/react"
import Link from "next/link"
import { CreditCard, Briefcase, ArrowRight } from "lucide-react"

const defaultItemTransition: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
}

const METRICS = [
  { value: "4,200+", label: "Members" },
  { value: "72 yrs", label: "Strong" },
  { value: "$38/hr", label: "Wage Floor" },
]

export function HeroStagger() {
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: defaultItemTransition },
  }

  return (
    <div className="hero-wrapper">
      {/* Organic drifting glows — gold + navy, light mode */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, 60, -40, 20, 0],
          y: [0, -30, 50, -20, 0],
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          x: { duration: 23, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 19, repeat: Infinity, ease: "easeInOut" },
        }}
        className="hero-glow hero-glow-gold"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, -50, 30, -60, 0],
          y: [0, 40, -30, 50, 0],
        }}
        transition={{
          opacity: { duration: 1.4, ease: "easeOut", delay: 0.2 },
          x: { duration: 17, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 29, repeat: Infinity, ease: "easeInOut" },
        }}
        className="hero-glow hero-glow-navy"
      />

      <motion.div
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="hero-badge">
          <motion.span
            className="hero-badge-dot"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          International Brotherhood of Teamsters · Local 728
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="hero-headline">
          Fighting for
          <br />
          Atlanta&apos;s{" "}
          <span className="hero-headline-accent">Working</span>
          <br />
          <span className="hero-headline-accent">Families.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="hero-subtitle">
          Representing over 4,200 workers across entertainment transportation,
          logistics, sanitation, and public services in greater Atlanta.
          We bargain hard. We stand together. Since 1952.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="hero-button-row">
          <Link href="/members/dues">
            <motion.button
              className="hero-btn-primary"
              whileHover={{ y: -1, boxShadow: "0 6px 24px rgba(10,22,40,0.18)" }}
            >
              <CreditCard className="hero-btn-icon" />
              Pay Dues
            </motion.button>
          </Link>
          <Link href="/members/dispatch">
            <motion.button
              className="hero-btn-secondary"
              whileHover={{ y: -1, backgroundColor: "rgba(10,22,40,0.06)" }}
            >
              <Briefcase className="hero-btn-icon" />
              View Dispatch
            </motion.button>
          </Link>
          <Link href="/register">
            <motion.button
              className="hero-btn-ghost"
              whileHover={{ y: -1 }}
            >
              Join Local 728
              <ArrowRight className="hero-btn-icon" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Metrics */}
        <motion.div variants={itemVariants} className="hero-metrics">
          {METRICS.map((m) => (
            <div key={m.label} className="hero-metric">
              <span className="hero-metric-value">{m.value}</span>
              <span className="hero-metric-label">{m.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <Stylesheet />
    </div>
  )
}

function Stylesheet() {
  return (
    <style>{`
      .hero-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 520px;
        background: #ffffff;
        overflow: hidden;
      }
      .hero-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
        z-index: 0;
      }
      .hero-glow-gold {
        top: 35%;
        left: 55%;
        width: 600px;
        height: 360px;
        transform: translate(-50%, -50%);
        background: radial-gradient(ellipse at center, rgba(201,168,76,0.28) 0%, transparent 70%);
      }
      .hero-glow-navy {
        top: 25%;
        left: 25%;
        width: 480px;
        height: 300px;
        transform: translate(-50%, -50%);
        background: radial-gradient(ellipse at center, rgba(10,22,40,0.07) 0%, transparent 70%);
      }
      .hero-container {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 24px;
        padding: 64px 24px;
        max-width: 560px;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: #7a5c10;
        background-color: rgba(201,168,76,0.12);
        border: 1px solid rgba(201,168,76,0.35);
        border-radius: 100px;
      }
      .hero-badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #C9A84C;
        display: block;
        flex-shrink: 0;
      }
      .hero-headline {
        font-size: clamp(36px, 9vw, 56px);
        font-weight: 900;
        line-height: 0.95;
        letter-spacing: -0.03em;
        color: #0A1628;
        margin: 0;
      }
      .hero-headline-accent {
        background: linear-gradient(135deg, #C9A84C, #e8c96a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .hero-subtitle {
        font-size: clamp(14px, 3.5vw, 16px);
        line-height: 1.65;
        color: rgba(10,22,40,0.55);
        margin: 0;
        max-width: 420px;
      }
      .hero-button-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
      }
      .hero-btn-primary,
      .hero-btn-secondary,
      .hero-btn-ghost {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 11px 22px;
        font-size: 14px;
        font-weight: 600;
        font-family: inherit;
        border-radius: 10px;
        cursor: pointer;
        transition: box-shadow 0.15s, background-color 0.15s;
      }
      .hero-btn-primary {
        color: #0A1628;
        background-color: #C9A84C;
        border: none;
      }
      .hero-btn-secondary {
        color: #0A1628;
        background-color: transparent;
        border: 1px solid rgba(10,22,40,0.18);
      }
      .hero-btn-ghost {
        color: rgba(10,22,40,0.55);
        background-color: transparent;
        border: none;
        padding-left: 4px;
        padding-right: 4px;
      }
      .hero-btn-icon {
        width: 15px;
        height: 15px;
        flex-shrink: 0;
      }
      .hero-metrics {
        display: flex;
        gap: 32px;
        padding-top: 8px;
        border-top: 1px solid rgba(10,22,40,0.08);
        padding-top: 20px;
      }
      .hero-metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
      }
      .hero-metric-value {
        font-size: 20px;
        font-weight: 800;
        color: #0A1628;
        letter-spacing: -0.02em;
      }
      .hero-metric-label {
        font-size: 11px;
        color: rgba(10,22,40,0.45);
        text-transform: uppercase;
        letter-spacing: 0.07em;
        font-weight: 600;
      }
    `}</style>
  )
}
