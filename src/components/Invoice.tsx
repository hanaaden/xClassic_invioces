"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Printer, User, Sparkles, Plus, Trash2 } from "lucide-react";

interface Perfume {
  name: string;
  qty: number;
  price: number;
}

export default function Invoice() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [perfumes, setPerfumes] = useState<Perfume[]>([
    { name: "", qty: 1, price: 0 },
  ]);

  const [note, setNote] = useState("");

  const addPerfume = () => {
    setPerfumes([...perfumes, { name: "", qty: 1, price: 0 }]);
  };

  const removePerfume = (index: number) => {
    const updated = perfumes.filter((_, i) => i !== index);
    setPerfumes(updated);
  };

  const updatePerfume = (
    index: number,
    field: keyof Perfume,
    value: string
  ) => {
    const updated = [...perfumes];

    if (field === "name") updated[index].name = value;
    if (field === "qty") updated[index].qty = Number(value);
    if (field === "price") updated[index].price = Number(value);

    setPerfumes(updated);
  };

  const grandTotal = perfumes.reduce(
    (sum, p) => sum + p.qty * p.price,
    0
  );

  const generatePDF = async () => {
    const invoice = document.getElementById("invoice-render");
    if (!invoice) return;

    invoice.style.display = "block";

    const canvas = await html2canvas(invoice, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`Invoice_${customerName || "Customer"}.pdf`);

    invoice.style.display = "none";
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">

      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}

        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow">

          <div className="flex items-center gap-3">
            <Sparkles className="text-pink-500" size={28} />

            <div>
              <h1 className="font-black text-xl">Xclassic Lady Perfume</h1>
              <p className="text-sm text-gray-500">Sales Invoice</p>
            </div>
          </div>

          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl"
          >
            <Printer size={18} />
            Generate PDF
          </button>

        </div>

        {/* CUSTOMER INFO */}

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">

          <h2 className="font-bold flex items-center gap-2">
            <User size={18} /> Customer Info
          </h2>

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-purple-100 border p-3 rounded-xl"
          />

          <input
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full bg-purple-100 border p-3 rounded-xl"
          />

        </div>

        {/* PERFUME LIST */}

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">

          <h2 className="font-bold">Perfume List</h2>

          {perfumes.map((p, index) => {

            const total = p.qty * p.price;

            return (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-end"
              >

                <div>
                  <label className="text-sm font-semibold">
                    Perfume Name
                  </label>

                  <input
                    value={p.name}
                    onChange={(e) =>
                      updatePerfume(index, "name", e.target.value)
                    }
                    className="border bg-purple-100 p-3 rounded-xl w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Quantity
                  </label>

                  <input
                    type="number"
                    value={p.qty}
                    onChange={(e) =>
                      updatePerfume(index, "qty", e.target.value)
                    }
                    className="border bg-purple-100 p-3 rounded-xl w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Price
                  </label>

                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) =>
                      updatePerfume(index, "price", e.target.value)
                    }
                    className="border bg-purple-100 p-3 rounded-xl w-full"
                  />
                </div>

                <div className="flex gap-2">

                  <div className="flex-1">
                    <label className="text-sm font-semibold">
                      Total
                    </label>

                    <input
                      disabled
                      value={total}
                      className="border bg-gray-100 p-3 rounded-xl w-full"
                    />
                  </div>

                  <button
                    onClick={() => removePerfume(index)}
                    className="bg-red-100 p-3 rounded-xl text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            );
          })}

          <button
            onClick={addPerfume}
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl"
          >
            <Plus size={16} />
            Add Perfume
          </button>

        </div>

        {/* NOTE */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="font-bold mb-3">Note</h2>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Small note..."
            className="w-full border bg-purple-100 p-3 rounded-xl"
          />

        </div>

        {/* GRAND TOTAL */}

        <div className="text-right text-3xl font-black">
          Total: ${grandTotal}
        </div>

      </div>

      {/* PDF TEMPLATE */}

      <div
        id="invoice-render"
        className="hidden bg-white p-[50px] w-[595pt] min-h-[842pt]"
      >

        {/* HEADER */}

        <div className="flex justify-between border-b pb-6">

          <div>

            <h1 className="text-3xl font-black">
              XCLASSIC LADY PERFUME
            </h1>

            {/* BUSINESS DETAILS */}

            <div className="text-sm text-gray-600 mt-2">
              
              <p>Tell: 639117119 / 634557235 / 634486004</p>
              <p>Merchant: 479274</p>
eDahab: 758164
              <p></p>
            </div>

          </div>

          <div className="text-right">

            <h2 className="text-2xl">INVOICE</h2>

            <p>{new Date().toLocaleDateString()}</p>

          </div>

        </div>

        {/* CUSTOMER */}

        <div className="mt-8">

          <p className="text-sm text-gray-500">Customer</p>

          <h3 className="font-bold text-lg">
            {customerName || "Customer"}
          </h3>

          <p>{customerPhone || "-"}</p>

        </div>

        {/* TABLE */}

        <table className="w-full mt-10">

          <thead>

            <tr className="bg-black text-white">

              <th className="p-3 text-left">Perfume</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-right">Total</th>

            </tr>

          </thead>

          <tbody>

            {perfumes.map((p, i) => {

              const total = p.qty * p.price;

              return (
                <tr key={i}>

                  <td className="p-3 font-bold">
                    {p.name || "Perfume"}
                  </td>

                  <td className="p-3 text-center">{p.qty}</td>

                  <td className="p-3 text-center">
                    ${p.price}
                  </td>

                  <td className="p-3 text-right">
                    ${total}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

        {/* NOTE */}

        {note && (

          <div className="mt-10">

            <p className="font-bold">Note</p>

            <p>{note}</p>

          </div>

        )}

        {/* TOTAL */}

        <div className="mt-12 text-right text-2xl font-black">
          Total: ${grandTotal}
        </div>

        <p className="mt-20 text-sm text-gray-500">
          Thank you for purchasing Xclassic perfumes!
        </p>

      </div>

    </div>
  );
}