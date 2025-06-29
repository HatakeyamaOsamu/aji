import React, { useRef, useCallback } from 'react';

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  position: number;
  isActive: boolean;
  keyboardKey?: string;
  onNoteStart: (note: string) => void;
  onNoteStop: (note: string) => void;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isBlack,
  position,
  isActive,
  keyboardKey,
  onNoteStart,
  onNoteStop
}) => {
  // 重複イベント防止用のref
  const isMouseDownRef = useRef(false);
  const isTouchActiveRef = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 既にマウスダウン状態の場合は無視
    if (isMouseDownRef.current) return;
    
    isMouseDownRef.current = true;
    onNoteStart(note);
  }, [note, onNoteStart]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isMouseDownRef.current) return;
    
    isMouseDownRef.current = false;
    onNoteStop(note);
  }, [note, onNoteStop]);

  const handleMouseLeave = useCallback(() => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      onNoteStop(note);
    }
  }, [note, onNoteStop]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // タッチイベントが既にアクティブな場合は無視
    if (isTouchActiveRef.current) return;
    
    isTouchActiveRef.current = true;
    onNoteStart(note);
  }, [note, onNoteStart]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isTouchActiveRef.current) return;
    
    isTouchActiveRef.current = false;
    onNoteStop(note);
  }, [note, onNoteStop]);

  const className = `piano-key ${isBlack ? 'black-key' : 'white-key'} ${isActive ? 'active' : ''}`;
  
  return (
    <div
      className={className}
      style={{ left: `${position}px` }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      // グローバルイベントリスナーの追加
      onMouseEnter={(e) => {
        // 他のキーからドラッグしてきた場合の処理
        if (e.buttons === 1 && !isMouseDownRef.current) {
          isMouseDownRef.current = true;
          onNoteStart(note);
        }
      }}
    >
      {keyboardKey && <span className="key-label">{keyboardKey.toUpperCase()}</span>}
    </div>
  );
};