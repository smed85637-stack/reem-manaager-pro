"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Shell";
import { supabase } from "@/lib/supabase";

async function getStore(sb: any) {
  const {
    data: { user }
  } = await sb.auth.getUser();

  if (!user) return null;

  const { data } = await sb
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  return data?.id || null;
}

export default function Page() {
  const sb = supabase();

  const [store, setStore] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    const sid = await getStore(sb);
    if (!sid) return;

    setStore(sid);

    const { data, error } = await sb
      .from("services")
      .select("*")
      .eq("store_id", sid)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setServices(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addService(e: React.FormEvent) {
    e.preventDefault();

    if (!store) {
      alert("لم يتم العثور على المحل. ادخل إلى صفحة الإعداد أولًا.");
      return;
    }

    const { error } = await sb.from("services").insert({
      store_id: store,
      name,
      description,
      is_active: true
    });

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setDescription("");
    load();
  }

  async function toggleService(id: string, current: boolean) {
    const { error } = await sb
      .from("services")
      .update({ is_active: !current })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    load();
  }

  return (
    <div className="container-page">
      <Header title="الخدمات" sub="إدارة الخدمات التي يبيعها المحل" />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form onSubmit={addService} className="card">
          <h2 className="mb-4 text-xl font-black">إضافة خدمة</h2>

          <input
            className="input mb-3"
            placeholder="مثال: ChatGPT"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            className="input mb-4 min-h-24"
            placeholder="وصف الخدمة"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="btn-primary w-full">إضافة الخدمة</button>
        </form>

        <section className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>الخدمة</th>
                  <th>الوصف</th>
                  <th>الحالة</th>
                  <th>إجراء</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service: any) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{service.description || "-"}</td>
                    <td>{service.is_active ? "نشطة" : "معطلة"}</td>
                    <td>
                      <button
                        className="btn-soft"
                        onClick={() =>
                          toggleService(service.id, service.is_active)
                        }
                      >
                        {service.is_active ? "تعطيل" : "تفعيل"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
