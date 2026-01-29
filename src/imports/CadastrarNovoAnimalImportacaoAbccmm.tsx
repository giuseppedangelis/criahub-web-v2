import svgPaths from "./svg-jl37d1jbsn";

function Frame10() {
  return (
    <div className="h-[44px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[10px] py-0 relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[36px] text-nowrap text-white whitespace-pre">Cadastrar novo animal</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[6px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Importação ABCCMM</p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Cadastro Manual</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex h-[40px] items-start p-[4px] relative w-full">
          <Frame />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p349df780} fill="var(--fill-0, #0851BE)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function LabelText() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#0658d4] text-[14px]" data-name="label-text">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-nowrap whitespace-pre">Instruções para Importação</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 w-[min-content]">Formato de Arquivo Aceito: Arquivos Excel (.xlsx).</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 w-[min-content]">Atenção: As colunas devem estar organizadas para o processamento correto dos dados.</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame3 />
      <LabelText />
    </div>
  );
}

function Content() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-center px-0 py-[4px] relative shrink-0 w-full" data-name="content">
      <Frame18 />
    </div>
  );
}

function TextField() {
  return (
    <div className="bg-[#ddeaff] relative rounded-[8px] shrink-0 w-full" data-name="text field">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[16px] py-[8px] relative w-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

function TextField1() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <TextField1 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame11 />
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
        <li className="mb-[8px] ms-[21px]">
          <span className="leading-[normal]">Sexo (Macho/Fêmea)</span>
        </li>
        <li className="ms-[21px]">
          <span className="leading-[normal]">Status</span>
        </li>
      </ul>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Colunas Recomendadas</p>
      <LabelText1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <Frame19 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <Frame5 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame6 />
    </div>
  );
}

function Frame8() {
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

function Frame14() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Selecionar Arquivo</p>
      <Frame14 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center pl-0 pr-[10px] py-0 relative w-full">
          <Frame17 />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Frame15 />
      <Frame7 />
      <Frame16 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col items-center px-[16px] py-[8px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Cadastrar novo animal</p>
        </div>
      </div>
    </div>
  );
}

export default function CadastrarNovoAnimalImportacaoAbccmm() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Cadastrar novo animal (Importação ABCCMM)">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center p-[48px] relative size-full">
          <Frame10 />
          <Frame12 />
          <Frame9 />
        </div>
      </div>
    </div>
  );
}