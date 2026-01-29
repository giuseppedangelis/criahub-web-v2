import svgPaths from "./svg-azf3ly14mt";

function Frame5() {
  return (
    <div className="h-[44px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[10px] py-0 relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[36px] text-nowrap text-white whitespace-pre">Adicionar Documento</p>
        </div>
      </div>
    </div>
  );
}

function LabelText() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Nome do documento</p>
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText />
    </div>
  );
}

function StateLayer() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="state-layer">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative size-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

function TextField() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer />
    </div>
  );
}

function TextField1() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Nome do Documento</p>
      <TextField1 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame() {
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

function LabelText1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="label-text">
      <Frame />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Escolha a data</p>
    </div>
  );
}

function Frame1() {
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
    <div className="bg-[#3a3a3a] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="dropdown">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[16px] py-0 relative w-full">
          <LabelText1 />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Data</p>
      <Dropdown />
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame7 />
      <Frame6 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center pl-0 pr-[10px] py-0 relative w-full">
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[8px] grow items-center justify-center min-h-px min-w-px px-0 py-[24px] relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#616161] border-dashed inset-0 pointer-events-none rounded-[8px]" />
      <div className="h-[48px] relative shrink-0 w-[37px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 48">
          <path d={svgPaths.pa31bc80} fill="var(--fill-0, #616161)" id="Vector" />
        </svg>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Arraste e solte o arquivo aqui</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap whitespace-pre">ou clique para selecionar o arquivo</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame2 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Selecionar Arquivo</p>
      <Frame13 />
    </div>
  );
}

function LabelText2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Adicione observações sobre o evento...</p>
    </div>
  );
}

function Content1() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText2 />
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="state-layer">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative size-full">
          <Content1 />
        </div>
      </div>
    </div>
  );
}

function TextField2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer1 />
    </div>
  );
}

function TextField3() {
  return (
    <div className="content-stretch flex flex-col h-[124px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField2 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Observações</p>
      <TextField3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame14 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Frame3() {
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

function Frame4() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Salvar</p>
        </div>
      </div>
    </div>
  );
}

function Popup() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-full" data-name="Popup">
      <Frame3 />
      <Frame4 />
    </div>
  );
}

export default function AdicionarDocumento() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Adicionar Documento">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center p-[48px] relative size-full">
          <Frame5 />
          <Frame12 />
          <Frame16 />
          <Frame15 />
          <Popup />
        </div>
      </div>
    </div>
  );
}