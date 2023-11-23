
export default function Div(opts: { name: String, children: React.ReactNode }): JSX.Element {
    return (<div className="border-black border-2 h-fit px-2">
        <h2 className="text-2xl font-semibold" > {opts.name}</h2 >
        {opts.children}
    </div >)
}