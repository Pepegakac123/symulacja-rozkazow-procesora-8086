import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Registers } from "@/components/Registers";
import { Stack } from "@/components/Stack";
import { OperationHistory } from "@/components/OperationHistory";
import { AddressRegisters } from "./components/AdressRegisters";
import { MemoryOperations } from "./components/MemoryOperations";
import { Toaster } from "@/components/ui/toaster";
export default function App() {
	return (
		<Provider store={store}>
			<div className="min-h-screen bg-gray-100 p-4">
				<header className="container mx-auto text-center mb-8">
					<h1 className="text-2xl font-bold">
						Symulator rozkazów procesora INTEL 8086
					</h1>
					<p className="text-right text-gray-600">Kacper Adamczyk</p>
				</header>

				<div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
					<Registers />
					<AddressRegisters />
					<MemoryOperations />
					<div className="space-y-4">
						<Stack />
						<OperationHistory />
					</div>
				</div>
			</div>
			<Toaster />
		</Provider>
	);
}
