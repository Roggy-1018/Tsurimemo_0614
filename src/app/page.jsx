"use client";
import React from "react";

function MainComponent() {
  // ステート（状態）の定義
  const [logs, setLogs] = useState([]); // 釣果記録を保存する配列
  const [error, setError] = useState(null); // エラーメッセージを保存
  const [loading, setLoading] = useState(true); // データ読み込み中かどうかを示すフラグ

  // 背景画像の設定（固定）
  const [background] = useState({
    imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344",
    photographer: "Silas Baisch",
    photographerUrl: "https://unsplash.com/@silasbaisch",
  });

  // フォームの入力値を管理するステート
  const today = new Date().toISOString().split("T")[0]; // 今日の日付をYYYY-MM-DD形式で取得
  const [date, setDate] = useState(today); // 釣った日
  const [fishType, setFishType] = useState(""); // 魚種
  const [location, setLocation] = useState(""); // 釣った場所
  const [size, setSize] = useState(""); // サイズ（cm）
  const [memo, setMemo] = useState(""); // メモ

  // データベースから釣果記録を読み込む関数
  const loadFishLogs = useCallback(async () => {
    try {
      const response = await fetch("/api/fish-logs/list", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Failed to fetch fish logs: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data.logs); // 取得したデータをステートに保存
    } catch (err) {
      console.error(err);
      setError("釣果記録の読み込みに失敗しました");
    } finally {
      setLoading(false); // 読み込み完了
    }
  }, []);

  // 初回表示時にデータを読み込む
  useEffect(() => {
    loadFishLogs();
  }, [loadFishLogs]);

  // フォームの送信処理（新しい釣果を記録）
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信を防止
    try {
      // APIにデータを送信
      const response = await fetch("/api/fish-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          fish_type: fishType,
          location,
          size: size ? parseInt(size) : null, // サイズが入力されている場合のみ数値に変換
          memo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create fish log: ${response.status}`);
      }

      // 送信成功後、フォームをリセット
      setDate(today);
      setFishType("");
      setLocation("");
      setSize("");
      setMemo("");

      // 最新のデータを再読み込み
      loadFishLogs();
    } catch (err) {
      console.error(err);
      setError("釣果の記録に失敗しました");
    }
  };

  // 記録の削除処理
  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/fish-logs/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete fish log: ${response.status}`);
      }

      // 削除後、データを再読み込み
      loadFishLogs();
    } catch (err) {
      console.error(err);
      setError("記録の削除に失敗しました");
    }
  };

  // UIの描画
  return (
    <div
      className="min-h-screen py-8 px-4 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${background.imageUrl})`,
        backgroundColor: "#f4f7f6",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* 入力フォームセクション */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-center text-3xl font-bold text-[#005f73] mb-8">
            🎣 釣りメモ帳
          </h1>

          <h2 className="text-xl font-bold mb-4">釣果を記録する</h2>

          {/* エラーメッセージ表示 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* 釣果記録フォーム */}
          <form onSubmit={handleSubmit}>
            {/* 日付入力 */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="date">
                釣った日:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* 魚種入力 */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="fish-type">
                魚種:
              </label>
              <input
                type="text"
                id="fish-type"
                value={fishType}
                onChange={(e) => setFishType(e.target.value)}
                placeholder="例: シーバス"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* 場所入力 */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="location">
                釣った場所:
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例: 〇〇堤防"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* サイズ入力 */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="size">
                サイズ (cm):
              </label>
              <input
                type="number"
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="例: 65"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* メモ入力 */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="memo">
                メモ:
              </label>
              <textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="ヒットルアーや状況など"
                className="w-full p-2 border rounded h-24"
              />
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              className="w-full bg-[#008cba] hover:bg-[#005f73] text-white font-bold py-2 px-4 rounded"
            >
              記録する
            </button>
          </form>
        </div>

        {/* 記録一覧セクション */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">記録一覧</h2>

          {/* ローディング中、データなし、データ表示の条件分岐 */}
          {loading ? (
            <p className="text-center">読み込み中...</p>
          ) : logs.length === 0 ? (
            <p className="text-center text-gray-500">記録がありません</p>
          ) : (
            <ul className="space-y-4">
              {/* 記録のリスト表示 */}
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="bg-[#eef7f9]/90 backdrop-blur-sm p-4 rounded border-l-4 border-[#008cba] flex justify-between items-start"
                >
                  <div>
                    {/* 記録の基本情報 */}
                    <div className="font-bold">
                      {log.date.split("T")[0]} / {log.fish_type} ({log.location}
                      )
                    </div>
                    {/* サイズ情報 */}
                    <div className="text-sm mt-1">
                      サイズ: {log.size ? `${log.size}cm` : "未記録"}
                    </div>
                    {/* メモ情報（存在する場合のみ表示） */}
                    {log.memo && (
                      <div className="text-sm text-gray-600 mt-1">
                        {log.memo}
                      </div>
                    )}
                  </div>
                  {/* 削除ボタン */}
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

        {/* 背景画像のクレジット表示 */}
        {background && (
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
        )}
      </div>
    </div>
  );
}

export default MainComponent;