function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[16px] text-white w-full">Filhos</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center px-[24px] py-[16px] relative w-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[16px] text-white w-full">Pais</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center px-[24px] py-[16px] relative w-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[16px] text-white w-full">Avós</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center px-[24px] py-[16px] relative w-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[16px] text-white w-full">Bisavós</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center px-[24px] py-[16px] relative w-full">
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame3 />
      <Frame5 />
      <Frame7 />
    </div>
  );
}

export default function Acoes() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Ações">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center px-[16px] py-[24px] relative size-full">
          <Frame8 />
        </div>
      </div>
    </div>
  );
}