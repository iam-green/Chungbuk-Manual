import { useEffect, useState } from "react";
import style from "@/style/component/Select.module.css";

function Select() {
  const list = [
    { insider: "내향적", outsider: "외향적" },
    { forest: "숲과 관련된 곳", ocean: "물과 관련된 곳" },
    { minor_place: "이색 관광지 위주", hot_place: "인기 관광지 위주" },
  ];
  const [keyword, setKeyword] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (list.length == keyword.length)
      window.location.href = `/?keyword=${JSON.stringify(keyword)}`;
  }, [keyword]);

  return (
    <div className={style.container}>
      <div className={style.title}></div>

      <div
        className={style.left}
        style={{
          backgroundImage: `url(/image/${Object.entries(list[idx])[0][0]}.png)`,
        }}
        onClick={() => {
          setKeyword([...keyword, Object.entries(list[idx])[0][1]]);
          if (list.length > idx + 1) setIdx(idx + 1);
        }}
      ></div>
      <div className={style.center}></div>
      <div
        className={style.right}
        style={{
          backgroundImage: `url(/image/${Object.entries(list[idx])[1][0]}.png)`,
        }}
        onClick={() => {
          setKeyword([...keyword, Object.entries(list[idx])[1][1]]);
          if (list.length > idx + 1) setIdx(idx + 1);
        }}
      ></div>
    </div>
  );
}
export default Select;
