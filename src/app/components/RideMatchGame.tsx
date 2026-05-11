import React, { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";

export function RideMatchGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  
  const carRef = useRef({ y: 0, vy: 0, isJumping: false });
  // Inicia muito longe da tela para garantir que não apareça no carregamento
  const pinsRef = useRef({ x: 2000 }); 
  const requestRef = useRef<number>(0);
  
  const carDOMRef = useRef<HTMLDivElement>(null);
  const pinsDOMRef = useRef<HTMLDivElement>(null);
  const wheelsDOMRef = useRef<SVGGElement>(null);

  // Física do jogo
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = 12;
  const GAME_SPEED = 6; 
  
  // Posição EXATA onde os pinos se alinham perfeitamente com as rodas
  const PERFECT_MATCH_X = -150; 

  const jump = useCallback(() => {
    if (gameState === 'playing' && !carRef.current.isJumping) {
      carRef.current.vy = -JUMP_STRENGTH;
      carRef.current.isJumping = true;
    } else if (gameState === 'idle' || gameState === 'lost' || gameState === 'won') {
      startGame();
    }
  }, [gameState]);

  const startGame = () => {
    carRef.current = { y: 0, vy: 0, isJumping: false };
    
    // Calcula a largura da tela para nascer os pinos exatamente fora da visão do usuário.
    // O Math.max garante que no celular (onde a tela é estreita) ainda tenha pelo menos 600px de distância para dar tempo de reação.
    const spawnX = typeof window !== 'undefined' ? Math.max((window.innerWidth / 2) + 150, 600) : 1000;
    pinsRef.current = { x: spawnX };
    
    if (wheelsDOMRef.current) wheelsDOMRef.current.style.opacity = '1';
    
    // Força a posição inicial no DOM imediatamente para não "piscar" na tela
    if (pinsDOMRef.current) pinsDOMRef.current.style.transform = `translateX(${spawnX}px)`;
    
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const update = () => {
      const car = carRef.current;
      const pins = pinsRef.current;

      // Aplica Gravidade
      car.vy += GRAVITY;
      car.y += car.vy;

      if (car.y >= 0) {
        car.y = 0;
        car.isJumping = false;
        car.vy = 0;
      }

      // Move os pinos para a esquerda
      pins.x -= GAME_SPEED;

      // LÓGICA DE COLISÃO (Carro visual ocupa X: -250px até -50px)
      const isOverlappingCar = (pins.x - 56 < -50) && (pins.x + 56 > -250);

      if (isOverlappingCar) {
         if (car.y > -35) { // O carro está baixo (encostando)
            // Tolerância de 20px para o pouso perfeito
            if (Math.abs(pins.x - PERFECT_MATCH_X) <= 20) {
               if (car.y >= 0) { // Pousou com sucesso
                  pins.x = PERFECT_MATCH_X; 
                  car.y = 0;
                  if (wheelsDOMRef.current) wheelsDOMRef.current.style.opacity = '0';
                  setGameState('won');
                  
                  if (carDOMRef.current) carDOMRef.current.style.transform = `translateY(${car.y}px) rotate(0deg)`;
                  if (pinsDOMRef.current) pinsDOMRef.current.style.transform = `translateX(${pins.x}px)`;
                  return;
               }
            } else {
               // Bateu nas pontas ou pousou errado
               setGameState('lost');
               return;
            }
         }
      }

      // Se os pinos passarem reto (Game Over)
      if (pins.x < -300 && gameState === 'playing') {
         setGameState('lost');
         return;
      }

      // Atualiza o DOM 
      if (carDOMRef.current) {
        const angle = car.vy * 0.4;
        carDOMRef.current.style.transform = `translateY(${car.y}px) rotate(${angle}deg)`;
      }
      if (pinsDOMRef.current) {
        pinsDOMRef.current.style.transform = `translateX(${pins.x}px)`;
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  return (
    <div 
      className="w-full h-62 relative overflow-hidden flex flex-col justify-end items-center pb-6 mt-8 mb-6 select-none cursor-pointer"
      onClick={jump}
    >
      <div className="absolute bottom-[24px] left-0 right-0 w-full border-t-[3px] border-dashed border-gray-300 opacity-60 z-0"></div>

      <div className="absolute top-6 left-0 right-0 w-full h-full flex flex-col items-center justify-start z-20 pointer-events-none px-4">
        {gameState === 'idle' && (
          <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse text-center mt-4">
            Toque na tela ou Espaço para Pular
          </span>
        )}
        
        {gameState === 'lost' && (
          <div className="flex flex-col items-center justify-center gap-3 mt-2">
            <span className="text-base sm:text-xl font-black text-gray-500 uppercase tracking-widest text-center">
              GAME OVER
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="pointer-events-auto text-gray-400 hover:text-gray-900 transition-colors p-3 bg-gray-100/50 rounded-full"
            >
              <RefreshCw className="w-7 h-7" />
            </button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="flex flex-col items-center justify-center gap-3 mt-2">
            <span className="text-base sm:text-xl font-black text-green-600 uppercase tracking-widest text-center">
              DEU MATCH!
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="pointer-events-auto text-green-500 hover:text-green-700 transition-colors p-3 bg-green-100/50 rounded-full"
            >
              <RefreshCw className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-[16px] left-1/2 w-0 flex justify-center z-10 scale-[0.6] sm:scale-100 origin-bottom">
        
        {/* PINOS (Opacidade 0 e posicionados longe enquanto estiver no estado idle) */}
        <div 
          ref={pinsDOMRef} 
          className="absolute bottom-0 transition-opacity duration-300" 
          style={{ 
            opacity: gameState === 'idle' ? 0 : 1,
            transform: gameState === 'idle' ? 'translateX(2000px)' : undefined 
          }}
        >
          <div className="absolute left-[-56px] bottom-0">
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="#10B981"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          </div>
          <div className="absolute left-[24px] bottom-0">
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="#F43F5E"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          </div>
        </div>

        <div ref={carDOMRef} className="absolute bottom-0 left-[-250px] w-[200px] h-[84px] origin-bottom">
          <svg width="200" height="84" viewBox="0 0 200 84" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="car-mask-game">
              <rect width="200" height="84" fill="white"/>
              <circle cx="60" cy="60" r="22" fill="black"/>
              <circle cx="140" cy="60" r="22" fill="black"/>
            </mask>
            
            <g mask="url(#car-mask-game)">
              <rect x="10" y="30" width="180" height="30" rx="15" fill="#2563EB"/>
              <path d="M50 30V20C50 8.9543 58.9543 0 70 0H130C141.046 0 150 8.9543 150 20V30H50Z" fill="#2563EB"/>
              <path d="M60 30V18C60 13.5817 63.5817 10 68 10H132C136.418 10 140 13.5817 140 18V30H60Z" fill="white"/>
              <circle cx="180" cy="45" r="5" fill="#FCD34D"/>
              <rect x="10" y="40" width="10" height="10" rx="3" fill="#EF4444"/>
            </g>
            
            <path d="M38 60 A 22 22 0 0 1 82 60" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M118 60 A 22 22 0 0 1 162 60" stroke="white" strokeWidth="4" strokeLinecap="round"/>

            <g ref={wheelsDOMRef} style={{ transition: 'opacity 0.2s ease-out' }}>
              <circle cx="60" cy="60" r="16" fill="#9CA3AF"/>
              <circle cx="140" cy="60" r="16" fill="#9CA3AF"/>
              <circle cx="60" cy="60" r="6" fill="#D1D5DB"/>
              <circle cx="140" cy="60" r="6" fill="#D1D5DB"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}