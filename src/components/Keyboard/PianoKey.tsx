import React, { useRef, useCallback, useState } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 既にマウスダウン状態の場合は無視
    if (isMouseDownRef.current) return;
    
    isMouseDownRef.current = true;
    setIsDragging(true);
    onNoteStart(note);
  }, [note, onNoteStart]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isMouseDownRef.current) return;
    
    isMouseDownRef.current = false;
    setIsDragging(false);
    onNoteStop(note);
  }, [note, onNoteStop]);

  const handleMouseLeave = useCallback(() => {
    if (isMouseDownRef.current && isDragging) {
      // ドラッグ中の場合は、マウスが離れても音を停止しない
      // グローバルなmouseupイベントで処理される
      return;
    }
    
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsDragging(false);
      onNoteStop(note);
    }
  }, [note, onNoteStop, isDragging]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    // 他のキーからドラッグしてきた場合の処理
    // ただし、マウスボタンが押されていて、かつこのキーがまだアクティブでない場合のみ
    if (e.buttons === 1 && !isMouseDownRef.current && !isActive) {
      isMouseDownRef.current = true;
      onNoteStart(note);
    }
  }, [note, onNoteStart, isActive]);

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

  // グローバルマウスアップイベントの処理
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        setIsDragging(false);
        onNoteStop(note);
      }
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, note, onNoteStop]);

  const className = `piano-key ${isBlack ? 'black-key' : 'white-key'} ${isActive ? 'active' : ''}`;
  
  return (
    <div
      className={className}
      style={{ left: `${position}px` }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {keyboardKey && <span className="key-label">{keyboardKey.toUpperCase()}</span>}
    </div>
  );
};