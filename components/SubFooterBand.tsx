import Link from "next/link"

export function SubFooterBand() {
  return (
    <section className="flex overflow-hidden flex-wrap gap-10 justify-between items-center self-center px-36 pt-6 pb-8 w-full text-base bg-gray-100 max-w-[1440px] text-slate-700 max-md:px-5 max-md:max-w-full">
      <nav className="flex flex-wrap gap-3 items-center self-stretch my-auto min-w-60 max-md:max-w-full">
        <ul className="flex flex-wrap gap-3 items-center">
          <li className="flex flex-col justify-center self-stretch my-auto w-[95px]">
            <a href="#" className="text-base leading-6 text-slate-700 hover:underline">
              Social media
            </a>
          </li>
          <li className="flex shrink-0 self-stretch my-auto w-1 h-1 bg-zinc-800 rounded-[100px]" aria-hidden="true" />
          <li className="flex flex-col justify-center self-stretch my-auto w-[147px]">
            <a href="#" className="text-base leading-6 text-slate-700 hover:underline">
              Mobile applications
            </a>
          </li>
          <li className="flex shrink-0 self-stretch my-auto w-1 h-1 bg-zinc-800 rounded-[100px]" aria-hidden="true" />
          <li className="flex flex-col justify-center self-stretch my-auto w-32">
            <a href="#" className="text-base leading-6 text-slate-700 hover:underline">
              About Canada.ca
            </a>
          </li>
          <li className="flex shrink-0 self-stretch my-auto w-1 h-1 bg-zinc-800 rounded-[100px]" aria-hidden="true" />
          <li className="flex flex-col justify-center self-stretch my-auto w-[162px]">
            <a href="#" className="text-base leading-6 text-slate-700 hover:underline">
              Terms and conditions
            </a>
          </li>
          <li className="flex shrink-0 self-stretch my-auto w-1 h-1 bg-zinc-800 rounded-[100px]" aria-hidden="true" />
          <li className="flex flex-col justify-center self-stretch my-auto whitespace-nowrap w-[54px]">
            <a href="#" className="text-base leading-6 text-slate-700 hover:underline">
              Privacy
            </a>
          </li>
        </ul>
      </nav>
      <Link href="/" passHref>
        <img
          src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg"
          alt="Government of Canada logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[4.2] w-[164px] cursor-pointer"
        />
      </Link>
    </section>
  )
}
