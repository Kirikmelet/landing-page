"use client"
import Div from "./base_components/div";
import { fetchWeatherApi } from "openmeteo";
import WeatherDiv from "./components/weather";
import WebsiteList from "./components/website_list";
import { number2kanji } from "@geolonia/japanese-numeral";
import { useState, useEffect, MutableRefObject } from "react"
import useSWR from "swr";
import { useRef } from "react";
import Image from "next/image";
import maidenJpg from "./maiden.jpg"


function getGreetingDay(date: Date): String {
  const hour = date.getHours()
  if (hour <= 12) {
    return "お早う御座います"
  } else if (hour >= 17) {
    return "今晩は"
  }
  return "今日は"
}

function fetchChinesePoetry(query: string): Promise<string> {
  return fetch(`https://api.ctext.org/gettext?urn=${query}`)
    .then((f) => f.json()).then((f) => {
      if (f["subsections"]) {
        return fetchChinesePoetry(f["subsections"][Math.floor(Math.random() * f["subsections"].length)])
      } else if (f["fulltext"]) {
        return (f["fulltext"].join(" ") as string)
      } else {
        return "no"
      }
    })
}

function GetPoetry(): JSX.Element {
  const { data, error, isLoading } = useSWR("ctp:book-of-poetry", fetchChinesePoetry)
  if (isLoading) { return <p>讀み込み中…</p> }
  if (error) { return <p>無詩可述...</p> }
  return <p className="text-sm">
    {data}
  </p>
}


export default function Home() {
  const [date, setDate] = useState(new Date())
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => clearInterval(intervalId)
  })
  const month = Math.floor(date.getMonth())
  const year = Math.floor(date.getFullYear())
  const day = Math.floor(date.getDate())
  const hour = date.getHours()
  const minute = date.getMinutes()
  function horizontalScroll(ev: React.WheelEvent<HTMLElement>) {
    let target = (ev.currentTarget! as HTMLElement)
    target.scrollLeft -= ev.deltaY
  }
  return <>
    <search className="bg-transparent">
      <form className="pr:hidden relative top-2 left-0 right-0 m-0" action="https://www.google.com/search" role="searchbox">
        <div className="pb-10 flex sm:flex-row flex-col-reverse gap-2 justify-center align-middle w-screen">
          <input type="search" name="q" autoComplete="false" style={{ direction: "ltr" }} className="text-sm h-max left-0 right-0 px-2"></input>
          <button type="submit" className="border-solid border-black border-2 text-lg">検索する</button>
        </div>
      </form>
    </search>
    <main onWheel={horizontalScroll} id="main" className=" pr:block pr:text-base flex flex-col gap-2 writing-direction-rl overflow-y-hidden absolute bottom-2 left-2 right-2 sm:top-14 top-20 bg-bisque">
      <h1 className='text-3xl font-bold pl-6'>{getGreetingDay(date)}トロイさん。</h1>
      <Div name={"日付と時間"}>
        <p>今囘日付は<span className="text-xl">{number2kanji(year)}年{number2kanji(month)}月{number2kanji(day)}日</span>です。</p>
        <p>今囘時間は<span className="text-2xl">{number2kanji(hour)}時{number2kanji(minute)}分</span>です。</p>
      </Div>
      <WeatherDiv></WeatherDiv>
      <WebsiteList name="學習のウェブサイト" items={[
        { url: "https://jisho.org", name: "日本語辭書" },
        { url: "https://mdbg.net", name: "華語詞典" },
        { url: "https://mogher.com/", name: "潮州話詞典" },
        { url: "https://dict.cc/", name: "ドイツ語辭書" },
        { url: "https://khanacademy.org/", name: "カーンアカデミー" },
      ]}></WebsiteList>
      <WebsiteList name="ソーシャルメディアウェブサイト" items={[
        { url: "https://youtube.com", name: "ユーチューブ" },
        { url: "https://instagram.net", name: "インスタグラム" },
        { url: "https://twitter.com/", name: "ツイッター" },
        { url: "https://reddit.com/", name: "レディット" },
        { url: "https://lemmygrad.com/", name: "レミーグラード" },
        { url: "https://open.spotify.com", name: "スポティファイ" }
      ]}></WebsiteList>
      <WebsiteList name="ゲーミングウェブサイト" items={[
        { url: "https://steam.com", name: "スチーム" },
        { url: "https://riotgames.com", name: "ライアットゲームズ" },
        { url: "https://aternos.org/", name: "アテルノス" },
        { url: "https://modrinth.com/", name: "モドリンス" },
      ]}></WebsiteList>
      <WebsiteList name="漫畫、映畫のウェブサイト" items={[
        { url: "https://mangadex.org", name: "マンガデックス" },
        { url: "https://novelupdates.com", name: "ノベルアップデート" },
        { url: "https://anilist.co/", name: "アニリスト" },
      ]}></WebsiteList>
      <WebsiteList name="プログラミングウェブサイト" items={[
        { url: "https://github.com", name: "ギットハブ" },
        { url: "https://gitlab.com", name: "ギットラブ" },
        { url: "https://chat.openai.com/", name: "チャットGPT" },
      ]}></WebsiteList>
      {/* <h2 className="text-3xl">詩經之名言</h2> */}
      {/* <GetPoetry /> */}
      {/* <iframe className="flex-grow" src="https://www.youtube.com/embed/videoseries?si=4oNgAIWD69ZV_NhB&amp;list=PLXII8OAX5tjG02VeEx6z0XHU-aj1V0ppF" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe> */}
      <p className="text-2xl">
        生之為人，須知生命乃是一段旅程，其路艱難曲折，須以坦然心態，包容萬物。明智者知曉在生命之舟上，須順應自然，不可強求，不貪功名利祿，須以平和之心，淡泊名利，才能領悟生活的真諦。
        《老子》
      </p>
    </main >
  </>
}
