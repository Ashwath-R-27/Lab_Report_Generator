import Link from "next/link";


interface CardProps {
    head: string;
    para: string;
    link: string;
}

export default function Card({ head, para, link }: CardProps) {
    return (
        <Link
            href={link}
            className="group relative block hover:shadow-[0px_0px_33px_0px_rgba(130,_131,_238,_0.2)] overflow-hidden bg-black/50 rounded-[20px] ring-1 ring-gray-200 ring-inset cursor-pointer transform-gpu transition-transform duration-300 hover:-translate-y-2"
        >
            {/* The Ripple */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[200%] aspect-square rounded-full bg-rose-600/90 opacity-0 scale-0
                                 transition-all duration-600 ease-out 
                                 group-hover:scale-100 group-hover:opacity-100 pointer-events-none" />

            {/* Card Content */}
            <div className="relative z-20 p-[25px]">
                <h3 className="py-2 font-bold text-[20px] text-white">{head}</h3>
                <p className="text-sm text-gray-300">{para}</p>
            </div>
        </Link>
    );
}