import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MemoryState, MemoryAddressing } from '@/types';

interface MemoryPanelProps {
  memoryState: MemoryState;
  baseRegister: string;
  offset: string;
  onBaseRegisterChange: (value: string) => void;
  onOffsetChange: (value: string) => void;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({
  memoryState,
  baseRegister,
  offset,
  onBaseRegisterChange,
  onOffsetChange,
}) => {
  // Obliczanie aktualnego adresu
  const effectiveAddress = (parseInt(baseRegister || '0', 16) + parseInt(offset || '0', 16))
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  
  // Walidacja wartości HEX
  const isValidHex = (value: string): boolean => /^[0-9A-F]*$/.test(value);
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Pamięć - Adresowanie Bazowe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rejestr bazowy BX */}
          <div>
            <Label>BX (rejestr bazowy)</Label>
            <Input
              value={baseRegister}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value === '' || (isValidHex(value) && value.length <= 4)) {
                  onBaseRegisterChange(value.padStart(4, '0'));
                }
              }}
              className="font-mono"
              maxLength={4}
              placeholder="0000"
            />
          </div>

          {/* Offset */}
          <div>
            <Label>Offset</Label>
            <Input
              value={offset}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value === '' || (isValidHex(value) && value.length <= 4)) {
                  onOffsetChange(value.padStart(4, '0'));
                }
              }}
              className="font-mono"
              maxLength={4}
              placeholder="0000"
            />
          </div>

          {/* Wyświetlanie efektywnego adresu i wartości */}
          <div className="mt-4 p-4 bg-gray-100 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <span>Efektywny adres:</span>
              <span className="font-mono">{effectiveAddress}H</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Wartość w pamięci:</span>
              <span className="font-mono">{memoryState[effectiveAddress] || '0000'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryPanel;