import React, { useState } from 'react';
import { 
  Calendar, Clock, User, CheckCircle, AlertCircle, 
  ChevronLeft, ChevronRight, MapPin, Phone, Mail,
  CreditCard, Info, ArrowRight, ArrowLeft, X
} from 'lucide-react';

const AgendamentoConsulta = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [agendamento, setAgendamento] = useState({
    nome: '', email: '', telefone: '', servico: '',
    modalidade: '', // Começa vazio para obrigar a escolha
    data: '', horario: '', observacoes: ''
  });

  const servicos = [
    { nome: 'Nutrição para Gestante', preco: 'R$ 240,00' },
    { nome: 'Nutrição Materno-Infantil (0-12 anos)', preco: 'R$ 220,00' },
    { nome: 'Nutrição em Família', preco: 'R$ 799,90' }
  ];

  const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  // Validação de data: Apenas Seg(1), Qua(3), Sex(5), Sáb(6)
  const isDataValida = (dataString) => {
    if (!dataString) return false;
    const date = new Date(dataString + 'T12:00:00'); // Evita erro de fuso
    const day = date.getDay();
    return [1, 3, 5, 6].includes(day);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Dados do Agendamento:", agendamento);
      setStep(4); // Vai para tela de sucesso
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Agendar Consulta</h2>

          <form onSubmit={handleSubmit}>
            {/* ETAPA 1: DADOS PESSOAIS */}
            {step === 1 && (
              <div className="space-y-4">
                <input type="text" placeholder="Nome Completo" required className="w-full p-3 border rounded-lg" value={agendamento.nome} onChange={(e) => setAgendamento({...agendamento, nome: e.target.value})} />
                <input type="tel" placeholder="WhatsApp (00) 00000-0000" required className="w-full p-3 border rounded-lg" value={agendamento.telefone} onChange={(e) => setAgendamento({...agendamento, telefone: e.target.value})} />
                <button type="button" onClick={() => agendamento.nome && agendamento.telefone && setStep(2)} className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600">Próximo</button>
              </div>
            )}

            {/* ETAPA 2: SERVIÇO E MODALIDADE */}
            {step === 2 && (
              <div className="space-y-4">
                <select className="w-full p-3 border rounded-lg" value={agendamento.servico} onChange={(e) => setAgendamento({...agendamento, servico: e.target.value})} required>
                  <option value="">Selecione o Serviço</option>
                  {servicos.map(s => <option key={s.nome} value={s.nome}>{s.nome} - {s.preco}</option>)}
                </select>
                
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Modalidade de Atendimento:</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="modalidade" value="Presencial" checked={agendamento.modalidade === 'Presencial'} onChange={(e) => setAgendamento({...agendamento, modalidade: e.target.value})} />
                      <span>Presencial</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="modalidade" value="Online" checked={agendamento.modalidade === 'Online'} onChange={(e) => setAgendamento({...agendamento, modalidade: e.target.value})} />
                      <span>Online</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-200 py-3 rounded-lg">Voltar</button>
                  <button type="button" onClick={() => agendamento.servico && agendamento.modalidade && setStep(3)} className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600">Próximo</button>
                </div>
              </div>
            )}

            {/* ETAPA 3: DATA E HORÁRIO */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data (Seg, Qua, Sex, Sáb)</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 border rounded-lg ${agendamento.data && !isDataValida(agendamento.data) ? 'border-red-500 bg-red-50' : ''}`}
                    value={agendamento.data} 
                    onChange={(e) => setAgendamento({...agendamento, data: e.target.value})} 
                  />
                  {agendamento.data && !isDataValida(agendamento.data) && (
                    <p className="text-red-500 text-xs mt-1 font-medium">Atendimento disponível apenas às segundas, quartas, sextas e sábados.</p>
                  )}
                </div>

                <select className="w-full p-3 border rounded-lg" value={agendamento.horario} onChange={(e) => setAgendamento({...agendamento, horario: e.target.value})} required>
                  <option value="">Selecione o Horário</option>
                  {horarios.map(h => <option key={h} value={h}>{h}</option>)}
                </select>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 bg-gray-200 py-3 rounded-lg">Voltar</button>
                  {isDataValida(agendamento.data) && agendamento.horario && (
                    <button type="submit" disabled={isLoading} className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 disabled:opacity-50">
                      {isLoading ? 'Enviando...' : 'Finalizar'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ETAPA 4: SUCESSO */}
            {step === 4 && (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Solicitação Enviada!</h3>
                <p className="text-gray-600 mb-6">Entraremos em contato via WhatsApp para confirmar seu agendamento.</p>
                <button type="button" onClick={onClose} className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold">Fechar</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoConsulta;
