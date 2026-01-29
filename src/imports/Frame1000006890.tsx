import svgPaths from "./svg-rc4u08c07z";

function Frame() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[6px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Coberturas</p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Óvulos</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Embriões</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Gestações</p>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Documentos</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="box-border content-stretch flex h-[40px] items-start p-[4px] relative rounded-[8px] shrink-0 w-[1044px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Frame">
          <path d={svgPaths.p21a38600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="dropdown">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[16px] py-0 relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Animal</p>
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function TextField() {
  return (
    <div className="bg-[#3a3a3a] content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <Dropdown />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <TextField />
    </div>
  );
}

function Frame47() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame49 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Frame">
          <path d={svgPaths.p21a38600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="dropdown">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[16px] py-0 relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Status</p>
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

function TextField1() {
  return (
    <div className="bg-[#3a3a3a] content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <Dropdown1 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <TextField1 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame50 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.pb50d400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function LabelText() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="label-text">
      <Frame8 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Escolha o período</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Frame">
          <path d={svgPaths.p21a38600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="basis-0 bg-[#3a3a3a] grow h-[40px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="dropdown">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[16px] py-0 relative w-full">
          <LabelText />
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[24px] h-[40px] items-center relative shrink-0 w-full" data-name="Frame">
      <Frame47 />
      <Frame48 />
      <Dropdown2 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[1044px]" data-name="Frame">
      <Frame11 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <Frame12 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="bg-emerald-500 box-border content-stretch flex gap-[10px] h-[20px] items-center justify-center px-[10px] py-0 relative rounded-[6px] shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[30px] not-italic relative shrink-0 text-[12px] text-nowrap text-right text-white whitespace-pre">Excelente</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[3.5px] items-start justify-center pl-[8px] pr-0 py-0 relative w-full">
          <Frame51 />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Quantidade:</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Data:</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Status:</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Disponíveis:</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center pl-[8px] pr-0 py-0 relative w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Estrela (Doadora)</p>
          <Frame15 />
          <Frame16 />
          <Frame17 />
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p3b294c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-end px-[32px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame20 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Ver Detalhes</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[11.5px] items-center justify-center pb-[24px] pl-[24.5px] pr-[26px] pt-[25px] relative w-full">
          <Frame14 />
          <Frame19 />
          <Frame21 />
        </div>
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="bg-[#2472bc] box-border content-stretch flex gap-[10px] h-[20px] items-center justify-center px-[10px] py-0 relative rounded-[6px] shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[30px] not-italic relative shrink-0 text-[12px] text-nowrap text-right text-white whitespace-pre">Boa</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[3.5px] items-start justify-center pl-[8px] pr-0 py-0 relative w-full">
          <Frame52 />
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Quantidade:</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Data:</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Status:</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Disponíveis:</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center pl-[8px] pr-0 py-0 relative w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Íris (Doadora)</p>
          <Frame24 />
          <Frame25 />
          <Frame26 />
          <Frame27 />
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p3b294c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame30() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-end px-[32px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame29 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Ver Detalhes</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[11.5px] items-center justify-center pb-[24px] pl-[24.5px] pr-[26px] pt-[25px] relative w-full">
          <Frame23 />
          <Frame28 />
          <Frame30 />
        </div>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="bg-amber-500 box-border content-stretch flex gap-[10px] h-[20px] items-center justify-center px-[10px] py-0 relative rounded-[6px] shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[30px] not-italic relative shrink-0 text-[12px] text-nowrap text-right text-white whitespace-pre">Regular</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[3.5px] items-start justify-center pl-[8px] pr-0 py-0 relative w-full">
          <Frame53 />
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Quantidade:</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Data:</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Status:</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[3.5px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-gray-500 text-nowrap whitespace-pre">Disponíveis:</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center pl-[8px] pr-0 py-0 relative w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Lua (Doadora)</p>
          <Frame33 />
          <Frame34 />
          <Frame35 />
          <Frame36 />
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p3b294c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame39() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-end px-[32px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame38 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Ver Detalhes</p>
    </div>
  );
}

function Frame40() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[11.5px] items-center justify-center pb-[24px] pl-[24.5px] pr-[26px] pt-[25px] relative w-full">
          <Frame32 />
          <Frame37 />
          <Frame39 />
        </div>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[23.667px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame22 />
      <Frame31 />
      <Frame40 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame41 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-[24px] pt-[16px] px-[16px] relative w-full">
          <Frame42 />
        </div>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame43 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <Frame44 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame45 />
    </div>
  );
}

export default function Frame54() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
      <Frame5 />
      <Frame13 />
      <Frame46 />
    </div>
  );
}