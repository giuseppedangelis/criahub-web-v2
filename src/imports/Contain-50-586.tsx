import svgPaths from "./svg-u6umou5zxl";

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[24px] text-white w-full">Relatórios Financeiros</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-white w-full">Relatório de Custo-Benefício por Animal</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 content-stretch flex font-['Inter:Semi_Bold',sans-serif] font-semibold grow items-center leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Animal</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Receita Total</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Custo Total</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Lucro/Prejuízo</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[36px] items-center px-[16px] py-0 relative w-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 content-stretch flex font-['Inter:Regular',sans-serif] font-normal grow items-center leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Relâmpago</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">R$ 1.500,00</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">R$ 800,00</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">R$ 700,00</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[36px] items-center px-[16px] py-[8px] relative w-full">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Frame">
      {[...Array(6).keys()].map((_, i) => (
        <Frame key={i} />
      ))}
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          <Frame3 />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Contain() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Contain">
      <Frame13 />
      <Frame2 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-white w-full">Relatório por Categoria</p>
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] h-[148px] ml-[40.58px] mt-[7px] relative w-[1002.42px]">
      <div className="absolute bottom-0 left-0 right-[-0.1%] top-[-0.68%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1004 149">
          <g id="Group 12">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x2="1002.42" y1="0.5" y2="0.5" />
            <line id="Line 2" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x2="1002.42" y1="36.5" y2="36.5" />
            <line id="Line 3" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x2="1002.42" y1="72.5" y2="72.5" />
            <line id="Line 4" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x2="1002.42" y1="108.5" y2="108.5" />
            <line id="Line 5" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x2="1002.42" y1="144.5" y2="144.5" />
            <line id="Line 6" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="8.61681" x2="8.61683" y1="1" y2="145" />
            <line id="Line 7" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="93.8424" x2="93.8424" y1="1" y2="149" />
            <line id="Line 8" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="258.206" x2="258.206" y1="1" y2="149" />
            <line id="Line 9" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="422.57" x2="422.57" y1="1" y2="149" />
            <line id="Line 10" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="586.934" x2="586.934" y1="1" y2="149" />
            <line id="Line 11" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="751.298" x2="751.298" y1="1" y2="149" />
            <line id="Line 12" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="915.662" x2="915.662" y1="1" y2="149" />
            <line id="Line 13" stroke="var(--stroke-0, #444444)" strokeDasharray="2 2" x1="1002.92" x2="1002.92" y1="1" y2="145" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[38px] place-items-start relative">
      <Group />
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[36.53px] mt-[136px] not-italic relative text-[#6b6b6b] text-[14px] text-right translate-x-[-100%] w-[18.263px]">0</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[133.29px] mt-[154px] not-italic relative text-[#6b6b6b] text-[14px] text-center text-nowrap translate-x-[-50%] whitespace-pre">Alimentação</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[305.91px] mt-[154px] not-italic relative text-[#6b6b6b] text-[14px] text-center text-nowrap translate-x-[-50%] whitespace-pre">Veterinário</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[476.76px] mt-[154px] not-italic relative text-[#6b6b6b] text-[14px] text-center text-nowrap translate-x-[-50%] whitespace-pre">Medicamentos</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[649.49px] mt-[154px] not-italic relative text-[#6b6b6b] text-[14px] text-center text-nowrap translate-x-[-50%] whitespace-pre">Folha de Pagamento</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[822.62px] mt-[154px] not-italic relative text-[#6b6b6b] text-[14px] text-center text-nowrap translate-x-[-50%] whitespace-pre">Serviços</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[997.49px] mt-[154px] not-italic relative text-[#6b6b6b] text-[14px] text-center text-nowrap translate-x-[-50%] whitespace-pre">Manutenção</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[36.53px] mt-[100px] not-italic relative text-[#6b6b6b] text-[14px] text-right translate-x-[-100%] w-[18.263px]">5</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[36.52px] mt-[66px] not-italic relative text-[#6b6b6b] text-[14px] text-right translate-x-[-100%] w-[32.467px]">10</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[36.52px] mt-[32px] not-italic relative text-[#6b6b6b] text-[14px] text-right translate-x-[-100%] w-[32.467px]">15</p>
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[36.53px] mt-0 not-italic relative text-[#6b6b6b] text-[14px] text-right translate-x-[-100%] w-[36.525px]">20</p>
      <div className="[grid-area:1_/_1] bg-red-500 h-[87px] ml-[99.46px] mt-[63px] rounded-[4px] w-[63.994px]" />
      <div className="[grid-area:1_/_1] bg-red-500 h-[105px] ml-[273.29px] mt-[45px] rounded-[4px] w-[63.038px]" />
      <div className="[grid-area:1_/_1] bg-red-500 h-[94px] ml-[446.17px] mt-[56px] rounded-[4px] w-[63.994px]" />
      <div className="[grid-area:1_/_1] bg-red-500 h-[72px] ml-[620px] mt-[78px] rounded-[4px] w-[62.083px]" />
      <div className="[grid-area:1_/_1] bg-red-500 h-[101px] ml-[791.92px] mt-[49px] rounded-[4px] w-[63.994px]" />
      <div className="[grid-area:1_/_1] bg-red-500 h-[114px] ml-[965.76px] mt-[36px] rounded-[4px] w-[63.038px]" />
    </div>
  );
}

function Group2() {
  return (
    <div className="basis-0 grid-cols-[max-content] grid-rows-[max-content] grow inline-grid leading-[0] min-h-px min-w-px place-items-start relative shrink-0">
      <Group1 />
      <p className="[grid-area:1_/_1] font-['Inter:Bold',sans-serif] font-bold leading-[20px] ml-0 mt-0 not-italic relative text-[16px] text-white w-[411.165px]">Total de Gastos por Categoria</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center p-[24px] relative w-full">
          <Group2 />
        </div>
      </div>
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
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[1091px]" data-name="Frame">
      <Frame7 />
    </div>
  );
}

function Contain1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[24px] items-start pb-[48px] pt-0 px-0 relative shrink-0" data-name="Contain">
      <Frame14 />
      <Frame8 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-white w-full">Relatório de Fluxo de Caixa</p>
    </div>
  );
}

function Depth7Frame() {
  return (
    <div className="h-[255px] relative shrink-0 w-full" data-name="Depth 7, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[255px] overflow-clip relative rounded-[inherit] w-full">
        <div className="absolute h-[113px] left-0 top-[-0.67px] w-[1043px]" data-name="Vector - 1">
          <div className="absolute inset-[-0.02%_0.63%_-96.78%_0.63%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1030 223">
              <path d={svgPaths.p29d3e300} id="Vector - 1" stroke="var(--stroke-0, #2472BC)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="absolute h-[148px] left-0 top-0 w-[928px]" data-name="Vector - 2">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <g id="Vector - 2"></g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Depth8Frame4() {
  return (
    <div className="relative shrink-0" data-name="Depth 8, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9eb8a8] text-[13px] text-nowrap w-full whitespace-pre">Jan</p>
      </div>
    </div>
  );
}

function Depth8Frame5() {
  return (
    <div className="relative shrink-0" data-name="Depth 8, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9eb8a8] text-[13px] text-nowrap w-full whitespace-pre">Fev</p>
      </div>
    </div>
  );
}

function Depth8Frame() {
  return (
    <div className="relative shrink-0" data-name="Depth 8, Frame 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9eb8a8] text-[13px] text-nowrap w-full whitespace-pre">Mar</p>
      </div>
    </div>
  );
}

function Depth8Frame1() {
  return (
    <div className="relative shrink-0" data-name="Depth 8, Frame 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9eb8a8] text-[13px] text-nowrap w-full whitespace-pre">Abr</p>
      </div>
    </div>
  );
}

function Depth8Frame2() {
  return (
    <div className="relative shrink-0" data-name="Depth 8, Frame 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9eb8a8] text-[13px] text-nowrap w-full whitespace-pre">Mai</p>
      </div>
    </div>
  );
}

function Depth8Frame3() {
  return (
    <div className="relative shrink-0" data-name="Depth 8, Frame 5">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9eb8a8] text-[13px] text-nowrap w-full whitespace-pre">Jun</p>
      </div>
    </div>
  );
}

function Depth7Frame1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 7, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-between relative w-full">
        <Depth8Frame4 />
        <Depth8Frame5 />
        <Depth8Frame />
        <Depth8Frame1 />
        <Depth8Frame2 />
        <Depth8Frame3 />
      </div>
    </div>
  );
}

function Depth6Frame() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col items-start min-h-[180px] ml-[7px] mt-[55.67px] px-0 py-[16px] relative w-[1036px]" data-name="Depth 6, Frame 1">
      <Depth7Frame />
      <Depth7Frame1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="basis-0 grid-cols-[max-content] grid-rows-[max-content] grow inline-grid leading-[0] min-h-px min-w-px place-items-start relative shrink-0">
      <Depth6Frame />
      <p className="[grid-area:1_/_1] font-['Inter:Bold',sans-serif] font-bold h-[29.037px] leading-[20px] ml-0 mt-0 not-italic relative text-[16px] text-white w-[459.036px]">Evolução de Receitas e Despesas</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center p-[24px] relative w-full">
          <Group3 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[406px] items-start relative shrink-0 w-[1091px]" data-name="Frame">
      <Frame10 />
    </div>
  );
}

function Contain2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[24px] items-start pb-[24px] pt-0 px-0 relative shrink-0" data-name="Contain">
      <Frame15 />
      <Frame11 />
    </div>
  );
}

function Contain3() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[24px] items-start px-0 py-[48px] relative shrink-0" data-name="Contain">
      <Frame12 />
      <Contain />
      <Contain1 />
      <Contain2 />
    </div>
  );
}

export default function Contain4() {
  return (
    <div className="relative size-full" data-name="Contain">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start pb-[48px] pt-0 px-[48px] relative size-full">
          <Contain3 />
        </div>
      </div>
    </div>
  );
}