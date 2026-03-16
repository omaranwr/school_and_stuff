import { db } from "@/db";
import { post, subject } from "@/db/schema";
import AdminForm from "@/app/components/AdminForm";

async function AdminPage() {
  const subjects = db
    .select({ id: subject.id, name: subject.name })
    .from(subject)
    .all();
  const types = post.type.enumValues;

  return <AdminForm subjectsPromise={subjects} types={types} />;
}

export default AdminPage;
