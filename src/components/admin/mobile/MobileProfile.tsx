import { User, Mail, Phone, Shield, LogOut, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Avatar, AvatarFallback } from '../../ui/avatar';

export function MobileProfile() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-gray-900 mb-1">Perfil</h2>
        <p className="text-gray-600">Configurações da conta</p>
      </div>

      {/* Admin Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gray-100 text-gray-900 text-2xl">
                LR
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-900">Leonora Renck</p>
              <p className="text-gray-600 mt-1">Administrador</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-500">E-mail</p>
              <p className="text-gray-900">leonora@criahub.com.br</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-500">Telefone</p>
              <p className="text-gray-900">(11) 99999-9999</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => alert('Abrindo configurações de segurança...')}>
            <Shield className="w-5 h-5 mr-3" />
            Segurança e Privacidade
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => alert('Abrindo configurações gerais...')}>
            <Settings className="w-5 h-5 mr-3" />
            Configurações Gerais
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => alert('Alterando senha...')}>
            Alterar Senha
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 border-red-600 hover:bg-red-50" onClick={() => alert('Desconectando de todos os dispositivos...')}>
            <LogOut className="w-5 h-5 mr-3" />
            Desconectar de Todos os Dispositivos
          </Button>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-600">
          <div className="flex justify-between">
            <span>Versão</span>
            <span className="text-gray-900">v1.0.0</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Última Atualização</span>
            <span className="text-gray-900">2 de set. de 2025</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Ambiente</span>
            <span className="text-gray-900">Produção</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}