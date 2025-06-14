"use client";
import React from "react";

function MainComponent() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [background] = useState({
    imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344",
    photographer: "Silas Baisch",
    photographerUrl: "https://unsplash.com/@silasbaisch",
  });

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [fishType, setFishType] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem("fishingLogs");
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (err) {
      console.error(err);
      setError("Could not load saved records");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newLog = {
        id: Date.now(),
        date,
        fish_type: fishType,
        location,
        size: size ? parseInt(size) : null,
        memo,
      };

      const updatedLogs = [newLog, ...logs];
      localStorage.setItem("fishingLogs", JSON.stringify(updatedLogs));
      setLogs(updatedLogs);

      setDate(today);
      setFishType("");
      setLocation("");
      setSize("");
      setMemo("");
    } catch (err) {
      console.error(err);
      setError("Could not save the record");
    }
  };

  const handleDelete = (id) => {
    try {
      const updatedLogs = logs.filter((log) => log.id !== id);
      localStorage.setItem("fishingLogs", JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
    } catch (err) {
      console.error(err);
      setError("Could not delete the record");
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${background.imageUrl})`,
        backgroundColor: "#f4f7f6",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-center text-3xl font-bold text-[#005f73] mb-8">
            🎣 釣りメモ帳
          </h1>

          <h2 className="text-xl font-bold mb-4">釣果を記録する</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="date">
                釣った日:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="fish-type">
                魚種:
              </label>
              <input
                type="text"
                id="fish-type"
                name="fish-type"
                value={fishType}
                onChange={(e) => setFishType(e.target.value)}
                placeholder="例: シーバス"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="location">
                釣った場所:
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例: 〇〇堤防"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="size">
                サイズ (cm):
              </label>
              <input
                type="number"
                id="size"
                name="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="例: 65"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="memo">
                メモ:
              </label>
              <textarea
                id="memo"
                name="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="ヒットルアーや状況など"
                className="w-full p-2 border rounded h-24"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#008cba] hover:bg-[#005f73] text-white font-bold py-2 px-4 rounded"
            >
              記録する
            </button>
          </form>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">記録一覧</h2>

          {logs.length === 0 ? (
            <p className="text-center text-gray-500">記録がありません</p>
          ) : (
            <ul className="space-y-4">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="bg-[#eef7f9]/90 backdrop-blur-sm p-4 rounded border-l-4 border-[#008cba] flex justify-between items-start"
                >
                  <div>
                    <div className="font-bold">
                      {log.date} / {log.fish_type} ({log.location})
                    </div>
                    <div className="text-sm mt-1">
                      サイズ: {log.size ? `${log.size}cm` : "未記録"}
                    </div>
                    {log.memo && (
                      <div className="text-sm text-gray-600 mt-1">
                        {log.memo}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-3 py-1 rounded text-sm"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center text-sm text-white mt-4">
          Photo by{" "}
          <a
            href={background.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#008cba]"
          >
            {background.photographer}
          </a>{" "}
          on Unsplash
        </div>
      </div>
    </div>
  );
}

export default MainComponent;