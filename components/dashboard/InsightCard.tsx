export default function InsightCard() {
    return (
        <div className="bg-[#1a1a22] p-6 rounded-2xl border border-gray-800">

            {/* TITLE */}
            <h3 className="font-semibold mb-5 text-white text-lg">
                Quick Insights
            </h3>

            <div className="space-y-5">

                {/* ================= ITEM 1 ================= */}
                <div className="flex items-center gap-5 bg-red-500/10 p-4 rounded-xl hover:scale-[1.02] transition duration-300">

                    {/* ICON PANAH KE ATAS */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF6467] to-[#FB64B6] flex items-center justify-center shadow-lg shadow-black/30">
                        <svg
                            viewBox="0 0 42 42"
                            className="w-8 h-8"
                            fill="none"
                        >
                            <g transform="scale(1.6) translate(-8 -8)">
                                <path
                                    d="M27.6667 16.6667L22 22.3334L18.6667 19.0001L14.3334 23.3334"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M23.6666 16.6667H27.6666V20.6667"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>
                    </div>

                    {/* TEXT */}
                    <div>
                        <p className="text-red-400 font-semibold text-sm">
                            Sentimen negatif meningkat
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Dibanding minggu lalu
                        </p>
                    </div>
                </div>


                {/* ================= ITEM 2 ================= */}
                <div className="flex items-center gap-5 bg-yellow-500/10 p-4 rounded-xl hover:scale-[1.02] transition duration-300">

                    {/* ICON BULAN */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFB900] to-[#FF8904] flex items-center justify-center shadow-lg shadow-black/30">
                        <svg
                            viewBox="0 0 42 42"
                            className="w-8 h-8"
                            fill="none"
                        >
                            <g transform="scale(1.6) translate(-8 -8)">
                                <path
                                    d="M21 14C20.2044 14.7956 19.7574 15.8748 19.7574 17C19.7574 18.1252 20.2044 19.2044 21 20C21.7957 20.7956 22.8748 21.2426 24 21.2426C25.1252 21.2426 26.2044 20.7956 27 20C27 21.1867 26.6481 22.3467 25.9888 23.3334C25.3295 24.3201 24.3925 25.0892 23.2961 25.5433C22.1997 25.9974 20.9933 26.1162 19.8295 25.8847C18.6656 25.6532 17.5965 25.0818 16.7574 24.2426C15.9182 23.4035 15.3468 22.3344 15.1153 21.1705C14.8838 20.0067 15.0026 18.8003 15.4567 17.7039C15.9109 16.6075 16.6799 15.6705 17.6666 15.0112C18.6533 14.3519 19.8133 14 21 14Z"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>
                    </div>

                    {/* TEXT */}
                    <div>
                        <p className="text-yellow-400 font-semibold text-sm">
                            Rata-rata tidur kurang
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Rekomendasi: 7 – 9 jam
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}