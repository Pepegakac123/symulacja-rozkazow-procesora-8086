import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Register, Operation, MemoryState, MemoryAddressing } from "@/types/";
import {
  executeExchange,
  executeMove,
  INITIAL_REGISTER_STATE,
  INITIAL_MEMORY_STATE,
  isValidHex,
} from "./utils";
import ControlPanel from "./components/ControlPanel";
import RegisterDisplay from "./components/registerDisplay";
import MemoryPanel from "./components/MemoryPanel";

const App: React.FC = () => {
  const [registers, setRegisters] = useState(INITIAL_REGISTER_STATE);
  const [memory, setMemory] = useState<MemoryState>(INITIAL_MEMORY_STATE);
  const [selectedOperation, setSelectedOperation] = useState<Operation>("MOV");
  const [sourceReg, setSourceReg] = useState<Register | "">("");
  const [destReg, setDestReg] = useState<Register | "">("");
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isMemoryOperation, setIsMemoryOperation] = useState(false);
  const [memoryAddressing, setMemoryAddressing] = useState<MemoryAddressing>({
    baseRegister: "0000",
    offset: "0000",
  });

  const handleInputChange = (value: string): void => {
    const upperValue = value.toUpperCase();
    setInputValue(upperValue);
    if (value === "" || isValidHex(upperValue)) {
      setError("");
    } else {
      setError("Wprowadź poprawną 4-cyfrową wartość szesnastkową");
    }
  };

  const executeOperation = (): void => {
    if (!sourceReg) return;

    if (selectedOperation === "MOV") {
      const result = executeMove(
        registers,
        sourceReg,
        destReg === "" ? undefined : destReg,
        inputValue,
        memory,
        memoryAddressing,
        isMemoryOperation
      );
      setRegisters(result.registers);
      setMemory(result.memory);
    } else if (selectedOperation === "XCHG" && destReg) {
      setRegisters(executeExchange(registers, sourceReg, destReg));
    }

    setInputValue("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Symulator procesora 8086</CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterDisplay registers={registers} />
        <ControlPanel
          selectedOperation={selectedOperation}
          sourceReg={sourceReg}
          destReg={destReg}
          inputValue={inputValue}
          error={error}
          memoryAddressing={memoryAddressing}
          isMemoryOperation={isMemoryOperation}
          onOperationChange={setSelectedOperation}
          onSourceRegChange={setSourceReg}
          onDestRegChange={setDestReg}
          onInputChange={handleInputChange}
          onMemoryAddressingChange={setMemoryAddressing}
          onToggleMemoryOperation={() => setIsMemoryOperation(!isMemoryOperation)}
          onExecute={executeOperation}
        />
        {isMemoryOperation && (
          <MemoryPanel
            memoryState={memory}
            baseRegister={memoryAddressing.baseRegister}
            offset={memoryAddressing.offset}
            onBaseRegisterChange={(value) =>
              setMemoryAddressing((prev) => ({ ...prev, baseRegister: value }))
            }
            onOffsetChange={(value) =>
              setMemoryAddressing((prev) => ({ ...prev, offset: value }))
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default App;