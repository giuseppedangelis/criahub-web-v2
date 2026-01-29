function Frame8() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center not-italic px-[10px] py-0 relative text-nowrap w-full whitespace-pre">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[36px] text-white">Gerenciar Planos de Assinatura</p>
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] relative shrink-0 text-[16px] text-gray-500">Ajuste valores e limites de acesso por plano. Esta ação afeta o faturamento de todos os clientes</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Plano Bronze</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame />
    </div>
  );
}

function LabelText() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Ex: 299,90</p>
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

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Valor Mensal (R$)</p>
      <TextField1 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame15 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame9 />
    </div>
  );
}

function LabelText1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Ex: 3</p>
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

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Máximo de Usuários</p>
      <TextField3 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame16 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame19 />
      <Frame20 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center p-[24px] relative w-full">
          <Frame28 />
          <Frame31 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Plano Prata</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame2 />
    </div>
  );
}

function LabelText2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Ex: 499,90</p>
    </div>
  );
}

function Content2() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText2 />
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

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Valor Mensal (R$)</p>
      <TextField5 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame17 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame11 />
    </div>
  );
}

function LabelText3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Ex: 10</p>
    </div>
  );
}

function Content3() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText3 />
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
    <div className="content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField6 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Máximo de Usuários</p>
      <TextField7 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame22 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame12 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame21 />
      <Frame23 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center p-[24px] relative w-full">
          <Frame29 />
          <Frame32 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Plano Ouro (Ilimitado)</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame4 />
    </div>
  );
}

function LabelText4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Ex: 999,90</p>
    </div>
  );
}

function Content4() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText4 />
    </div>
  );
}

function StateLayer4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="state-layer">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative size-full">
          <Content4 />
        </div>
      </div>
    </div>
  );
}

function TextField8() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer4 />
    </div>
  );
}

function TextField9() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField8 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Valor Mensal (R$)</p>
      <TextField9 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame24 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame13 />
    </div>
  );
}

function LabelText5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Ilimitado</p>
    </div>
  );
}

function Content5() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px px-0 py-[4px] relative shrink-0" data-name="content">
      <LabelText5 />
    </div>
  );
}

function StateLayer5() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="state-layer">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative size-full">
          <Content5 />
        </div>
      </div>
    </div>
  );
}

function TextField10() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer5 />
    </div>
  );
}

function TextField11() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField10 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Máximo de Usuários</p>
      <TextField11 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame26 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame14 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame25 />
      <Frame27 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0)]" />
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center p-[24px] relative w-full">
          <Frame30 />
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start justify-center pl-0 pr-[10px] py-0 relative w-full">
          <Frame1 />
          <Frame3 />
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
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

function Frame7() {
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
      <Frame6 />
      <Frame7 />
    </div>
  );
}

export default function GerenciarPlanosDeAssinatura() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Gerenciar Planos de Assinatura">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center p-[48px] relative size-full">
          <Frame8 />
          <Frame18 />
          <Popup />
        </div>
      </div>
    </div>
  );
}