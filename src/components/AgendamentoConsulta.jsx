import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { Textarea } from './ui/textarea.jsx'
import { Calendar, Clock, User, Phone, Mail, CheckCircle, X, AlertCircle } from 'lucide-react'

const AgendamentoConsulta = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [dataInvalida, setDataInvalida] = useState(false)
  const [agendamento, setAgendamento] = useState({
    tipoConsulta: '',
    modalidade: '',
    data: '',
    horario: '',
    nome: '',
    email: '',
    telefone: '',
    observacoes: ''
  })

  const tiposConsulta = [
    { 
      value: 'nutricao-Gestantes', 
      label: 'Nutrição para Gestantes', 
      preco: 'R$ 240,00',
      descricao: 'Inclui acompanhamento nutricional, exames bioquímicos, acompanhamento em tempo real via whatsapp e demandas personalizada. Opcional: cardápio mensal. Inclui 1 consulta + 1 retorno.'
    },
    { 
      value: 'nutricao-materno-infantil', 
      label: 'Nutrição Materno-Infantil (0 a 12 anos)', 
      preco: 'R$ 220,00',
      descricao: 'Inclui acompanhamento nutricional, educação alimentar nutricional (tendo educação sobre alimentos e atividades para fazer com os pais), exames bioquímicos, acompanhamento em tempo real via whatsapp e demandas personalizada. Opcional: cardápio mensal. Inclui 1 consulta + 1 retorno.'
    },
    { 
      value: 'nutricao-familia', 
      label: 'Nutrição em Família', 
      preco: 'R$ 799,90',
      descricao: 'Inclui acompanhamento familiar completo, cardápios individuais e coletivo, exames laboratoriais e faz o acompanhamento de dois adultos + até 2 crianças. O objetivo é tornar uma reeducação alimentar mais eficaz e uma vida muito mais saudável em família. Incluso 1 consulta + 1 retorno'
    },
  ]

  const horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00'
  ]

  const handleInputChange = (field, value) => {
    setAgendamento(prev => ({
      ...prev,
      [field]: value
    }))
    setErrorMessage('')
  }

  // Validação de data: Apenas Seg(1), Qua(3), Sex(5), Sáb(6)
  const isDataValida = (dataString) => {
    if (!dataString) return false
    const date = new Date(dataString + 'T12:00:00')
    const day = date.getDay()
    return [1, 3, 5, 6].includes(day)
  }

  const handleDataChange = (value) => {
    setAgendamento(prev => ({ ...prev, data: value }))
    setErrorMessage('')
    if (value && !isDataValida(value)) {
      setDataInvalida(true)
    } else {
      setDataInvalida(false)
    }
  }

  const handleNextStep = () => {
    if (step === 1 && !agendamento.tipoConsulta) return
    if (step === 2 && (!agendamento.modalidade)) return
    if (step === 3 && (!agendamento.data || !agendamento.horario || dataInvalida)) return
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Buscar informações da consulta selecionada
      const consultaSelecionada = tiposConsulta.find(t => t.value === agendamento.tipoConsulta)
      const dataFormatada = new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')

      // Montar a mensagem para o WhatsApp
      const mensagem = `Olá! Gostaria de agendar uma consulta:%0A%0A` +
        `*Serviço:* ${consultaSelecionada?.label}%0A` +
        `*Modalidade:* ${agendamento.modalidade}%0A` +
        `*Data:* ${dataFormatada}%0A` +
        `*Horário:* ${agendamento.horario}%0A` +
        `*Valor:* ${consultaSelecionada?.preco}%0A%0A` +
        `*Dados Pessoais:*%0A` +
        `*Nome:* ${agendamento.nome}%0A` +
        `*E-mail:* ${agendamento.email}%0A` +
        `*Telefone:* ${agendamento.telefone}%0A` +
        (agendamento.observacoes ? `%0A*Observações:* ${agendamento.observacoes}` : '')

      // Número da nutricionista (com código do país)
      const numeroWhatsApp = '5541988021519'

      // Abrir o WhatsApp com a mensagem pronta
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`
      window.open(urlWhatsApp, '_blank')

      setSuccessMessage('✅ Redirecionando para o WhatsApp! Envie a mensagem para confirmar seu agendamento.')
      setTimeout(() => {
        onClose()
        setStep(1)
        setAgendamento({
          tipoConsulta: '',
          modalidade: '',
          data: '',
          horario: '',
          nome: '',
          email: '',
          telefone: '',
          observacoes: ''
        })
        setSuccessMessage('')
      }, 3000)
    } catch (error) {
      setErrorMessage('Erro ao redirecionar para o WhatsApp. Tente novamente.')
      console.error('Erro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-pink-50 to-white">
          <div>
            <CardTitle className="flex items-center text-pink-600">
              <Calendar className="h-5 w-5 mr-2" />
              Agendar Consulta
            </CardTitle>
            <CardDescription>
              Passo {step} de 4 - {step === 1 ? 'Escolha o serviço' : step === 2 ? 'Modalidade de atendimento' : step === 3 ? 'Selecione data e horário' : 'Seus dados'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Indicador de progresso */}
          <div className="flex items-center mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  stepNumber <= step ? 'bg-pink-500 text-white shadow-lg' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber < step ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-colors ${
                    stepNumber < step ? 'bg-pink-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Mensagens de Sucesso/Erro */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Passo 1: Tipo de Consulta */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Escolha o tipo de consulta</h3>
                <div className="grid gap-4">
                  {tiposConsulta.map((tipo) => (
                    <div
                      key={tipo.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        agendamento.tipoConsulta === tipo.value
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                      onClick={() => handleInputChange('tipoConsulta', tipo.value)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{tipo.label}</h4>
                        <span className="text-lg font-bold text-pink-500">{tipo.preco}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {tipo.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 2: Modalidade de Atendimento */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Modalidade de Atendimento</h3>
                <div className="grid gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      agendamento.modalidade === 'Presencial'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    onClick={() => handleInputChange('modalidade', 'Presencial')}
                  >
                    <h4 className="font-semibold text-gray-900">Presencial</h4>
                    <p className="text-sm text-gray-600">Atendimento no consultório</p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      agendamento.modalidade === 'Online'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    onClick={() => handleInputChange('modalidade', 'Online')}
                  >
                    <h4 className="font-semibold text-gray-900">Online</h4>
                    <p className="text-sm text-gray-600">Atendimento por videochamada</p>
                  </div>
                </div>
              </div>
            )}

            {/* Passo 3: Data e Horário */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Selecione data e horário</h3>
                
                <div>
                  <Label htmlFor="data" className="text-gray-700 font-medium">Data da Consulta (Seg, Qua, Sex, Sáb)</Label>
                  <Input
                    id="data"
                    type="date"
                    min={getMinDate()}
                    value={agendamento.data}
                    onChange={(e) => handleDataChange(e.target.value)}
                    required
                    className={`mt-2 ${dataInvalida ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  {dataInvalida && (
                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Atendimento disponível apenas às segundas, quartas, sextas e sábados.
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">Horário Disponível</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {horariosDisponiveis.map((horario) => (
                      <Button
                        key={horario}
                        type="button"
                        variant={agendamento.horario === horario ? "default" : "outline"}
                        className={`transition-all ${agendamento.horario === horario ? "bg-pink-500 hover:bg-pink-600 text-white" : "border-gray-300 hover:border-pink-300"}`}
                        onClick={() => handleInputChange('horario', horario)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {horario}
                      </Button>
                    ))}
                  </div>
                </div>

                {agendamento.tipoConsulta && (
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200 mt-6">
                    <h4 className="font-semibold text-pink-900 mb-2">Resumo da Consulta</h4>
                    <div className="text-sm text-pink-800 space-y-1">
                      <p><strong>Serviço:</strong> {tiposConsulta.find(t => t.value === agendamento.tipoConsulta)?.label}</p>
                      <p><strong>Modalidade:</strong> {agendamento.modalidade}</p>
                      {agendamento.data && !dataInvalida && <p><strong>Data:</strong> {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')}</p>}
                      {agendamento.horario && <p><strong>Horário:</strong> {agendamento.horario}</p>}
                      <p><strong>Valor:</strong> {tiposConsulta.find(t => t.value === agendamento.tipoConsulta)?.preco}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Passo 4: Dados Pessoais */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Seus dados para contato</h3>
                
                <div>
                  <Label htmlFor="nome" className="text-gray-700 font-medium">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={agendamento.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                    className="mt-2"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={agendamento.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="mt-2"
                    placeholder="seu.email@exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-gray-700 font-medium">Telefone/WhatsApp</Label>
                  <Input
                    id="telefone"
                    value={agendamento.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes" className="text-gray-700 font-medium">Observações (opcional)</Label>
                  <Textarea
                    id="observacoes"
                    value={agendamento.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Conte-nos sobre seus objetivos, restrições alimentares ou outras informações importantes..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                  <h4 className="font-semibold text-pink-900 mb-3">Confirmação do Agendamento</h4>
                  <div className="text-sm text-pink-800 space-y-2">
                    <p><strong>Consulta:</strong> {tiposConsulta.find(t => t.value === agendamento.tipoConsulta)?.label}</p>
                    <p><strong>Modalidade:</strong> {agendamento.modalidade}</p>
                    <p><strong>Data:</strong> {agendamento.data && new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    <p><strong>Horário:</strong> {agendamento.horario}</p>
                    <p><strong>Valor:</strong> {tiposConsulta.find(t => t.value === agendamento.tipoConsulta)?.preco}</p>
                    <p className="text-xs text-pink-600 mt-3">Ao confirmar, você será redirecionado para o WhatsApp para enviar a solicitação.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? onClose : handlePrevStep}
                className="border-gray-300"
              >
                {step === 1 ? 'Cancelar' : 'Voltar'}
              </Button>
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={
                    (step === 1 && !agendamento.tipoConsulta) ||
                    (step === 2 && !agendamento.modalidade) ||
                    (step === 3 && (!agendamento.data || !agendamento.horario || dataInvalida))
                  }
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!agendamento.nome || !agendamento.email || !agendamento.telefone || isLoading}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {isLoading ? 'Enviando...' : 'Confirmar Agendamento'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AgendamentoConsulta