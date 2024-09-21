import useSEO from "@/hooks/useSEO";

const Notfound = () => {
    useSEO('Not Found')

    return (
        <div className="bg-slate-900 text-slate-200 h-screen w-full flex items-center justify-center">
            <h1 className=" text-3xl">
                Not Found
            </h1>
        </div>
    )
}

export default Notfound;