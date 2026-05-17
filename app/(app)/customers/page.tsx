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
  const [rows, setRows] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function load() {
    const sid = await getStore(sb);
    if (!sid) return;

    setStore(sid);

    const { data, error } = await sb
      .from("customers")
      .select("*")
      .eq("store_id", sid)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setRows(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();

    if (!store) {
      alert("لم يتم العثور على المحل. ادخل إلى صفحة الإعداد أولًا.");
      return;
    }

    const { error } = await sb.from("customers").insert({
      store_id: store,
      name,
      phone
    });

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setPhone("");
    load();
  }

  return (
    <div className="container-page">
      <Header title="الزبائن" sub="إدارة زبائن المحل" />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form onSubmit={add} className="card">
          <h2 className="mb-4 text-xl font-black">إضافة زبون</h2>

          <input
            className="input mb-3"
            placeholder="اسم الزبون"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="input mb-4"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <button className="btn-primary w-full">إضافة</button>
        </form>

        <section className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الهاتف</th>
                  <th>تاريخ الإضافة</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{(r.created_at || "").slice(0, 10)}</td>
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
