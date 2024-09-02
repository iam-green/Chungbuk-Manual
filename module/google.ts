export class Google {
  static async photo(query: string, limit: number = 5) {
    const fetched = await fetch(
      `https://www.google.com/search?q=${encodeURI(query)}&udm=2`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        },
      }
    );
    if (!fetched.ok) return [];
    const data = JSON.parse(
      (await fetched.text()).split("(function(){var m=")[1].split(";var")[0]
    );
    const result: string[] = [];
    for (const item of Object.values(data) as any[])
      if (item?.[1]?.[3]?.[0]?.startsWith("http")) result.push(item[1][3][0]);
    return result
      .filter((v) => {
        for (const rule of ["youtube.com", "ytimg.com"])
          if (v.includes(rule)) return false;
        return true;
      })
      .slice(0, limit);
  }
}
