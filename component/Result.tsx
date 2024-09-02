/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";
import style from "@/style/component/Result.module.css";

function Result({ keyword }: { keyword: string[] }) {
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    dataUrl: "./unity/Build.data",
    frameworkUrl: "./unity/Build.framework.js",
    loaderUrl: "./unity/Build.loader.js",
    codeUrl: "./unity/Build.wasm",
  });

  const [list, setList] = useState<
    {
      map_data: {
        name: string;
        image_links: string[];
        reviews: string[];
      };
      say: string;
    }[]
  >(
    []
    // new Array(100).fill(0).map((_, idx) => ({
    //   map_data: {
    //     name: `${idx + 1}`,
    //     image_links: [
    //       "https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/1jPF/image/3_rpB-J9v98E-OoldGxBZbEVDSI.jpg",
    //       "https://cdn.eroun.net/news/photo/202306/33868_61498_1924.jpg",
    //     ],
    //     reviews: new Array(((Math.random() * 10) | 0) + 5)
    //       .fill(0)
    //       .map((_, idx) => `${idx + 1}`),
    //   },
    //   say: `${idx + 1}`,
    // }))
  );
  const [idx, setIdx] = useState(0);
  const [content, setContent] = useState("");
  const [buttonStatus, setButtonStatus] = useState<"review" | "chat">("chat");
  const [tour, setTour] = useState<string[]>([]);

  const chat = (content: string) => {
    const list_ = [...list];
    list_[idx].say = content;
    setList(list_);
    sendMessage(
      "ReactReceiver",
      "GetStringFromReact",
      JSON.stringify({ say: content })
    );
  };

  const review = (content: string) => {
    const list_: any = [...list];
    list_[idx].map_data.reviews.push(content);
    delete list_[idx].say;
    setList(list_);
    sendMessage(
      "ReactReceiver",
      "GetStringFromReact",
      JSON.stringify(list_[idx])
    );
  };

  useEffect(() => {
    (async () => {
      if (!isLoaded) return;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const tourFetch = await fetch("/api/tour", {
        method: "POST",
        body: JSON.stringify({ keyword, tour: [] }),
      });
      const tourJson = await tourFetch.json();
      const tour = tourJson.result.replace(/ /g, "");
      setTour([tour]);
      const dbExist = await fetch(`/api/place/${tour}`);
      const db = dbExist.ok
        ? await dbExist.json()
        : await (
            await fetch(`/api/place`, {
              method: "POST",
              body: JSON.stringify({
                name: tour,
                image: await (
                  await fetch(`/api/image?q=${encodeURI(`충북 ${tour}`)}`)
                ).json(),
                review: [],
              }),
            })
          ).json();
      console.log(db);
      const data = {
        map_data: {
          name: db.name,
          image_links: db.image,
          reviews: db.review,
        },
        say: "",
      };
      setList([data]);
      sendMessage("ReactReceiver", "GetStringFromReact", JSON.stringify(data));
    })();
  }, [isLoaded]);

  useEffect(() => {
    (async () => {
      if (!isLoaded) return;
      else await new Promise((resolve) => setTimeout(resolve, 500));
      sendMessage(
        "ReactReceiver",
        "GetStringFromReact",
        JSON.stringify(list[idx])
      );
      setContent("");
    })();
  }, [isLoaded, idx]);

  return (
    <div className={style.container}>
      <div className={`${style.container_left}`}>
        <div
          className={`${style.page_button}`}
          onClick={() => {
            if (idx > 0) setIdx(idx - 1);
          }}
        >
          &lt;
        </div>
      </div>
      <div className={`${style.unity_container}`}>
        <Unity className={style.unity} unityProvider={unityProvider} />
      </div>
      <div className={`${style.container_right}`}>
        <div
          className={style.page_button}
          onClick={async () => {
            if (idx + 1 >= list.length) {
              const tourFetch = await fetch("/api/tour", {
                method: "POST",
                body: JSON.stringify({ keyword, tour }),
              });
              const tourJson = await tourFetch.json();
              const tour_ = tourJson.result.replace(/ /g, "");
              setTour([...tour, tour_]);
              const dbExist = await fetch(`/api/place/${tour_}`);
              const db = dbExist.ok
                ? await dbExist.json()
                : await (
                    await fetch(`/api/place`, {
                      method: "POST",
                      body: JSON.stringify({
                        name: tour_,
                        image: await (
                          await fetch(
                            `/api/image?q=${encodeURI(`충북 ${tour_}`)}`
                          )
                        ).json(),
                        review: [],
                      }),
                    })
                  ).json();
              const data = {
                map_data: {
                  name: db.name,
                  image_links: db.image,
                  reviews: db.review,
                },
                say: "",
              };
              console.log(data);
              setList([...list, data]);
              sendMessage(
                "ReactReceiver",
                "GetStringFromReact",
                JSON.stringify(data)
              );
            }
            setIdx(idx + 1);
          }}
        >
          &gt;
        </div>
      </div>

      <div className={style.container_input}>
        <div className={style.container_input_flex}>
          <img
            className={`${style.pointer} ${style.icon}`}
            onClick={(e) => {
              setButtonStatus(buttonStatus == "review" ? "chat" : "review");
            }}
            src={`/icon/${buttonStatus == "review" ? "review" : "chat"}.svg`}
            alt={buttonStatus == "review" ? "review" : "chat"}
            title={buttonStatus == "review" ? "리뷰" : "채팅"}
          />

          <input
            className={style.input}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={async (event) => {
              if (event.key != 'Enter') return;
              if (buttonStatus == "review") {
                list[idx].map_data.reviews.push(content);
                fetch(`/api/place/${list[idx].map_data.name}`, {
                  method: "PATCH",
                  body: JSON.stringify({
                    review: list[idx].map_data.reviews,
                  }),
                });
                sendMessage(
                  "ReactReceiver",
                  "GetStringFromReact",
                  JSON.stringify(list[idx])
                );
              } else {
                const chatFetch = await fetch(`/api/chat`, {
                  method: "POST",
                  body: JSON.stringify({
                    tour: list[idx].map_data.name,
                    chat: content,
                  }),
                });
                const chatJson = await chatFetch.json();
                console.log(chatJson);
                sendMessage(
                  "ReactReceiver",
                  "GetStringFromReact",
                  JSON.stringify({ say: chatJson })
                );
              }
              setContent("");
            }}
            placeholder="내용을 입력해주세요"
          />

          <img
            className={`${style.pointer} ${style.icon}`}
            onClick={async () => {
              if (buttonStatus == "review") {
                list[idx].map_data.reviews.push(content);
                fetch(`/api/place/${list[idx].map_data.name}`, {
                  method: "PATCH",
                  body: JSON.stringify({
                    review: list[idx].map_data.reviews,
                  }),
                });
                sendMessage(
                  "ReactReceiver",
                  "GetStringFromReact",
                  JSON.stringify(list[idx])
                );
              } else {
                const chatFetch = await fetch(`/api/chat`, {
                  method: "POST",
                  body: JSON.stringify({
                    tour: list[idx].map_data.name,
                    chat: content,
                  }),
                });
                const chatJson = await chatFetch.json();
                console.log(chatJson);
                sendMessage(
                  "ReactReceiver",
                  "GetStringFromReact",
                  JSON.stringify({ say: chatJson })
                );
              }
              setContent("");
            }}
            src="/icon/send.svg"
            alt="send"
            title="보내기"
          />
        </div>
      </div>
    </div>
  );
}

export default Result;
