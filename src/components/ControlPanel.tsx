import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ControlPanelProps } from "@/types/";
import OperationSelector from "./operationSelector";
import RegisterSelector from "./registerSelector";
import { isValidHex } from "@/utils";

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedOperation,
  sourceReg,
  destReg,
  inputValue,
  error,
  isMemoryOperation,
  onOperationChange,
  onSourceRegChange,
  onDestRegChange,
  onInputChange,
  onToggleMemoryOperation,
  onExecute,
}) => (
  <div className="space-y-4">
    <div className="flex space-x-4">
      <OperationSelector
        selectedOperation={selectedOperation}
        onOperationChange={onOperationChange}
      />

      <RegisterSelector
        value={sourceReg}
        onChange={onSourceRegChange}
        placeholder="Rejestr źródłowy"
      />

      {selectedOperation === "XCHG" && (
        <RegisterSelector
          value={destReg}
          onChange={onDestRegChange}
          placeholder="Rejestr docelowy"
        />
      )}
    </div>

    {selectedOperation === "MOV" && (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isMemoryOperation}
            onCheckedChange={onToggleMemoryOperation}
          />
          <Label>Operacja na pamięci</Label>
        </div>

        {!isMemoryOperation && (
          <Input
            type="text"
            placeholder="Wartość HEX (np. FFFF)"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="font-mono"
            maxLength={4}
          />
        )}
      </div>
    )}

    {error && (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}

    <Button
      onClick={onExecute}
      disabled={
        (selectedOperation === "MOV" && !sourceReg) ||
        (selectedOperation === "XCHG" && (!sourceReg || !destReg)) ||
        (selectedOperation === "MOV" &&
          !isMemoryOperation &&
          !isValidHex(inputValue))
      }
      className="w-full"
    >
      Wykonaj operację
    </Button>
  </div>
);

export default ControlPanel;