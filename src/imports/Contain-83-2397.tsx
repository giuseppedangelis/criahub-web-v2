import svgPaths from "./svg-qxp217vl7o";

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <g id="Vector"></g>
        </g>
      </svg>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="breadcrumbs">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Todos</p>
      <Frame />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0)] text-center text-nowrap whitespace-pre">Vitor Fernandes</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[48px] top-[18px] w-[1044px]">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[24px] text-white w-full">Material Reprodutivo</p>
      <Breadcrumbs />
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Cobertura</p>
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
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Óvulos</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[6px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Embriões</p>
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
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Gestações</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="box-border content-stretch flex h-[40px] items-start p-[4px] relative rounded-[8px] shrink-0 w-[1044px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame7() {
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

function Frame8() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame7 />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Pesquisar</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start px-[48px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Cadastrar novo</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[24px] h-[40px] items-start relative shrink-0 w-[1044px]" data-name="Frame">
      <Frame8 />
      <Frame13 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.pb50d400} fill="var(--fill-0, #6B6B6B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame11 />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">{`Data `}</p>
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Estágio</p>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Status</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[76px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 36">
        <g id="Frame 5">
          <path d={svgPaths.p197a3a00} fill="var(--fill-0, white)" id="Vector" />
          <g id="Frame">
            <path d={svgPaths.p3570fc00} fill="var(--fill-0, #3A3A3A)" id="Vector_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[24px] h-[40px] items-center relative shrink-0 w-[1044px]" data-name="Frame">
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame5 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[48px] top-[90px]">
      <Frame6 />
      <Frame10 />
      <Frame17 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[60px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[60px]">Linha genética</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[80px]">Relâmpago x Estrela</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[126px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[126px]">Método de obtenção</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[146px]">ICSI</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[192px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[192px]">Meio de cultura</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[212px]">SOF modificado</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[258px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[258px]">Destino/status</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[278px]">Transferido para receptora Égua “Bella”</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[16px] top-[324px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-[16px] not-italic text-[10px] text-nowrap text-white top-[324px] whitespace-pre">Notas</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[60px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[60px]">Data</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[80px]">18/03/2025</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute bg-emerald-500 box-border content-stretch flex gap-[10px] h-[20px] items-center justify-center left-[16px] px-[10px] py-0 rounded-[6px] top-[349px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[30px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Taxa de implantação esperada 70%</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[126px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[126px]">Estágio</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[146px]">Blastocisto, qualidade A</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[192px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[192px]">Receptora</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[212px]">Bella – BRM-2018-099</p>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[390px] left-[48px] overflow-clip rounded-[24px] top-[268px] w-[335px]" data-name="card">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[16px] not-italic text-[20px] text-nowrap text-white top-[16px] whitespace-pre">ID: EMBR-2025-001</p>
      <Group />
      <Group2 />
      <Group4 />
      <Group6 />
      <Group8 />
      <Group1 />
      <Frame19 />
      <Group3 />
      <Group5 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[60px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[60px]">Linha genética</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[80px]">Relâmpago x Estrela</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[126px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[126px]">Método de obtenção</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[146px]">ICSI</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[192px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[192px]">Meio de cultura</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[212px]">SOF modificado</p>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[258px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[258px]">Destino/status</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[278px]">Congelado – Botucatu Cryobank</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[16px] top-[324px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-[16px] not-italic text-[10px] text-nowrap text-white top-[324px] whitespace-pre">Notas</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[60px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[60px]">Data</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[80px]">18/03/2025</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute bg-[#bc6e36] box-border content-stretch flex gap-[10px] h-[20px] items-center justify-center left-[16px] px-[10px] py-0 rounded-[6px] top-[349px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[30px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Aguardando receptora compatível</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[126px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[126px]">Estágio</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[146px]">Blastocisto, qualidade A</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[192px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[192px]">Receptora</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[212px]">Bella – BRM-2018-099</p>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[390px] left-[403px] overflow-clip rounded-[24px] top-[268px] w-[335px]" data-name="card">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[16px] not-italic text-[20px] text-nowrap text-white top-[16px] whitespace-pre">ID: EMBR-2025-002</p>
      <Group7 />
      <Group9 />
      <Group10 />
      <Group11 />
      <Group12 />
      <Group13 />
      <Frame20 />
      <Group14 />
      <Group15 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[60px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[60px]">Linha genética</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[80px]">Relâmpago x Estrela</p>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[126px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[126px]">Método de obtenção</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[146px]">ICSI</p>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[192px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[192px]">Meio de cultura</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[212px]">SOF modificado</p>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents leading-[30px] left-[16px] not-italic text-nowrap text-white top-[258px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[16px] text-[10px] top-[258px]">Destino/status</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[16px] text-[12px] top-[278px]">Descartado por má qualidade</p>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents left-[16px] top-[324px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-[16px] not-italic text-[10px] text-nowrap text-white top-[324px] whitespace-pre">Notas</p>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[60px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[60px]">Data</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[80px]">18/03/2025</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute bg-red-500 box-border content-stretch flex gap-[10px] h-[20px] items-center justify-center left-[16px] px-[10px] py-0 rounded-[6px] top-[349px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[30px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Inviável para implantação</p>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[126px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[126px]">Estágio</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[146px]">Blastocisto, qualidade A</p>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents leading-[30px] left-[175px] not-italic text-nowrap text-white top-[192px] whitespace-pre">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[175px] text-[10px] top-[192px]">Receptora</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[175px] text-[12px] top-[212px]">Bella – BRM-2018-099</p>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[390px] left-[758px] overflow-clip rounded-[24px] top-[268px] w-[335px]" data-name="card">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[16px] not-italic text-[20px] text-nowrap text-white top-[16px] whitespace-pre">ID: EMBR-2025-003</p>
      <Group16 />
      <Group17 />
      <Group18 />
      <Group19 />
      <Group20 />
      <Group21 />
      <Frame21 />
      <Group22 />
      <Group23 />
    </div>
  );
}

export default function Contain() {
  return (
    <div className="relative size-full" data-name="Contain">
      <Frame18 />
      <Frame12 />
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}