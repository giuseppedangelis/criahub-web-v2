import svgPaths from "../imports/svg-kob8mnui34";
import { useTheme } from '../contexts/ThemeContext';

function Sidebar() {
  return (
    <div className="bg-[#1a1a1a] h-[962px] relative shrink-0 w-[256px]">
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[962px] relative w-[256px]">
        {/* Header */}
        <div className="absolute box-border content-stretch flex flex-col gap-[4px] h-[101px] items-start left-0 pb-px pt-[24px] px-[24px] top-0 w-[255px]">
          <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
          <div className="h-[24px] relative shrink-0 w-full">
            <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">CriaHub</p>
          </div>
          <div className="h-[24px] relative shrink-0 w-full">
            <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Administrador</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="absolute content-stretch flex flex-col gap-[8px] h-[272px] items-start left-[16px] top-[117px] w-[223px]">
          {/* Dashboard */}
          <div className="h-[48px] relative shrink-0 w-full">
            <div className="absolute box-border content-stretch flex gap-[12px] h-[48px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d={svgPaths.p1fc96a00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p33089d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p49cfa80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p1cfbf300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </g>
                </svg>
              </div>
              <div className="h-[24px] relative shrink-0">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Assinaturas */}
          <div className="h-[48px] relative shrink-0 w-full">
            <div className="absolute box-border content-stretch flex gap-[12px] h-[48px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d={svgPaths.p16dd5f0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M1.66667 8.33333H18.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </g>
                </svg>
              </div>
              <div className="h-[24px] relative shrink-0">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Assinaturas</p>
              </div>
            </div>
          </div>

          {/* Uso da Plataforma */}
          <div className="h-[48px] relative shrink-0 w-full">
            <div className="absolute box-border content-stretch flex gap-[12px] h-[48px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d={svgPaths.p140c1100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M15 14.1667V7.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M10.8333 14.1667V4.16667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M6.66667 14.1667V11.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </g>
                </svg>
              </div>
              <div className="h-[24px] relative shrink-0">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Uso da Plataforma</p>
              </div>
            </div>
          </div>

          {/* Alertas Críticos */}
          <div className="h-[48px] relative shrink-0 w-full">
            <div className="absolute box-border content-stretch flex gap-[12px] h-[48px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d={svgPaths.p3af16b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M10 7.5V10.8333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M10 14.1667H10.0083" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </g>
                </svg>
              </div>
              <div className="h-[24px] relative shrink-0">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Alertas Críticos</p>
              </div>
            </div>
          </div>

          {/* Configurações - Active State */}
          <div className="h-[48px] relative shrink-0 w-full">
            <div className="absolute bg-white dark:bg-[#333333] box-border content-stretch flex gap-[12px] h-[48px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d={svgPaths.p2483b8c0} stroke="#1A1A1A" className="dark:stroke-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p3b27f100} stroke="#1A1A1A" className="dark:stroke-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </g>
                </svg>
              </div>
              <div className="h-[24px] relative shrink-0">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#1a1a1a] dark:text-white text-[16px] text-nowrap top-[-2px] whitespace-pre">Configurações</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Topbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-[#1a1a1a] dark:bg-[#0d0d0d] h-[101px] relative shrink-0 w-[1161px]">
      <div aria-hidden="true" className="absolute border-[#333333] dark:border-[#1a1a1a] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[101px] items-center justify-between pb-px pt-0 px-[48px] relative w-[1161px]">
        {/* Left side - Welcome message */}
        <div className="h-[52px] relative shrink-0 w-[230.703px]">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[52px] items-start relative w-[230.703px]">
            <div className="h-[24px] relative shrink-0 w-[230.703px]">
              <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Olá, Rick!</p>
            </div>
            <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[230.703px]">
              <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Bem-vindo de volta ao seu haras</p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="h-[36px] relative shrink-0 w-[140px]">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[140px]">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="absolute content-stretch flex items-center justify-center left-0 rounded-[8px] size-[36px] top-0 hover:bg-[#333333] transition-colors cursor-pointer"
            >
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g clipPath="url(#clip0_16_1394)">
                    <path d={svgPaths.p3adb3b00} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M8 1.33333V2.66667" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M8 13.3333V14.6667" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p22049780} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p2ff5aa00} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M1.33333 8H2.66667" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M13.3333 8H14.6667" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p19069f80} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p37cddcc0} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </g>
                  <defs>
                    <clipPath id="clip0_16_1394">
                      <rect fill="white" height="16" width="16" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </button>

            {/* Notifications Button */}
            <div className="absolute left-[52px] rounded-[8px] size-[36px] top-0 hover:bg-[#333333] transition-colors cursor-pointer">
              <div className="absolute left-[10px] size-[16px] top-[10px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g>
                    <path d={svgPaths.p388cb800} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p5baad20} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </g>
                </svg>
              </div>
              <div className="absolute bg-[#fb2c36] left-[20px] rounded-[3.35544e+07px] size-[8px] top-[8px]" />
            </div>

            {/* Avatar */}
            <div className="absolute content-stretch flex items-start left-[104px] overflow-clip rounded-[3.35544e+07px] size-[36px] top-0">
              <div className="basis-0 bg-[#333333] grow h-[36px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[36px] items-center justify-center relative w-full">
                  <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">RH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ 
  icon, 
  title, 
  items 
}: { 
  icon: React.ReactNode; 
  title: string; 
  items: Array<{ label: string; value: string }> 
}) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] relative rounded-[14px] shrink-0 w-full" style={{ minHeight: '257px' }}>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[30px] items-start pl-[25px] pr-px py-[25px] relative w-full">
          {/* Card Title */}
          <div className="h-[20px] relative shrink-0 w-[1032px]">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[1032px]">
              <div className="absolute left-0 size-[20px] top-0">
                {icon}
              </div>
              <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[32px] not-italic text-[16px] text-neutral-950 dark:text-white text-nowrap top-0 whitespace-pre">{title}</p>
            </div>
          </div>

          {/* Settings Items */}
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1032px]">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-full items-start relative w-[1032px]">
              {items.map((item, index) => (
                <div key={index}>
                  <div className="content-stretch flex h-[72px] items-center justify-between relative shrink-0 w-full">
                    <div className="h-[48px] relative shrink-0">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[48px] items-start relative">
                        <div className="h-[24px] relative shrink-0 w-full">
                          <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] dark:text-white text-[16px] text-nowrap top-[-2px] whitespace-pre">{item.label}</p>
                        </div>
                        <div className="h-[24px] relative shrink-0 w-full">
                          <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#6a7282] dark:text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">{item.value}</p>
                        </div>
                      </div>
                    </div>
                    <button className="bg-white dark:bg-transparent h-[36px] relative rounded-[8px] shrink-0 w-[101.984px] hover:bg-[#f5f5f5] dark:hover:bg-[#333333] transition-colors cursor-pointer">
                      <div aria-hidden="true" className="absolute border border-[#101828] dark:border-white border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[17px] py-[9px] relative w-[101.984px]">
                        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#101828] dark:text-white text-[14px] text-nowrap whitespace-pre">Configurar</p>
                      </div>
                    </button>
                  </div>
                  {index < items.length - 1 && (
                    <div className="bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemInfoCard() {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] h-[148px] relative rounded-[14px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[30px] h-[148px] items-start pl-[25px] pr-px py-[25px] relative w-full">
          <div className="h-[16px] relative shrink-0 w-[1032px]">
            <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-950 dark:text-white text-nowrap top-[-2px] whitespace-pre">Informações do Sistema</p>
          </div>
          
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1032px]">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border gap-[24px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-full relative w-[1032px]">
              <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                <div className="h-[24px] relative shrink-0 w-full">
                  <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#4a5565] dark:text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Versão da Plataforma</p>
                </div>
                <div className="h-[24px] relative shrink-0 w-full">
                  <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] dark:text-white text-[16px] text-nowrap top-[-2px] whitespace-pre">v1.0.0</p>
                </div>
              </div>

              <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                <div className="h-[24px] relative shrink-0 w-full">
                  <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#4a5565] dark:text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Última Atualização</p>
                </div>
                <div className="h-[24px] relative shrink-0 w-full">
                  <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] dark:text-white text-[16px] text-nowrap top-[-2px] whitespace-pre">2 de setembro de 2025</p>
                </div>
              </div>

              <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                <div className="h-[24px] relative shrink-0 w-full">
                  <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#4a5565] dark:text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Ambiente</p>
                </div>
                <div className="h-[24px] relative shrink-0 w-full">
                  <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] dark:text-white text-[16px] text-nowrap top-[-2px] whitespace-pre">Produção</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-[#0d0d0d] relative size-full min-h-screen">
        <div className="absolute bg-[#0d0d0d] content-stretch flex h-[962px] items-start left-0 top-0 w-[1417px]">
          <Sidebar />
          
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1161px]">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start overflow-clip pl-0 pr-[15px] py-0 relative rounded-[inherit] w-[1161px]">
              <div className="basis-0 grow h-[962px] min-h-px min-w-px relative shrink-0">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[962px] items-start overflow-clip relative rounded-[inherit] w-full">
                  <Topbar />
                  
                  {/* Main Content */}
                  <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1161px]">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start overflow-clip pl-0 pr-[15px] py-0 relative rounded-[inherit] w-[1161px]">
                      <div className="bg-[#0d0d0d] h-[1521px] relative shrink-0 w-full">
                        <div className="size-full">
                          <div className="box-border content-stretch flex flex-col gap-[32px] h-[1521px] items-start pb-0 pt-[32px] px-[32px] relative w-full">
                            {/* Page Header */}
                            <div className="content-stretch flex flex-col gap-[8px] h-[68px] items-start relative shrink-0 w-full">
                              <div className="h-[36px] relative shrink-0 w-full">
                                <p className="absolute font-['Arial:Regular',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-[-2px] whitespace-pre">Configurações do Sistema</p>
                              </div>
                              <div className="h-[24px] relative shrink-0 w-full">
                                <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Gerencie integrações, permissões e parâmetros da plataforma</p>
                              </div>
                            </div>

                            {/* Settings Cards */}
                            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                              {/* Integrações Externas */}
                              <SettingsCard
                                icon={
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                    <g>
                                      <path d="M10 18.3333V14.1667" stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                      <path d="M7.5 6.66667V1.66667" stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                      <path d="M12.5 6.66667V1.66667" stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                      <path d={svgPaths.p19668900} stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                    </g>
                                  </svg>
                                }
                                title="Integrações Externas"
                                items={[
                                  { label: 'Conexão ABCCMM', value: 'Ativa' },
                                  { label: 'Gateway de Pagamento', value: 'Stripe conectado' },
                                  { label: 'Notificações por E-mail', value: 'SendGrid' }
                                ]}
                              />

                              {/* Gestão de Permissões */}
                              <SettingsCard
                                icon={
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                    <g>
                                      <path d={svgPaths.p3b957700} stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                    </g>
                                  </svg>
                                }
                                title="Gestão de Permissões"
                                items={[
                                  { label: 'Super Admin', value: 'Admin (você)' },
                                  { label: 'Suporte Técnico', value: '2 ativos' }
                                ]}
                              />

                              {/* Configurações da Plataforma */}
                              <SettingsCard
                                icon={
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                    <g>
                                      <path d="M11.6667 14.1667H4.16667" stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                      <path d="M15.8333 5.83333H8.33333" stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                      <path d={svgPaths.p10325580} stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                      <path d={svgPaths.p15dbd840} stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                    </g>
                                  </svg>
                                }
                                title="Configurações da Plataforma"
                                items={[
                                  { label: 'Período de Trial', value: '14 dias' },
                                  { label: 'Limite Padrão de Mídias', value: '5GB por haras' }
                                ]}
                              />

                              {/* Notificações & Monitoramento */}
                              <SettingsCard
                                icon={
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                    <g>
                                      <path d={svgPaths.p3b7be120} stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                      <path d={svgPaths.p1f3d9f80} stroke="currentColor" className="text-[#101828] dark:text-white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                    </g>
                                  </svg>
                                }
                                title="Notificações & Monitoramento"
                                items={[
                                  { label: 'Alertas Críticos', value: 'E-mail ativo' },
                                  { label: 'Relatórios Semanais', value: 'Habilitado' }
                                ]}
                              />
                            </div>

                            {/* System Info Card */}
                            <SystemInfoCard />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
