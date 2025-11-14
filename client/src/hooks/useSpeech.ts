import { useCallback, useEffect, useState } from "react";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, lang: string = 'fr-FR') => {
    if (!supported) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mg' ? 'mg-MG' : 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported };
}
