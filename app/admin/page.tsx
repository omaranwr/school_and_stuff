import { db } from "@/db";
import { subject } from "@/db/schema";
import AdminForm from "@/app/components/AdminForm";

async function AdminPage() {
  const subjects = db
    .select({ id: subject.id, name: subject.name })
    .from(subject)
    .all();

  return <AdminForm subjectsPromise={subjects} />;
}

export default AdminPage;
