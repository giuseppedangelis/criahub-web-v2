import svgPaths from "./svg-fg5ubzee1v";
import imgCavaloQuartoDeMilhaHollywoodGottaGun1 from "figma:asset/3c39bdf87ffa1adc70c9ef2382d205e3a9d2d436.png";
import imgCavaloQuartoDeMilhaHollywoodGottaGun3 from "figma:asset/1be528bf62186792f587f79f0421b83441f69fbe.png";

function Frame14() {
  return (
    <div className="h-[44px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[10px] py-0 relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[36px] text-nowrap text-white whitespace-pre">Cadastrar Novo Evento</p>
        </div>
      </div>
    </div>
  );
}

function LabelText() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Nome do Evento</p>
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

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Título do Evento</p>
      <TextField1 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame25 />
    </div>
  );
}

function LabelText1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Tipo de Evento</p>
    </div>
  );
}

function Content1() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText1 />
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
    <div className="content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField2 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Tipo de Evento</p>
      <TextField3 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame32 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame17 />
      <Frame15 />
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

function LabelText2() {
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
          <LabelText2 />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Data</p>
      <Dropdown />
    </div>
  );
}

function Frame16() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame34 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p32338af0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function LabelText3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="label-text">
      <Frame2 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Escolha o horário</p>
    </div>
  );
}

function Frame3() {
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
    <div className="bg-[#363636] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="dropdown">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[16px] py-0 relative w-full">
          <LabelText3 />
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Hora</p>
      <Dropdown1 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="basis-0 content-stretch flex gap-[24px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame31 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame16 />
      <Frame37 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center pl-0 pr-[10px] py-0 relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">Informações básicas do evento</p>
          <Frame33 />
          <Frame27 />
        </div>
      </div>
    </div>
  );
}

function LabelText4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Nome do responsável</p>
    </div>
  );
}

function Content2() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText4 />
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="state-layer">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative size-full">
          <Content2 />
        </div>
      </div>
    </div>
  );
}

function TextField4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer2 />
    </div>
  );
}

function TextField5() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField4 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Responsável</p>
      <TextField5 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame35 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame18 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center pl-0 pr-[10px] py-0 relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">Detalhes do Evento</p>
          <Frame29 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p755d400} fill="var(--fill-0, #6B7280)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame4 />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[24px] not-italic relative shrink-0 text-[14px] text-white w-[731px]">Animais Relacionados</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p12e4ca00} fill="var(--fill-0, #6B6B6B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame5 />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Pesquisar</p>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[24px] h-[40px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame6 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[98px]">
      <div className="absolute h-[113px] left-[calc(50%-31.33px)] top-[calc(50%+6.5px)] translate-x-[-50%] translate-y-[-50%] w-[169px]" data-name="cavalo-quarto-de-milha-HOLLYWOOD-GOTTA-GUN 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCavaloQuartoDeMilhaHollywoodGottaGun1} />
      </div>
    </div>
  );
}

function Depth4Frame() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center justify-center not-italic overflow-clip relative rounded-[inherit] text-center text-white">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[20px] w-full">Relâmpago</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] relative shrink-0 text-[14px] w-full">ABCCMM 1234567-89</p>
      </div>
    </div>
  );
}

function Depth3Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Depth 3, Frame 2">
      <Depth4Frame />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[48px] items-center justify-center relative shrink-0">
      <Depth3Frame />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0">
      <Frame21 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center justify-center p-[16px] relative w-full">
          <Frame39 />
          <Frame22 />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[98px]">
      <div className="absolute h-[108px] left-[calc(50%+28px)] top-[calc(50%+5px)] translate-x-[-50%] translate-y-[-50%] w-[160px]" data-name="cavalo-quarto-de-milha-HOLLYWOOD-GOTTA-GUN 3">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCavaloQuartoDeMilhaHollywoodGottaGun3} />
      </div>
    </div>
  );
}

function Depth4Frame1() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center justify-center not-italic overflow-clip relative rounded-[inherit] text-center text-white">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[20px] w-full">{`Estrela `}</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] relative shrink-0 text-[14px] w-full">ABCCMM 1234567-89</p>
      </div>
    </div>
  );
}

function Depth3Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Depth 3, Frame 2">
      <Depth4Frame1 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[48px] items-center justify-center relative shrink-0">
      <Depth3Frame1 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0">
      <Frame23 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center justify-center p-[16px] relative w-full">
          <Frame40 />
          <Frame24 />
        </div>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame8 />
      <Frame9 />
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[4px] shrink-0 size-[16px]" data-name="dropdown">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Dropdown2 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Notificar Sócios/Condôminos sobre esta seleção</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-[354px]">
      <Frame36 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame26 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Frame">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start justify-center pl-[8px] pr-0 py-0 relative w-full">
          <Frame42 />
          <Frame7 />
          <Frame43 />
          <Frame20 />
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center pl-[24px] pr-[16px] py-[24px] relative w-full">
          <Frame10 />
        </div>
      </div>
    </div>
  );
}

function LabelText5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Adicione observações sobre o evento...</p>
    </div>
  );
}

function Content3() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText5 />
    </div>
  );
}

function StateLayer3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="state-layer">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative size-full">
          <Content3 />
        </div>
      </div>
    </div>
  );
}

function TextField6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer3 />
    </div>
  );
}

function TextField7() {
  return (
    <div className="content-stretch flex flex-col h-[124px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField6 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Observações</p>
      <TextField7 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame41 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame19 />
    </div>
  );
}

function Frame12() {
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

function Frame13() {
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
      <Frame12 />
      <Frame13 />
    </div>
  );
}

export default function CadastrarNovoEvento() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Cadastrar novo evento">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center p-[48px] relative size-full">
          <Frame14 />
          <Frame28 />
          <Frame30 />
          <Frame11 />
          <Frame38 />
          <Popup />
        </div>
      </div>
    </div>
  );
}