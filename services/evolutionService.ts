
import { supabase } from './supabase';

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL;
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY;

/**
 * Busca a foto de perfil do WhatsApp de um contato via Evolution API
 * @param instanceName Nome da instância do Evolution
 * @param remoteJid ID do contato (ex: 5511999999999@s.whatsapp.net)
 * @returns URL da foto de perfil ou null se não encontrada
 */
export const fetchProfilePicture = async (instanceName: string, remoteJid: string): Promise<string | null> => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.warn("Evolution API Credentials missing");
        return null;
    }

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfilePictureUrl/${instanceName}`, {
            method: 'POST',
            headers: {
                'apikey': EVOLUTION_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: remoteJid })
        });

        if (!response.ok) {
            console.warn(`Não foi possível buscar foto de perfil para ${remoteJid}: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.profilePictureUrl || data.picture || data.url || null;
    } catch (error) {
        console.warn(`Erro ao buscar foto de perfil para ${remoteJid}:`, error);
        return null;
    }
};

/**
 * Busca o nome/pushName do contato via Evolution API
 * @param instanceName Nome da instância do Evolution
 * @param remoteJid ID do contato (ex: 5511999999999@s.whatsapp.net)
 * @returns Nome do contato ou null se não encontrado
 */
export const fetchContactName = async (instanceName: string, remoteJid: string): Promise<string | null> => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.warn("Evolution API Credentials missing");
        return null;
    }

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfile/${instanceName}`, {
            method: 'POST',
            headers: {
                'apikey': EVOLUTION_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: remoteJid })
        });

        if (!response.ok) {
            console.warn(`Não foi possível buscar perfil para ${remoteJid}: ${response.status}`);
            return null;
        }

        const data = await response.json();
        // Tenta diferentes campos que podem conter o nome
        return data.name || data.pushName || data.notify || data.verifiedName || null;
    } catch (error) {
        console.warn(`Erro ao buscar perfil para ${remoteJid}:`, error);
        return null;
    }
};

/**
 * Atualiza a foto de perfil de um chat específico
 * @param instanceName Nome da instância do Evolution
 * @param chatId ID do chat no Supabase
 * @param remoteJid ID do contato no WhatsApp
 */
export const updateChatProfilePicture = async (instanceName: string, chatId: string, remoteJid: string): Promise<boolean> => {
    const avatarUrl = await fetchProfilePicture(instanceName, remoteJid);

    if (avatarUrl) {
        const { error } = await supabase
            .from('chats')
            .update({ avatar_url: avatarUrl })
            .eq('id', chatId);

        if (error) {
            console.error("Erro ao atualizar foto de perfil:", error);
            return false;
        }
        return true;
    }
    return false;
};

export const syncChatsFromEvolution = async (instanceName: string): Promise<number> => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.error("Evolution API Credentials missing in .env");
        throw new Error("Configurações da API Evolution ausentes.");
    }

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/chat/findChats/${instanceName}`, {
            method: 'GET',
            headers: {
                'apikey': EVOLUTION_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404 || response.status === 405) {
                const resPost = await fetch(`${EVOLUTION_API_URL}/chat/findChats/${instanceName}`, {
                    method: 'POST',
                    headers: { 'apikey': EVOLUTION_API_KEY, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ where: {} })
                });
                if (!resPost.ok) throw new Error(`Erro ao buscar chats (POST): ${resPost.statusText}`);
                return await processChatsResponse(resPost, instanceName);
            }
            throw new Error(`Erro na API Evolution: ${response.status} ${response.statusText}`);
        }

        return await processChatsResponse(response, instanceName);

    } catch (error) {
        console.error("Sync Error:", error);
        throw error;
    }
};

async function processChatsResponse(response: Response, instanceName: string): Promise<number> {
    const data = await response.json();
    const chats = Array.isArray(data) ? data : (data.data || data.return || []);

    if (!Array.isArray(chats)) {
        console.warn("Formato de resposta inesperado:", data);
        return 0;
    }

    let count = 0;

    for (const chat of chats) {
        const remoteJid = chat.id || chat.remoteJid;

        if (!remoteJid || typeof remoteJid !== 'string') continue;

        // Filtre apenas IDs que terminam em @s.whatsapp.net
        if (!remoteJid.endsWith('@s.whatsapp.net')) continue;

        // Extrai o número do telefone do remoteJid (ex: 5511999999999@s.whatsapp.net -> 5511999999999)
        const phoneNumber = remoteJid.split('@')[0];

        // Busca o nome real do contato via API (evita usar pushName que pode ser do remetente)
        let contactName = await fetchContactName(instanceName, remoteJid);

        // Se não conseguiu buscar o nome via API, usa o número como fallback
        const name = contactName || phoneNumber;

        // Tenta pegar a foto de perfil da resposta original ou buscar via API
        let avatarUrl = chat.profilePictureUrl || chat.profilePicThumb || null;

        // Se não veio foto na resposta, busca individualmente
        if (!avatarUrl) {
            avatarUrl = await fetchProfilePicture(instanceName, remoteJid);
        }

        const chatPayload = {
            whatsapp_id: remoteJid,
            name: name,
            avatar_url: avatarUrl,
            status: 'Novo Lead',
            last_message_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('chats')
            .upsert(chatPayload, { onConflict: 'whatsapp_id' });

        if (!error) count++;
        else console.error("Erro ao salvar chat:", remoteJid, error);
    }

    return count;
}
