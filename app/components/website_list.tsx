import { Fragment } from "react";
import Div from "../base_components/div";

interface WebsiteListItem {
    url: string,
    name: string
}

export default function WebsiteList(opts: { name: string, items: WebsiteListItem[] }): JSX.Element {
    let formatted_items: JSX.Element[] = []
    return <Div name={opts.name} key={opts.name}>
        {
            opts.items.map((f, index) =>
                <Fragment key={f.name}>
                    <a key={f.name} href={f.url} className="hover:font-bold text-gray-600">{f.name}</a>
                    {index != opts.items.length - 1 && '・'}
                </Fragment>
            )
        }
    </Div>
}