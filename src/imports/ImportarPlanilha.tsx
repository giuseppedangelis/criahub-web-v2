import svgPaths from "./svg-57x1qk3ejf";

function Frame5() {
  return (
    <div className="h-[44px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[10px] py-0 relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[36px] text-nowrap text-white whitespace-pre">Importar Planilha</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path d={svgPaths.p186c5072} fill="var(--fill-0, #F59E0B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="h-[44px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[44px] items-center pl-0 pr-[10px] py-0 relative w-full">
          <Frame />
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">Instruções para Importação</p>
        </div>
      </div>
    </div>
  );
}

function LabelText() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-gray-400 text-nowrap whitespace-pre">Arquivos Excel (.xlsx) com dados organizados em colunas</p>
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
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
      <TextField />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Formato do Arquivo aceito</p>
      <TextField1 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame6 />
    </div>
  );
}

function LabelText1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <ul className="[white-space-collapse:collapse] block font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-gray-400 text-nowrap">
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">Nome do Animal</span>
        </li>
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">Registro</span>
        </li>
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">Data de Nascimento</span>
        </li>
        <li className="ms-[21px]">
          <span className="leading-[normal]">Sexo</span>
        </li>
      </ul>
    </div>
  );
}

function LabelText2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <ul className="block font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-gray-400 w-[156px]">
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">Pelagem</span>
        </li>
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">Status</span>
        </li>
        <li className="ms-[21px]">
          <span className="leading-[normal]">Categoria</span>
        </li>
      </ul>
    </div>
  );
}

function Content1() {
  return (
    <div className="basis-0 box-border content-stretch flex gap-[64px] grow h-full items-start min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText1 />
      <LabelText2 />
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="state-layer">
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
    <div className="basis-0 content-stretch flex gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer1 />
    </div>
  );
}

function TextField3() {
  return (
    <div className="content-stretch flex flex-col h-[124px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <TextField2 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Colunas Recomendadas</p>
      <TextField3 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame7 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p34795a80} fill="var(--fill-0, #9CA3AF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Content2() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-start px-0 py-[4px] relative shrink-0 w-full" data-name="content">
      <Frame1 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Limitações do Plano Free</p>
    </div>
  );
}

function LabelText3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <ul className="[white-space-collapse:collapse] block font-['Inter:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-gray-400 text-nowrap">
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">{`Máximo 1 importação por mês `}</span>
        </li>
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">{`Limite total de 100 animais `}</span>
        </li>
        <li className="ms-[21px]">
          <span className="leading-[normal]">{`Animais atuais: 6/100 `}</span>
        </li>
      </ul>
    </div>
  );
}

function Content3() {
  return (
    <div className="box-border content-stretch flex gap-[64px] items-start px-0 py-[4px] relative self-stretch shrink-0" data-name="content">
      <LabelText3 />
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="state-layer">
      <Content3 />
    </div>
  );
}

function TextField4() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative rounded-[4px] shrink-0" data-name="text field">
      <StateLayer2 />
    </div>
  );
}

function TextField5() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-[0.88] relative rounded-[8px] shrink-0" data-name="Text field">
      <TextField4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[619px]">
      <Content2 />
      <TextField5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="box-border content-stretch flex gap-[16px] items-start pl-[16px] pr-0 py-[16px] relative rounded-[16px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#616161] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame11 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative rounded-[16px] shrink-0 w-full">
      <Frame8 />
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

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Selecionar Arquivo</p>
      <Frame13 />
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
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Importar</p>
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

export default function ImportarPlanilha() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Importar Planilha">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-center p-[48px] relative size-full">
          <Frame5 />
          <Frame12 />
          <Frame14 />
          <Frame15 />
          <Frame16 />
          <Frame17 />
          <Popup />
        </div>
      </div>
    </div>
  );
}