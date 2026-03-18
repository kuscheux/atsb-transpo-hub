import { NewHireForm } from "@/components/forms/new-hire-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Hire Form | ATSB Transportation",
  description: "Complete your new hire onboarding for the ATSB Transportation crew.",
}

export default function HirePage() {
  return <NewHireForm />
}
