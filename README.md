# 🧠 Tenang.in

Aplikasi daily check-in untuk memantau kondisi mental dan risiko burnout berbasis Next.js.

---

## 🚀 Fitur Utama

- ✍️ Input jurnal harian
- 😴 Input jam tidur
- 💼 Input tingkat kesibukan (workload)
- 🤖 Analisis risiko burnout (low, medium, high)
- 📊 Visualisasi hasil (score & chart)
- 💡 Rekomendasi berdasarkan kondisi user

---

## 🧠 Cara Kerja

1. User mengisi data (journal, sleep, workload)
2. Data dikirim ke API `/api/checkin`
3. Backend memproses dan menentukan:
   - risk level (low / medium / high)
   - score
4. Hasil ditampilkan di halaman result

---

## 🛠️ Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- API Routes (Backend)

---

## ▶️ Cara Menjalankan

```bash
npm install
npm run dev