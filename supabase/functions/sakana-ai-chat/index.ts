import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action, imageUrl } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build messages based on action
    let requestMessages: any[] = [
      {
        role: 'system',
        content: `Kamu adalah Rizanime AI, asisten AI untuk platform rizanime. Kamu bisa membantu user dengan pertanyaan tentang anime, donghua, manga, novel, dan lainnya. Bersikaplah ramah dan engaging.

Kemampuan khusus:
- Jika user meminta generate gambar, berikan deskripsi detail tentang gambar yang akan dibuat
- Jika user mengupload gambar, analisis gambar tersebut (identifikasi anime/karakter jika ada, atau deskripsikan isi gambar)
- Berikan rekomendasi anime/manga berdasarkan preferensi user`,
      },
    ];

    // Add conversation history
    if (messages) {
      for (const msg of messages) {
        if (msg.image) {
          // Message with image
          requestMessages.push({
            role: msg.role,
            content: [
              { type: 'text', text: msg.content || 'Analyze this image' },
              { type: 'image_url', image_url: { url: msg.image } },
            ],
          });
        } else {
          requestMessages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      }
    }

    // Determine if we need image generation
    const lastMessage = messages?.[messages.length - 1];
    const needsImageGen = action === 'generate' || 
      (lastMessage?.content?.toLowerCase().includes('generate') && 
       (lastMessage?.content?.toLowerCase().includes('image') || 
        lastMessage?.content?.toLowerCase().includes('gambar') ||
        lastMessage?.content?.toLowerCase().includes('foto')));

    if (needsImageGen) {
      // Use image generation model
      const imagePrompt = lastMessage?.content || 'A beautiful anime scene';
      
      const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image',
          messages: [
            { role: 'user', content: imagePrompt }
          ],
          modalities: ['image', 'text'],
        }),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error('Image generation error:', imageResponse.status, errorText);
        throw new Error(`Image generation failed: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();
      const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      const textContent = imageData.choices?.[0]?.message?.content || 'Gambar berhasil di-generate!';

      return new Response(
        JSON.stringify({ 
          content: textContent,
          image: generatedImage,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Regular chat or image analysis
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: requestMessages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Coba lagi nanti.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Credits habis. Top up untuk melanjutkan.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respon.';

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sakana-ai-chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
