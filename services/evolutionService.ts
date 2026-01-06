import { supabase } from './supabase';

// Configuração e Sanitização
const RAW_URL = import.meta.env.VITE_EVOLUTION_API_URL || '';
const EVOLUTION_API_URL = RAW_URL.replace(/\/$/, '');
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY;

const getHeaders = () => ({
    'apikey': EVOLUTION_API_KEY,
    'Content-Type': 'application/json'
});

// Helper: Valida se é chat privado (Pessoas) e não Grupo/Broadcast
const isPrivateChat = (jid: string) => {
    return jid && jid.endsWith('@s.whatsapp.net');
};


// --- NOVAS FUNÇÕES DE CICLO DE VIDA ---

export const fetchInstanceStatus = async (instanceName: string) => {
    if (!EVOLUTION_API_URL) return 'ERROR';
    try {
        const res = await fetch(`${EVOLUTION_API_URL}/instance/connectionState/${instanceName}`, {
            headers: getHeaders()
        });

        if (res.status === 404) return 'NOT_FOUND'; // Instância não existe

        const data = await res.json();
        // Evolution v2 retorna: { instance: { state: 'open' } }
        return data.instance?.state || data.state || 'close';
    } catch (error) {
        console.error("Erro ao checar status:", error);
        return 'ERROR';
    }
};

export const createInstance = async (instanceName: string) => {
    if (!EVOLUTION_API_URL) throw new Error("API URL não configurada");

    const res = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            instanceName,
            qrcode: true,
            integration: "WHATSAPP-BAILEYS"
        })
    });

    // Se der erro 403/409, provavelmente já existe.
    if (!res.ok) {
        if (res.status === 403 || res.status === 409) {
            return null; // Instância existe (sem QR na resposta de erro)
        }
        const err = await res.json();
        throw new Error(err.message || "Falha ao criar instância");
    }

    // Retorna dados (pode incluir .qrcode se solicitado)
    return await res.json();
};

// Tenta listar todas as instâncias (v2)
export const fetchAllInstances = async () => {
    if (!EVOLUTION_API_URL) return [];
    try {
        // Tenta endpoint padrão
        let res = await fetch(`${EVOLUTION_API_URL}/instance/fetch`, { headers: getHeaders() });
        if (res.status === 404) {
            // Fallback
            res = await fetch(`${EVOLUTION_API_URL}/instances`, { headers: getHeaders() });
        }

        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.data || []);
    } catch (e) {
        console.error('Erro ao buscar instâncias:', e);
        return [];
    }
};

export const fetchQRCode = async (instanceName: string) => {
    const res = await fetch(`${EVOLUTION_API_URL}/instance/connect/${instanceName}`, {
        headers: getHeaders()
    });

    const data = await res.json();
    // Suporte a diferentes versões da API (code ou base64)
    return data.base64 || data.code || null;
};

export const logoutInstance = async (instanceName: string) => {
    await fetch(`${EVOLUTION_API_URL}/instance/logout/${instanceName}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
};

/**
 * Envia mensagem de texto (Mantido)
 */
export const sendTextMessage = async (instanceName: string, remoteJid: string, text: string) => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.error("❌ ERRO CRÍTICO: Credenciais .env ausentes!");
        throw new Error("Configuração .env incompleta");
    }

    // 1. Garante formato do número
    const cleanJid = remoteJid.includes('@') ? remoteJid : `${remoteJid}@s.whatsapp.net`;

    // 2. Valida que é chat privado (não grupo)
    if (!isPrivateChat(cleanJid)) {
        throw new Error("Envio permitido apenas para chats privados (não grupos).");
    }

    const url = `${EVOLUTION_API_URL}/message/sendText/${instanceName}`;
    const body = {
        number: cleanJid,
        text: text,
        delay: 1200,
        linkPreview: true
    };

    console.log(`🚀 [Evolution] Enviando para: ${url}`);
    console.log(`📦 [Evolution] Payload:`, body);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ [Evolution] Erro API (${response.status}):`, errorText);
            throw new Error(`Erro API ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log(`✅ [Evolution] Sucesso:`, data);

        // 3. AUTO-SAVE: Garante que o chat existe no Supabase imediatamente
        // Isso faz o contato aparecer na sidebar assim que você envia a mensagem
        const { error } = await supabase.from('chats').upsert({
            whatsapp_id: cleanJid,
            name: cleanJid.split('@')[0], // Nome provisório (número) até sincronizar perfil real
            last_message_at: new Date().toISOString(),
            status: 'Aberto'
        }, { onConflict: 'whatsapp_id' });

        if (error) console.error("⚠️ Erro ao salvar chat localmente:", error);
        else console.log(`💾 Chat auto-salvo: ${cleanJid}`);

        return data;
    } catch (error: any) {
        console.error(`❌ [Evolution] Falha na requisição:`, error);
        throw error;
    }
};

/**
 * Atualiza Perfil (Mantido)
 */
export const updateChatProfile = async (instanceName: string, chatId: string, remoteJid: string) => {
    if (!EVOLUTION_API_URL) return { success: false };

    try {
        console.log(`🔄 [Evolution] Buscando perfil para: ${remoteJid}`);

        // 1. Busca Foto
        const resPic = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfilePictureUrl/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ number: remoteJid })
        });
        const dataPic = await resPic.json().catch(() => ({}));
        const avatarUrl = dataPic.profilePictureUrl || dataPic.url || null;

        // 2. Busca Nome
        const resName = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfile/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ number: remoteJid })
        });
        const dataName = await resName.json().catch(() => ({}));
        const name = dataName.name || dataName.pushName || dataName.notify || null;

        // 3. Atualiza Banco
        const updates: any = {};
        if (avatarUrl) updates.avatar_url = avatarUrl;

        // Se achou nome e no banco é só o número, atualiza
        if (name) updates.name = name;

        if (Object.keys(updates).length > 0) {
            await supabase.from('chats').update(updates).eq('id', chatId);
        }

        return { success: true, name, avatar: avatarUrl };
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return { success: false };
    }
};

/**
 * Sincronização (Mantido)
 */
export const syncChatsFromEvolution = async (instanceName: string): Promise<number> => {
    // Mantém compatibilidade com código anterior
    const url = `${EVOLUTION_API_URL}/chat/findChats/${instanceName}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        // Fallback POST se GET falhar
        const resPost = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ where: {} })
        });
        if (!resPost.ok) throw new Error(`Erro Sync: ${resPost.status}`);
        return await processChatsResponse(resPost);
    }

    return await processChatsResponse(response);
};

async function processChatsResponse(response: Response): Promise<number> {
    const data = await response.json();
    // A API pode retornar array direto ou { data: [...] }
    const rawChats = Array.isArray(data) ? data : (data.data || []);
    let count = 0;

    for (const chat of rawChats) {
        const remoteJid = chat.id || chat.remoteJid;

        // --- FILTRO DE BLOQUEIO (IGNORAR GRUPOS) ---
        if (!isPrivateChat(remoteJid)) {
            continue;
        }

        // Tenta extrair a melhor imagem e nome disponíveis
        const avatarUrl = chat.profilePictureUrl || chat.profilePicThumb || null;
        const name = chat.name || chat.pushName || chat.notifyName || remoteJid.split('@')[0];

        const { error } = await supabase.from('chats').upsert({
            whatsapp_id: remoteJid,
            name: name,
            avatar_url: avatarUrl,
            unread_count: chat.unreadCount || 0,
            last_message_at: new Date().toISOString() // Atualiza para aparecer no topo
        }, { onConflict: 'whatsapp_id' });

        if (!error) count++;
    }

    console.log(`✅ Sincronizados ${count} chats privados`);
    return count;
}

export const syncMessages = async (instanceName: string, remoteJid: string) => {
    if (!EVOLUTION_API_URL) return;

    console.log(`📥 Syncing messages for ${remoteJid}...`);
    const cleanJid = remoteJid.includes('@') ? remoteJid : `${remoteJid}@s.whatsapp.net`;

    // Busca últimas 50 mensagems
    const body = {
        where: {
            key: { remoteJid: cleanJid }
        },
        take: 50
    };

    try {
        const res = await fetch(`${EVOLUTION_API_URL}/chat/findMessages/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error('Falha ao buscar mensagens');

        const data = await res.json();
        const messages = data.messages || data || []; // Adjust based on actual API response

        // Vamos precisar do chat_id interno do supabase
        const { data: chatData } = await supabase.from('chats').select('id').eq('whatsapp_id', cleanJid).single();
        if (!chatData?.id) return;

        let count = 0;
        for (const msg of messages) {
            // Mapeia Evolution Message -> Supabase Message
            // Verifica quem enviou. Se fromMe=true, é 'agent'. Se falso, 'user'.
            // obs: Adapte conforme estrutura real da mensagem do Evolution
            const isFromMe = msg.key?.fromMe || msg.fromMe;
            const textContent = msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.content || '';

            if (!textContent) continue;

            const { error } = await supabase.from('messages').upsert({
                chat_id: chatData.id,
                sender: isFromMe ? 'agent' : 'user',
                text: textContent,
                created_at: new Date(msg.messageTimestamp * 1000 || Date.now()).toISOString()
            }, { onConflict: 'created_at' }); // Idealmente use um ID único da mensagem se tiver, mas created_at serve pra MVP se não houver colisão exata

            if (!error) count++;
        }
        console.log(`✅ ${count} mensagens sincronizadas.`);
        return count;

    } catch (e) {
        console.error("Erro syncMessages:", e);
    }
};