"use client"
import { fetchWeatherApi } from "openmeteo";
import useSWR from "swr";
import Div from "../base_components/div";
import { number2kanji } from "@geolonia/japanese-numeral";

const OPENMETEO_URL: string = "https://api.open-meteo.com/v1/forecast"
const OPENMETEO_PARAM: {} = {
    "latitude": 42.1103,
    "longitude": -88.0342,
    "current": ["weather_code", "temperature_2m", "wind_speed_10m"],
    "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_probability_max"],
    "timezone": "America/Chicago",
    "forecast_days": 1
};

const fetcher = (opts: { url: string, param: {} }) => fetchWeatherApi(opts.url, opts.param)

function getWMOCodeText(code: number): string {
    switch (code) {
        case (0): return "晴"
        case (1): return "主に晴"
        case (2): return "所により曇"
        case (3): return "曇り空"
        case (45): return "霧"
        case (46): return "凍霧"
        case (51): return "弱い霧雨"
        case (53): return "中程度の霧雨"
        case (55): return "濃い霧雨"
        case (56): return "弱い凍結霧雨"
        case (57): return "濃い凍結霧雨"
        case (61): return "弱い雨"
        case (63): return "中程度の雨"
        case (65): return "激しい雨"
        case (66): return "弱い着氷性の雨"
        case (67): return "激しい着氷性の雨"
        case (71): return "弱い降雪"
        case (73): return "中程度の降雪"
        case (75): return "激しい降雪"
        case (77): return "霙"
        case (80): return "弱い驟雨"
        case (81): return "中程度の驟雨"
        case (82): return "激しい驟雨"
        case (85): return "弱い驟雪"
        case (86): return "激しい驟雪"
        case (95): return "雷雨"
        case (96):
        case (99): return "激しい雹を伴う雷雨"

        default:
            break;
    }
    return "未知"
}

export default function WeatherDiv() {
    const { data, error, isLoading } = useSWR({ url: OPENMETEO_URL, param: OPENMETEO_PARAM }, fetcher, {})
    if (isLoading) { return <Div name={"天氣"}>讀み込み中...</Div> }
    if (error) {
        return <>Error</>
    }
    const weather = data![0]
    const current_weather = weather.current()!
    const daily_weather = weather.daily()!
    const current_weather_code = current_weather.variables(0)!.value()
    const current_weather_temp = current_weather.variables(1)!.value()
    const daily_weather_max_temp = daily_weather.variables(0)!.valuesArray()![0]
    const daily_weather_min_temp = daily_weather.variables(1)!.valuesArray()![0]
    const daily_weather_precip = daily_weather.variables(2)!.valuesArray()![0]
    const convert_min_temp_to_string = (temp: number): string => {
        if (temp < 0) {
            return "零下" + number2kanji(Math.round(temp + 1))
        } else {
            return number2kanji(Math.round(temp))
        }
    }
    return (<Div name={"天氣"}>
        <p>
            今日の天氣は<span className="font-semibold text-xl">「{getWMOCodeText(current_weather_code)}」</span>
            と氣溫は<span className="font-semibold text-xl">{number2kanji(Math.round(current_weather_temp))}度</span>です。
            <span className="font-semibold">最高氣溫</span>は<span className="font-semibold text-l">{number2kanji(Math.round(daily_weather_max_temp))}度</span>
            と
            <span className="font-semibold">最低氣溫</span>は<span className="font-semibold text-l">{convert_min_temp_to_string(daily_weather_min_temp)}度</span>
            です。
            そして、<span className="font-semibold">降水確率</span>は<span className="font-semibold text-l">{number2kanji(daily_weather_precip)}割</span>
            です。
        </p>
    </Div>)
}