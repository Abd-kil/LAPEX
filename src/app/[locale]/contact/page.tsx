import { ContactContent } from "@/app/components/sections/contact/ContactContent";
import { getContactInfo } from "@/app/lib/supabase/queries";

export const revalidate = 3600;

export default async function ContactPage() {
  const contactInfo = (await getContactInfo()) ?? {};
  return <ContactContent contactInfo={contactInfo} />;
}
