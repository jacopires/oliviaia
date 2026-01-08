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
    if (!jid) return false;
    // REJEITA EXPLICITAMENTE GRUPOS E LISTAS
    if (jid.includes('@g.us') || jid.includes('@broadcast') || jid.includes('@newsletter')) return false;

    // Se tiver @, tem que ser s.whatsapp.net ou c.us
    if (jid.includes('@')) {
        return jid.includes('@s.whatsapp.net') || jid.includes('@c.us');
    }

    // Se for apenas números, assume que é privado (formataremos depois)
    return true;
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

export const configureWebhook = async (instanceName: string, webhookUrl: string) => {
    if (!EVOLUTION_API_URL) throw new Error("API URL não configurada");

    console.log(`📡 Configurando webhook para ${instanceName} -> ${webhookUrl}`);

    const res = await fetch(`${EVOLUTION_API_URL}/webhook/set/${instanceName}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            "webhook": {
                "enabled": true,
                "url": webhookUrl,
                "webhookByEvents": true,
                "events": [
                    "MESSAGES_UPSERT",
                    "MESSAGES_UPDATE",
                    "CONNECTION_UPDATE",
                    "SEND_MESSAGE"
                ]
            }
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ [Configure Webhook] Falha (${res.status}):`, errorText);
        // Tenta parsear para mostrar mensagem limpa
        try {
            const err = JSON.parse(errorText);
            const msg = err.response?.message || err.message || JSON.stringify(err);
            throw new Error(`Erro Webhook: ${msg}`);
        } catch (e) {
            throw new Error(`Erro API (${res.status}): ${errorText}`);
        }
    }

    return await res.json();
};

export const configureSettings = async (instanceName: string) => {
    if (!EVOLUTION_API_URL) throw new Error('EVOLUTION_API_URL não configurado');

    console.log(`⚙️  [Configure Settings] Configurando settings para: ${instanceName}`);

    const res = await fetch(`${EVOLUTION_API_URL}/settings/set/${instanceName}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            rejectCall: true,
            msgCall: 'Olá! Não atendo chamadas no momento. Por favor, envie uma mensagem.',
            groupsIgnore: true
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ [Configure Settings] Falha (${res.status}):`, errorText);
        try {
            const err = JSON.parse(errorText);
            const msg = err.response?.message || err.message || JSON.stringify(err);
            throw new Error(`Erro Settings: ${msg}`);
        } catch (e) {
            throw new Error(`Erro API (${res.status}): ${errorText}`);
        }
    }

    console.log('✅ [Configure Settings] Settings configurados com sucesso');
    return await res.json();
};

export const fetchWebhookConfig = async (instanceName: string) => {
    if (!EVOLUTION_API_URL) return null;
    try {
        const res = await fetch(`${EVOLUTION_API_URL}/webhook/find/${instanceName}`, {
            headers: getHeaders()
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error("Erro ao buscar config webhook:", e);
        return null;
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
 * Envia presença de digitação (typing indicator)
 */
export const sendTyping = async (instanceName: string, remoteJid: string) => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.error("❌ ERRO CRÍTICO: Credenciais .env ausentes!");
        throw new Error("Configuração .env incompleta");
    }

    const cleanJid = remoteJid.includes('@') ? remoteJid : `${remoteJid}@s.whatsapp.net`;

    const url = `${EVOLUTION_API_URL}/chat/sendPresence/${instanceName}`;
    const body = {
        number: cleanJid,
        presence: 'composing', // 'composing' = digitando, 'available' = online
        delay: 1200 // Duração do indicador
    };

    console.log(`⌨️  [Typing] Enviando presença de digitação para: ${cleanJid}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.warn(`⚠️ [Typing] Erro ao enviar typing (${response.status}) - continuando mesmo assim`);
            return null;
        }

        const data = await response.json();
        console.log(`✅ [Typing] Indicador enviado`);
        return data;
    } catch (error: any) {
        console.warn(`⚠️ [Typing] Falha ao enviar typing - continuando mesmo assim:`, error.message);
        return null;
    }
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
        else {
            console.log(`💾 Chat auto-salvo: ${cleanJid}`);
            // "Turbo": Ao criar/interagir, garante que temos o histórico recente
            // Isso cobre o caso "contato é criado e ai as conversas são sincronizadas"
            syncMessages(instanceName, cleanJid).catch(e => console.error("Falha background sync:", e));
        }

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

        console.log(`📸 [Evolution] Avatar para ${remoteJid}:`, avatarUrl ? 'URL encontrada' : 'Sem foto');

        // 2. Busca Nome
        const resName = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfile/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ number: remoteJid })
        });
        const dataName = await resName.json().catch(() => ({}));
        const name = dataName.name || dataName.pushName || dataName.notify || null;

        console.log(`👤 [Evolution] Nome para ${remoteJid}:`, name || 'Não encontrado');

        // 3. Atualiza Banco
        const updates: any = {};

        // Sempre atualizar avatar (mesmo que seja null para limpar fotos incorretas)
        updates.avatar_url = avatarUrl;

        // Se achou nome e no banco é só o número, atualiza
        if (name) updates.name = name;

        if (Object.keys(updates).length > 0) {
            const { error } = await supabase.from('chats').update(updates).eq('id', chatId);
            if (error) {
                console.error(`❌ [Evolution] Erro ao atualizar DB:`, error);
            }
        }

        return { success: true, name, avatar: avatarUrl };
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return { success: false };
    }
};

/**
 * Sincroniza apenas conversas recentes (chats com mensagens)
 * Não sincroniza todos os contatos - apenas aqueles que já conversaram
 */
export const syncChatsFromEvolution = async (instanceName: string, limit: number = 50): Promise<number> => {
    const url = `${EVOLUTION_API_URL}/chat/findChats/${instanceName}`;
    console.log(`📡 Sincronizando conversas recentes de: ${instanceName}`);

    // Always try POST first for v2.3.x - requesting only recent chats
    const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            where: {},
            // Some Evolution versions support take/limit
            take: limit
        })
    });

    if (!response.ok) {
        console.warn(`⚠️ Erro ao buscar chats (POST): ${response.status} - Tentando GET fallback...`);
        const resGet = await fetch(url, { method: 'GET', headers: getHeaders() });
        if (!resGet.ok) throw new Error(`Erro Sync Chats: ${resGet.status}`);
        return await processChatsResponse(resGet, limit);
    }

    return await processChatsResponse(response, limit);
};

async function processChatsResponse(response: Response, limit: number = 50): Promise<number> {
    const data = await response.json();

    // A API pode retornar array direto ou { data: [...] }
    let rawChats = Array.isArray(data) ? data : (data.data || []);

    // Limita a quantidade de chats para não sobrecarregar
    if (rawChats.length > limit) {
        console.log(`📊 Limitando de ${rawChats.length} para ${limit} chats`);
        rawChats = rawChats.slice(0, limit);
    }

    console.log(`📊 Processando ${rawChats.length} chats`);
    let count = 0;
    let skipped = 0;

    for (const chat of rawChats) {
        const remoteJid = chat.id || chat.remoteJid;

        // --- FILTRO: IGNORAR GRUPOS E BROADCASTS ---
        if (!isPrivateChat(remoteJid)) {
            skipped++;
            continue;
        }

        // Tenta extrair a melhor imagem e nome disponíveis
        const avatarUrl = chat.profilePictureUrl || chat.profilePicThumb || null;
        const name = chat.name || chat.pushName || chat.notifyName || remoteJid?.split('@')[0] || 'Sem Nome';

        // TENTA PEGAR A DATA REAL DA ÚLTIMA MENSAGEM
        // conversationTimestamp é um timestamp unix (segundos)
        let lastMsgDate = new Date().toISOString();
        if (chat.conversationTimestamp) {
            lastMsgDate = new Date(Number(chat.conversationTimestamp) * 1000).toISOString();
        }

        const { error } = await supabase.from('chats').upsert({
            whatsapp_id: remoteJid,
            name: name,
            avatar_url: avatarUrl,
            unread_count: chat.unreadCount || 0,
            last_message_at: lastMsgDate
        }, { onConflict: 'whatsapp_id' });

        if (error) {
            console.error(`❌ Erro ao salvar chat ${remoteJid}:`, error);
        } else {
            count++;
        }
    }

    console.log(`✅ Sincronizados ${count} conversas (${skipped} grupos ignorados)`);
    return count;
}

export const syncContactsFromEvolution = async (instanceName: string): Promise<number> => {
    // Correct endpoint for Evolution v2.x
    const url = `${EVOLUTION_API_URL}/chat/findContacts/${instanceName}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ where: {} })
    });

    if (!response.ok) {
        console.warn(`⚠️ Erro ao buscar contatos: ${response.status}`);
        return 0; // Return 0 instead of throwing to not break the sync flow
    }

    const data = await response.json();
    console.log('📦 Raw Contacts Response:', data);
    const rawContacts = Array.isArray(data) ? data : (data.data || []);
    console.log(`📊 Total de contatos recebidos: ${rawContacts.length}`);

    let count = 0;
    let skipped = 0;

    for (const contact of rawContacts) {
        const remoteJid = contact.id || contact.remoteJid;

        if (!isPrivateChat(remoteJid)) {
            skipped++;
            continue;
        }

        const name = contact.name || contact.pushName || contact.notify || remoteJid?.split('@')[0] || 'Sem Nome';
        const avatarUrl = contact.profilePictureUrl || null;

        // Use upsert directly - much simpler and avoids 406 errors
        const { error } = await supabase.from('chats').upsert({
            whatsapp_id: remoteJid,
            name: name,
            avatar_url: avatarUrl,
            // Don't update last_message_at to avoid shuffling chat order
        }, {
            onConflict: 'whatsapp_id',
            ignoreDuplicates: false // Update existing records
        });

        if (error) {
            console.error(`❌ Erro ao salvar contato ${remoteJid}:`, error);
        } else {
            count++;
        }
    }

    console.log(`✅ Sincronizados ${count} contatos (${skipped} ignorados)`);
    return count;
};

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
        console.log('📦 Raw Messages Response:', data); // DEBUG

        // Evolution v2 usually returns an array of messages directly or in { messages: [...] }
        const messages = Array.isArray(data) ? data : (data.messages || []);

        // Vamos precisar do chat_id interno do supabase
        const { data: chatData } = await supabase.from('chats').select('id').eq('whatsapp_id', cleanJid).single();
        if (!chatData?.id) {
            console.warn(`⚠️ Chat local não encontrado para ${cleanJid}. Sincronize os chats primeiro.`);
            return;
        }

        let count = 0;
        for (const msg of messages) {
            // Mapeia Evolution Message -> Supabase Message
            // Verifica quem enviou. Se fromMe=true, é 'agent'. Se falso, 'user'.
            const isFromMe = msg.key?.fromMe || msg.fromMe;

            // Extract text content safely
            let textContent = '';
            if (typeof msg.content === 'string') {
                textContent = msg.content;
            } else if (msg.message) {
                textContent =
                    msg.message.conversation ||
                    msg.message.extendedTextMessage?.text ||
                    msg.message.imageMessage?.caption ||
                    '';
            }

            if (!textContent) continue;

            // Use messageTimestamp (seconds) or fallback
            // Note: Evolution might return 'pushName' in msg

            const { error } = await supabase.from('messages').upsert({
                chat_id: chatData.id,
                sender: isFromMe ? 'agent' : 'user',
                text: textContent,
                created_at: new Date((msg.messageTimestamp || Date.now() / 1000) * 1000).toISOString()
            }, { onConflict: 'created_at' }); // WARNING: 'created_at' conflict might be risky if multiple msgs per second. 
            // In a better schema, we should store message ID (msg.key.id).

            if (!error) count++;
        }
        console.log(`✅ ${count} mensagens sincronizadas para ${cleanJid}`);
        return count;

    } catch (e) {
        console.error("Erro syncMessages:", e);
    }
};