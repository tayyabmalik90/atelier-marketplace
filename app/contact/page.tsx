import { Page } from "@/components/Prose";
import { ContactForm } from "@/components/ContactForm";
export const metadata = { title: "Contact us" };
export default function P() { return <Page title="Contact us" intro="Questions, refunds or licensing? We're here."><ContactForm /></Page>; }
