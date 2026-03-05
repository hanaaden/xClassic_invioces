"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Printer, User, Sparkles } from "lucide-react";

export default function Invoice() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [perfumeName, setPerfumeName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  const [note, setNote] = useState("");

  const total = quantity * price;

  const generatePDF = async () => {
    const invoice = document.getElementById("invoice-render");
    if (!invoice) return;

    invoice.style.display = "block";

    const canvas = await html2canvas(invoice, {
      scale: 3,
    });

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
      <div className="max-w-3xl mx-auto space-y-8">

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

          <div>
            <label className="text-sm font-semibold">Customer Name</label>
            <input
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-purple-100 border p-3 rounded-xl mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Phone Number</label>
            <input
              placeholder="Enter phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-purple-100 border p-3 rounded-xl mt-1"
            />
          </div>
        </div>

        {/* ORDER DETAILS */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-bold">Order Details</h2>

          <div>
            <label className="text-sm font-semibold">Perfume Name</label>
            <input
              placeholder="Enter perfume name"
              value={perfumeName}
              onChange={(e) => setPerfumeName(e.target.value)}
              className="w-full border bg-purple-100 p-3 rounded-xl mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border bg-purple-100 p-3 rounded-xl w-full mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border bg-purple-100 p-3 rounded-xl w-full mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Total</label>
              <input
                disabled
                value={total}
                className="border bg-gray-100 p-3 rounded-xl w-full mt-1"
              />
            </div>
          </div>
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
      </div>

      {/* PDF TEMPLATE */}
      <div
        id="invoice-render"
        className="hidden bg-white p-[50px] w-[595pt] min-h-[842pt]"
      >
        {/* HEADER */}
        <div className="flex justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-black">XCLASSIC</h1>
            <p className="text-pink-500 font-bold">Lady Perfume</p>
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
            <tr>
              <td className="p-3 font-bold">
                {perfumeName || "Xclassic Lady Perfume"}
              </td>
              <td className="p-3 text-center">{quantity}</td>
              <td className="p-3 text-center">${price}</td>
              <td className="p-3 text-right">${total}</td>
            </tr>
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
          Total: ${total}
        </div>

        <p className="mt-20 text-sm text-gray-500">
          Thank you for purchasing Xclassic Lady Perfume!
        </p>
      </div>
    </div>
  );
}