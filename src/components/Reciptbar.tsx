
const Reciptbar = () => {
  return (
    <div>
      <div className="flex gap-2 overflow-hidden">
        <div className="flex gap-2">
          {Array.from({ length: 50 }).map((_, index) => (
            <div key={index} className="w-1 h-3 bg-black"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reciptbar;
