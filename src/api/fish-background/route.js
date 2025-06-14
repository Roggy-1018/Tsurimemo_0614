async function handler() {
  try {
    // 固定の写真IDを使用
    const response = await fetch("https://api.pexels.com/v1/photos/3328386", {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return { error: "Failed to fetch image" };
    }

    const data = await response.json();
    console.log("Pexels API response:", data); // デバッグ用ログ

    return {
      imageUrl: data.src.original,
      photographer: data.photographer,
      photographerUrl: data.photographer_url,
    };
  } catch (error) {
    console.error("Error in get_fish_background:", error);
    return { error: error.message };
  }
}
export async function POST(request) {
  return handler(await request.json());
}