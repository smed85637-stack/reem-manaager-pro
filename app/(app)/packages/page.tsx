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
  const [packages, setPackages] = useState<any[]>([]);

  const [serviceId, setServiceId] = useState("");
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("0");
  const [durationDays, setDurationDays] = useState("30");

  async function load() {
    const sid = await getStore(sb);
    if (!sid) return;

    setStore(sid);

    const { data: servicesData, error: servicesError } = await sb
      .from("services")
      .select("*")
      .eq("store_id", sid)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (servicesError) {
      alert(servicesError.message);
      return;
    }

    setServices(servicesData || []);

    if (!serviceId && servicesData && servicesData.length > 0) {
      setServiceId(servicesData[0].id);
    }

    const { data: packagesData, error: packagesError } = await sb
      .from("packages")
      .select("*, services(name)")
      .eq("store_id", sid)
      .order("created_at", { ascending: false });

    if (packagesError) {
      alert(packagesError.message);
      return;
    }

    setPackages(packagesData || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addPackage(e: React.FormEvent) {
    e.preventDefault();

    if (!store) {
      alert("لم يتم العثور على المحل. ادخل إلى صفحة الإعداد أولًا.");
      return;
    }

    if (!serviceId) {
      alert("أضف خدمة أولًا قبل إضافة باقة.");
      return;
    }

    const { error } = await sb.from("packages").insert({
      store_id: store,
      service_id: serviceId,
      package_name: packageName,
      price: Number(price || 0),
      duration_days: Number(durationDays || 30),
      is_active: true
    });

    if (error) {
      alert(error.message);
      return;
    }

    setPackageName("");
    setPrice("0");
    setDurationDays("30");
    load();
  }

  return (
    <div className="container-page">
      <Header title="الباقات والأسعار" sub="إدارة باقات الخدمات وأسعارها" />

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <form onSubmit={addPackage} className="card">
          <h2 className="mb-4 text-xl font-black">إضافة باقة</h2>

          <label className="mb-2 block text-sm font-bold">الخدمة</label>
          <select
            className="input mb-3"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {services.map((service: any) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <label className="mb-2 block text-sm font-bold">اسم الباقة</label>
          <input
            className="input mb-3"
            placeholder="مثال: شهر واحد"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            required
          />

          <label className="mb-2 block text-sm font-bold">السعر MRU</label>
          <input
            className="input mb-3"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label className="mb-2 block text-sm font-bold">المدة بالأيام</label>
          <input
            className="input mb-4"
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
          />

          <button className="btn-primary w-full">إضافة الباقة</button>
        </form>

        <section className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>الخدمة</th>
                  <th>الباقة</th>
                  <th>السعر</th>
                  <th>المدة</th>
                  <th>الحالة</th>
                </tr>
              </thead>

              <tbody>
                {packages.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.services?.name || "-"}</td>
                    <td>{item.package_name}</td>
                    <td>{item.price} MRU</td>
                    <td>{item.duration_days} يوم</td>
                    <td>{item.is_active ? "نشطة" : "معطلة"}</td>
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
