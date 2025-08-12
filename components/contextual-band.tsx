export function ContextualBand() {
  return (
    <section className="flex flex-col gap-6 justify-center items-center px-0 py-9 w-full bg-slate-700 max-md:max-w-full">
      <div className="flex items-start max-w-full text-2xl font-bold leading-none text-white w-[1140px]">
        <h2 className="text-2xl leading-8 text-white">Canadian Digital Service</h2>
      </div>
      <nav className="flex flex-col justify-center mt-6 max-w-full text-base text-white w-[1140px]" aria-label="Canadian Digital Service navigation">
        <ul className="flex flex-wrap gap-12 items-start w-full">
          <li className="flex-1 shrink text-base leading-6 text-white basis-0">
            <a href="#" className="text-base leading-6 text-white hover:underline">
              Why GC Notify
            </a>
          </li>
          <li className="flex-1 shrink text-base leading-6 text-white basis-0">
            <a href="#" className="text-base leading-6 text-white hover:underline">
              Features
            </a>
          </li>
          <li className="flex-1 shrink text-base leading-6 text-white basis-0">
            <a href="#" className="text-base leading-6 text-white hover:underline">
              Activity on GC Notify
            </a>
          </li>
        </ul>
      </nav>
    </section>
  )
}
