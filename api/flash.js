export default async function handler(req, res) {
  // simpan status global (default: mati)
  if (!global.flashStatus) global.flashStatus = "off";

  if (req.method === "GET") {
    // client (HP rusak) minta status
    return res.status(200).json({ status: global.flashStatus });
  }

  if (req.method === "POST") {
    try {
      // parsing JSON body manual
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(JSON.parse(data || "{}")));
        req.on("error", reject);
      });

      if (body.status === "on" || body.status === "off") {
        global.flashStatus = body.status;
        console.log("Flash diubah ke:", global.flashStatus);
        return res.status(200).json({ success: true, status: global.flashStatus });
      }

      return res.status(400).json({ success: false, message: "status invalid" });
    } catch {
      return res.status(400).json({ success: false, message: "body invalid" });
    }
  }

  res.status(405).json({ success: false, message: "method not allowed" });
}
