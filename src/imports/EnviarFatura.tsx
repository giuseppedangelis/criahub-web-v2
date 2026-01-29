function Frame6() {
  return (
    <div className="h-[44px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[10px] py-0 relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[36px] text-nowrap text-white whitespace-pre">Enviar Fatura</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[5px] items-center leading-[28px] not-italic relative shrink-0 text-[16px] w-full" data-name="Frame">
      <p className="relative shrink-0 text-gray-400 text-nowrap whitespace-pre">{`Cliente: `}</p>
      <p className="relative shrink-0 text-right text-white w-[450px]">Haras Aurora</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[5px] items-center leading-[28px] not-italic relative shrink-0 text-[16px] w-full" data-name="Frame">
      <p className="relative shrink-0 text-gray-400 text-nowrap whitespace-pre">{`Plano: `}</p>
      <p className="relative shrink-0 text-right text-white w-[462px]">Premium</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[5px] items-center leading-[28px] not-italic relative shrink-0 text-[16px] w-full" data-name="Frame">
      <p className="relative shrink-0 text-gray-400 text-nowrap whitespace-pre">{`Vencimento: `}</p>
      <p className="relative shrink-0 text-right text-white w-[412px]">25/09/2025</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#1a1a1a] box-border content-stretch flex flex-col gap-[24px] items-start justify-center p-[24px] relative rounded-[16px] shrink-0 w-[563px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#b0b0b0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#b0b0b0] text-[16px] text-nowrap whitespace-pre">Cancelar</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Confirmar Envio</p>
        </div>
      </div>
    </div>
  );
}

function Popup() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-full" data-name="Popup">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

export default function EnviarFatura() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Enviar Fatura">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center p-[48px] relative size-full">
          <Frame6 />
          <Frame7 />
          <Popup />
        </div>
      </div>
    </div>
  );
}