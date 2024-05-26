const Quote = () => {
  return (
    <div className="bg-slate-200 h-screen flex justify-center flex-col p-4">
      <div className="flex flex-col mx-auto justify-center">
        <div className="max-w-lg">
          <div className="text-3xl font-bold">
            "The customer support I received was exceptional. The support went above and beyond to address my concerns."
          </div>
          <div className="max-w-md text-xl font-semibold mt-4">
            Jules Winfield
          </div>
          <div className="max-w-md text-sm font-semibold text-slate-400 mt-1">
            CEO | Acme Corp
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quote
