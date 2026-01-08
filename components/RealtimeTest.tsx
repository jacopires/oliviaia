import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const RealtimeTest = () => {
    const [status, setStatus] = useState<string>('Inicializando...');
    const [messages, setMessages] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('🧪 [RealtimeTest] Iniciando teste de conexão Realtime');

        // Criar canal de teste
        const testChannel = supabase
            .channel('realtime-test-' + Date.now())
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    console.log('✅ [RealtimeTest] EVENTO RECEBIDO:', payload);
                    setMessages(prev => [...prev, payload]);
                    setStatus('✅ FUNCIONANDO! Evento recebido às ' + new Date().toLocaleTimeString());
                }
            )
            .subscribe((status, err) => {
                console.log('🔌 [RealtimeTest] Status:', status);
                console.log('🔌 [RealtimeTest] Error:', err);

                if (err) {
                    setError(JSON.stringify(err, null, 2));
                    setStatus('❌ ERRO: ' + err.message);
                } else {
                    setStatus('Status: ' + status);
                }

                if (status === 'SUBSCRIBED') {
                    setStatus('✅ CONECTADO! Aguardando eventos...');
                } else if (status === 'CHANNEL_ERROR') {
                    setStatus('❌ ERRO NO CANAL');
                } else if (status === 'TIMED_OUT') {
                    setStatus('❌ TIMEOUT - Não conseguiu conectar');
                } else if (status === 'CLOSED') {
                    setStatus('⚠️ CONEXÃO FECHADA');
                }
            });

        return () => {
            console.log('🧪 [RealtimeTest] Limpando teste');
            supabase.removeChannel(testChannel);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: '#1a1a1a',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            maxHeight: '500px',
            overflow: 'auto',
            zIndex: 9999,
            border: '2px solid #333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
                🧪 Teste de Realtime
            </h3>

            <div style={{ marginBottom: '15px' }}>
                <strong>Status:</strong>
                <div style={{
                    marginTop: '5px',
                    padding: '10px',
                    background: '#2a2a2a',
                    borderRadius: '4px',
                    fontSize: '14px'
                }}>
                    {status}
                </div>
            </div>

            {error && (
                <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#ff6b6b' }}>Erro:</strong>
                    <pre style={{
                        marginTop: '5px',
                        padding: '10px',
                        background: '#2a2a2a',
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto',
                        color: '#ff6b6b'
                    }}>
                        {error}
                    </pre>
                </div>
            )}

            <div>
                <strong>Eventos recebidos: {messages.length}</strong>
                <div style={{
                    marginTop: '5px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    fontSize: '12px'
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            padding: '8px',
                            background: '#2a2a2a',
                            borderRadius: '4px',
                            marginTop: '5px'
                        }}>
                            <div><strong>Tipo:</strong> {msg.eventType}</div>
                            <div><strong>ID:</strong> {msg.new?.id?.substring(0, 8)}...</div>
                            <div><strong>Hora:</strong> {new Date().toLocaleTimeString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
                Envie uma mensagem pelo WhatsApp para testar.
                <br />
                Se aparecer evento aqui, o Realtime funciona!
            </div>
        </div>
    );
};
